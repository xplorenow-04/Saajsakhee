import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiUtils.js";
import { logger } from "../utils/logger.js";

class WishlistService {
    async getWishlist(userId) {
        let wishlist = await Wishlist.findOne({ user: userId }).populate({
            path: "items.product",
            select: "name price discount images category isActive slug"
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [] });
        }

        // Optional: filter out inactive products
        wishlist.items = wishlist.items.filter(item => item.product && item.product.isActive);

        return wishlist;
    }

    async addToWishlist(userId, productId) {
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            throw new ApiError(404, "Product not found or unavailable");
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        const existingItem = wishlist.items.find(
            item => item.product.toString() === productId
        );

        if (!existingItem) {
            wishlist.items.push({
                product: productId
            });
            await wishlist.save();
            logger.info("Item added to wishlist", { userId, productId });
        }

        return this.getWishlist(userId);
    }

    async removeFromWishlist(userId, productId) {
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) throw new ApiError(404, "Wishlist not found");

        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
        await wishlist.save();

        logger.info("Item removed from wishlist", { userId, productId });
        return this.getWishlist(userId);
    }
}

export const wishlistService = new WishlistService();
