import PDFDocument from "pdfkit";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Analytics } from "../models/analytics.model.js";
import { ApiError } from "../utils/apiUtils.js";
import { logger } from "../utils/logger.js";
import { redisService } from "./redis.service.js";

class OrderService {
    async placeOrder(userId, shippingAddress) {
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }

        const { orderedProducts, totalPrice, totalDiscount } = await this._processCartItems(cart.items);

        const finalAmount = totalPrice - totalDiscount;

        const order = await Order.create({
            user: userId,
            orderedProducts,
            totalPrice,
            totalDiscount,
            finalAmount,
            shippingAddress,
            orderStatus: "pending"
        });

        cart.items = [];
        await cart.save();

        await this._updateAnalytics(finalAmount, orderedProducts.length);
        await redisService.delByPattern("admin:*");

        logger.info("Order placed", { orderId: order.orderId, userId, amount: finalAmount });
        return order;
    }

    async placeGuestOrder(products, guestInfo, shippingAddress) {
        if (!products || products.length === 0) {
            throw new ApiError(400, "No products specified");
        }

        const orderedProducts = [];
        let totalPrice = 0;
        let totalDiscount = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isActive) {
                throw new ApiError(400, "Product not found or unavailable");
            }

            const sizeData = product.sizes.find(s => s.size === item.size);
            if (!sizeData || sizeData.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} - size ${item.size}`);
            }

            const itemPrice = product.price * item.quantity;
            const itemDiscount = (product.price * (product.discount || 0) / 100) * item.quantity;
            const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

            orderedProducts.push({
                product: product._id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                price: discountedPrice,
                discount: product.discount || 0,
                image: product.images?.[0]?.url || ""
            });

            totalPrice += itemPrice;
            totalDiscount += itemDiscount;

            sizeData.stock -= item.quantity;
            await product.save();
        }

        const finalAmount = totalPrice - totalDiscount;

        const order = await Order.create({
            isGuestOrder: true,
            guestInfo: {
                name: guestInfo.name,
                phone: guestInfo.phone,
                address: guestInfo.address,
                city: guestInfo.city,
                state: guestInfo.state || "",
                pincode: guestInfo.pincode
            },
            orderedProducts,
            totalPrice,
            totalDiscount,
            finalAmount,
            shippingAddress: {
                name: guestInfo.name,
                phone: guestInfo.phone,
                address: guestInfo.address,
                city: guestInfo.city,
                pincode: guestInfo.pincode
            },
            orderStatus: "pending"
        });

        await this._updateAnalytics(finalAmount, orderedProducts.length);
        await redisService.delByPattern("admin:*");

        logger.info("Guest order placed", { orderId: order.orderId, amount: finalAmount });
        return order;
    }

    async createManualOrder(adminId, data) {
        const orderedProducts = [];
        let totalPrice = 0;
        let totalDiscount = 0;

        for (const item of data.products) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isActive) {
                throw new ApiError(400, `Product not found: ${item.productId}`);
            }

            const sizeData = product.sizes.find(s => s.size === item.size);
            if (!sizeData || sizeData.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} - size ${item.size}`);
            }

            const itemPrice = product.price * item.quantity;
            const itemDiscount = (product.price * (product.discount || 0) / 100) * item.quantity;
            const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

            orderedProducts.push({
                product: product._id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                price: discountedPrice,
                discount: product.discount || 0,
                image: product.images?.[0]?.url || ""
            });

            totalPrice += itemPrice;
            totalDiscount += itemDiscount;

            sizeData.stock -= item.quantity;
            await product.save();
        }

        const finalAmount = totalPrice - totalDiscount;

        const shippingAddress = {
            name: data.customerName,
            phone: data.customerPhone,
            address: data.customerAddress,
            city: data.customerCity,
            pincode: data.customerPincode
        };

        const order = await Order.create({
            orderedProducts,
            totalPrice,
            totalDiscount,
            finalAmount,
            shippingAddress,
            orderStatus: data.orderStatus || "pending"
        });

        await this._updateAnalytics(finalAmount, orderedProducts.length);
        await redisService.delByPattern("admin:*");

        logger.info("Manual order created by admin", { orderId: order.orderId, adminId });
        return order;
    }

    async getOrderById(orderId, userId = null) {
        const query = userId ? { orderId, user: userId } : { orderId };
        const order = await Order.findOne(query).populate("orderedProducts.product");
        if (!order) throw new ApiError(404, "Order not found");
        return order;
    }

    async getUserOrders(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Order.countDocuments({ user: userId })
        ]);

        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ orderId });
        if (!order) throw new ApiError(404, "Order not found");

        if (order.user && order.user.toString() !== userId.toString()) {
            throw new ApiError(403, "Not authorized to cancel this order");
        }

        if (!["pending", "confirmed"].includes(order.orderStatus)) {
            throw new ApiError(400, "Order cannot be cancelled at current status");
        }

        await this._restoreStock(order);

        order.orderStatus = "cancelled";
        await order.save();

        await this._updateCancelledAnalytics();
        await redisService.delByPattern("admin:*");

        logger.info("Order cancelled", { orderId: order.orderId, userId });
        return order;
    }

    async adminGetAllOrders(query, page = 1, limit = 20) {
        const filter = {};
        if (query.status) filter.orderStatus = query.status;
        if (query.search) {
            filter.$or = [
                { orderId: { $regex: query.search, $options: "i" } },
                { "shippingAddress.name": { $regex: query.search, $options: "i" } },
                { "shippingAddress.phone": { $regex: query.search, $options: "i" } },
                { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: query.search, options: "i" } } }
            ];
        }
        if (query.isGuestOrder) filter.isGuestOrder = query.isGuestOrder === "true";

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
                .populate("user", "name email").lean(),
            Order.countDocuments(filter)
        ]);

        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    async adminUpdateOrderStatus(orderId, status) {
        const validStatuses = ["pending", "confirmed", "processing", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid order status");
        }

        const order = await Order.findOne({ orderId });
        if (!order) throw new ApiError(404, "Order not found");

        if (order.orderStatus === "cancelled" && status !== "cancelled") {
            throw new ApiError(400, "Cannot change status of cancelled order");
        }

        if (order.orderStatus === "delivered") {
            throw new ApiError(400, "Cannot change status of delivered order");
        }

        order.orderStatus = status;
        await order.save();
        await redisService.delByPattern("admin:*");

        logger.info("Order status updated", { orderId, status, updatedBy: "admin" });
        return order;
    }

    async deleteOrder(orderId) {
        const order = await Order.findOne({ orderId });
        if (!order) throw new ApiError(404, "Order not found");

        await Order.findByIdAndDelete(order._id);
        await redisService.delByPattern("admin:*");

        logger.info("Order deleted", { orderId });
        return { deleted: true };
    }

    async getOrderAnalytics() {
        const cacheKey = "admin:analytics";
        const cached = await redisService.get(cacheKey);
        if (cached) return cached;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalOrders, totalRevenue, ordersByStatus, dailyStats, recentOrders] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([
                { $match: { orderStatus: { $ne: "cancelled" } } },
                { $group: { _id: null, total: { $sum: "$finalAmount" } } }
            ]),
            Order.aggregate([
                { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        orders: { $sum: 1 },
                        revenue: { $sum: "$finalAmount" }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name").lean()
        ]);

        const statusCounts = {};
        ordersByStatus.forEach(s => { statusCounts[s._id] = s.count; });

        const result = {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            ordersByStatus: statusCounts,
            dailyStats,
            recentOrders
        };

        await redisService.set(cacheKey, result, 600);
        return result;
    }

    async exportOrdersPDF() {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .lean();

        const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });
        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));

        return new Promise((resolve, reject) => {
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // ---- Design tokens (minimal, mostly neutral palette) ----
            const COLORS = {
                ink: "#111827",        // primary text
                subink: "#6b7280",     // secondary text
                faint: "#9ca3af",      // tertiary text
                border: "#e5e7eb",     // hairlines
                headerBg: "#f9fafb",   // table header / zebra bg
                accent: "#4f46e5",     // single accent, used sparingly
                good: "#059669",
                bad: "#dc2626",
                warn: "#b45309",
            };
            const STATUS_COLOR = {
                pending: COLORS.warn,
                confirmed: COLORS.accent,
                processing: COLORS.accent,
                delivered: COLORS.good,
                cancelled: COLORS.bad,
            };

            const marginX = 40;
            const pageWidth = doc.page.width - marginX * 2;
            const pageBottom = doc.page.height - 50;
            let y = 40;

            const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

            // ---- Reusable primitives ----
            const hr = (color = COLORS.border, top = 0) => {
                y += top;
                doc.moveTo(marginX, y).lineTo(marginX + pageWidth, y)
                    .strokeColor(color).lineWidth(0.75).stroke();
            };

            const ensureSpace = (needed, onNewPage) => {
                if (y + needed > pageBottom) {
                    doc.addPage();
                    y = 40;
                    if (onNewPage) onNewPage();
                }
            };

            // ---- Header (letterhead style, single brand mark) ----
            const drawHeader = (isFirstPage) => {
                if (isFirstPage) {
                    doc.fontSize(18).font("Helvetica-Bold").fillColor(COLORS.ink)
                        .text("SAAJSAKHEE", marginX, y);
                    doc.fontSize(9).font("Helvetica").fillColor(COLORS.subink)
                        .text("Orders Report", marginX, y + 22);

                    doc.fontSize(8).font("Helvetica").fillColor(COLORS.subink)
                        .text(
                            `Generated ${new Date().toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}`,
                            marginX,
                            y,
                            { width: pageWidth, align: "right" }
                        );
                    y += 40;
                    hr(COLORS.ink);
                    y += 18;
                } else {
                    doc.fontSize(9).font("Helvetica-Bold").fillColor(COLORS.subink)
                        .text("SAAJSAKHEE — Orders Report", marginX, y);
                    y += 14;
                    hr(COLORS.border);
                    y += 14;
                }
            };

            // ---- Summary strip: label/value pairs, no boxes/fills ----
            const drawSummary = () => {
                const total = orders.length;
                const delivered = orders.filter((o) => o.orderStatus === "delivered").length;
                const cancelled = orders.filter((o) => o.orderStatus === "cancelled").length;
                const pending = orders.filter((o) => o.orderStatus === "pending").length;
                const revenue = orders
                    .filter((o) => o.orderStatus !== "cancelled")
                    .reduce((sum, o) => sum + (o.finalAmount || 0), 0);

                const stats = [
                    { label: "TOTAL ORDERS", value: String(total) },
                    { label: "NET REVENUE", value: money(revenue) },
                    { label: "DELIVERED", value: String(delivered) },
                    { label: "PENDING", value: String(pending) },
                    { label: "CANCELLED", value: String(cancelled) },
                ];

                const colW = pageWidth / stats.length;
                stats.forEach((s, i) => {
                    const x = marginX + i * colW;
                    doc.fontSize(7).font("Helvetica").fillColor(COLORS.faint)
                        .text(s.label, x, y, { width: colW - 10, characterSpacing: 0.4 });
                    doc.fontSize(13).font("Helvetica-Bold").fillColor(COLORS.ink)
                        .text(s.value, x, y + 11, { width: colW - 10 });
                });
                y += 40;
                hr(COLORS.border);
                y += 16;
            };

            // ---- Table column layout ----
            const cols = [
                { key: "id", label: "ORDER ID", x: marginX, w: 78, align: "left" },
                { key: "customer", label: "CUSTOMER", x: marginX + 78, w: 118, align: "left" },
                { key: "items", label: "ITEMS", x: marginX + 196, w: 40, align: "center" },
                { key: "total", label: "TOTAL", x: marginX + 236, w: 74, align: "right" },
                { key: "status", label: "STATUS", x: marginX + 318, w: 70, align: "left" },
                { key: "date", label: "DATE", x: marginX + 396, w: pageWidth - 396, align: "right" },
            ];

            const drawTableHeader = () => {
                doc.fontSize(7.5).font("Helvetica-Bold").fillColor(COLORS.subink);
                cols.forEach((c) =>
                    doc.text(c.label, c.x, y, { width: c.w, align: c.align, characterSpacing: 0.3 })
                );
                y += 14;
                hr(COLORS.ink);
                y += 10;
            };

            const drawOrderRow = (order) => {
                const customer =
                    order.shippingAddress?.name || order.user?.name || order.guestInfo?.name || "N/A";
                const itemCount = order.orderedProducts?.length || 0;
                const status = order.orderStatus || "pending";
                const date = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : "--";
                const orderId = (order.orderId || order._id?.toString().slice(-8) || "").toString();

                ensureSpace(26, () => {
                    drawHeader(false);
                    drawTableHeader();
                });

                const rowTop = y;

                doc.fontSize(8).font("Helvetica-Bold").fillColor(COLORS.ink)
                    .text(orderId.slice(-10), cols[0].x, rowTop, { width: cols[0].w });

                doc.font("Helvetica").fillColor(COLORS.ink)
                    .text(customer.length > 20 ? customer.slice(0, 18) + "…" : customer, cols[1].x, rowTop, {
                        width: cols[1].w,
                    });

                doc.fillColor(COLORS.subink)
                    .text(String(itemCount), cols[2].x, rowTop, { width: cols[2].w, align: "center" });

                doc.font("Helvetica-Bold").fillColor(COLORS.ink)
                    .text(money(order.finalAmount), cols[3].x, rowTop, { width: cols[3].w, align: "right" });

                doc.font("Helvetica-Bold").fillColor(STATUS_COLOR[status] || COLORS.subink).fontSize(7.5)
                    .text(status.charAt(0).toUpperCase() + status.slice(1), cols[4].x, rowTop + 0.5, {
                        width: cols[4].w,
                    });

                doc.font("Helvetica").fillColor(COLORS.subink).fontSize(8)
                    .text(date, cols[5].x, rowTop, { width: cols[5].w, align: "right" });

                y = rowTop + 16;

                // Line items — indented sub-table, quiet styling
                if (order.orderedProducts?.length) {
                    order.orderedProducts.forEach((p) => {
                        ensureSpace(12, () => {
                            drawHeader(false);
                            drawTableHeader();
                        });
                        const lineTotal = (p.price || 0) * (p.quantity || 1);
                        doc.fontSize(7.5).font("Helvetica").fillColor(COLORS.faint)
                            .text(`${p.name}${p.size ? ` (${p.size})` : ""}`, cols[1].x, y, {
                                width: cols[1].w + cols[2].w,
                            });
                        doc.text(`x${p.quantity || 1}`, cols[2].x, y, { width: cols[2].w, align: "center" });
                        doc.text(money(lineTotal), cols[3].x, y, { width: cols[3].w, align: "right" });
                        y += 11;
                    });
                    y += 3;
                }

                hr(COLORS.border);
                y += 10;
            };

            // ---- Footer with page numbers ----
            const drawFooters = () => {
                const range = doc.bufferedPageRange();
                for (let i = range.start; i < range.start + range.count; i++) {
                    doc.switchToPage(i);
                    doc.fontSize(7.5).font("Helvetica").fillColor(COLORS.faint)
                        .text(
                            `Page ${i - range.start + 1} of ${range.count}`,
                            marginX,
                            doc.page.height - 34,
                            { width: pageWidth, align: "center" }
                        );
                }
            };

            // ---- Build document ----
            drawHeader(true);
            drawSummary();

            if (orders.length === 0) {
                doc.fontSize(10).font("Helvetica").fillColor(COLORS.faint)
                    .text("No orders found.", marginX, y + 10);
            } else {
                drawTableHeader();
                orders.forEach((order) => drawOrderRow(order));
            }

            drawFooters();
            doc.end();
        });
    }

    async _processCartItems(cartItems) {
        const orderedProducts = [];
        let totalPrice = 0;
        let totalDiscount = 0;

        for (const item of cartItems) {
            const product = item.product;
            if (!product || !product.isActive) {
                throw new ApiError(400, `Product "${product?.name || 'Unknown'}" is no longer available`);
            }

            const sizeData = product.sizes.find(s => s.size === item.size);
            if (!sizeData || sizeData.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} - size ${item.size}`);
            }

            const itemPrice = product.price * item.quantity;
            const itemDiscount = (product.price * (product.discount || 0) / 100) * item.quantity;
            const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

            orderedProducts.push({
                product: product._id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                price: discountedPrice,
                discount: product.discount || 0,
                image: product.images?.[0]?.url || ""
            });

            totalPrice += itemPrice;
            totalDiscount += itemDiscount;

            sizeData.stock -= item.quantity;
            await product.save();
        }

        return { orderedProducts, totalPrice, totalDiscount };
    }

    async _restoreStock(order) {
        for (const item of order.orderedProducts) {
            try {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { "sizes.$[elem].stock": item.quantity }
                }, {
                    arrayFilters: [{ "elem.size": item.size }]
                });
            } catch (e) {
                logger.warn("Stock restore failed on cancel", { error: e.message });
            }
        }
    }

    async _updateAnalytics(finalAmount, productsSold) {
        try {
            await Analytics.findOneAndUpdate(
                { date: new Date().toISOString().split("T")[0] },
                {
                    $inc: {
                        totalOrders: 1,
                        totalRevenue: finalAmount,
                        totalProductsSold: productsSold
                    }
                },
                { upsert: true }
            );
        } catch (e) {
            logger.warn("Analytics update failed", { error: e.message });
        }
    }

    async _updateCancelledAnalytics() {
        try {
            await Analytics.findOneAndUpdate(
                { date: new Date().toISOString().split("T")[0] },
                { $inc: { cancelledOrders: 1 } },
                { upsert: true }
            );
        } catch (e) {
            logger.warn("Analytics update failed", { error: e.message });
        }
    }
}

export const orderService = new OrderService();
