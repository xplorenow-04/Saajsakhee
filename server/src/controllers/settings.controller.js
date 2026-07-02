import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiUtils.js";
import { Settings } from "../models/settings.model.js";

// Helper: get or create the singleton settings document
const getOrCreateSettings = async () => {
    let settings = await Settings.findOne({ key: "global" });
    if (!settings) {
        settings = await Settings.create({
            key: "global",
            freeShippingThreshold: 999,
            shippingCharge: 99,
            processingDays: "3-5"
        });
    }
    return settings;
};

// Public: GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    return res.status(200).json(
        new ApiResponse(200, {
            freeShippingThreshold: settings.freeShippingThreshold,
            shippingCharge: settings.shippingCharge,
            processingDays: settings.processingDays
        }, "Settings fetched successfully")
    );
});

// Admin: PUT /api/settings
export const updateSettings = asyncHandler(async (req, res) => {
    const { freeShippingThreshold, shippingCharge, processingDays } = req.body;

    const settings = await getOrCreateSettings();

    if (freeShippingThreshold !== undefined && freeShippingThreshold !== "") {
        const val = Number(freeShippingThreshold);
        if (isNaN(val) || val < 0) {
            return res.status(400).json(new ApiResponse(400, null, "Free shipping threshold must be a non-negative number"));
        }
        settings.freeShippingThreshold = val;
    }
    if (shippingCharge !== undefined && shippingCharge !== "") {
        const val = Number(shippingCharge);
        if (isNaN(val) || val < 0) {
            return res.status(400).json(new ApiResponse(400, null, "Shipping charge must be a non-negative number"));
        }
        settings.shippingCharge = val;
    }
    if (processingDays !== undefined && processingDays.trim() !== "") {
        settings.processingDays = processingDays.trim();
    }

    await settings.save();

    return res.status(200).json(
        new ApiResponse(200, {
            freeShippingThreshold: settings.freeShippingThreshold,
            shippingCharge: settings.shippingCharge,
            processingDays: settings.processingDays
        }, "Settings updated successfully")
    );
});
