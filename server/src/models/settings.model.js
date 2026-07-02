import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: "global"
    },
    freeShippingThreshold: {
        type: Number,
        default: 999,
        min: 0
    },
    shippingCharge: {
        type: Number,
        default: 99,
        min: 0
    },
    processingDays: {
        type: String,
        default: "3-5",
        trim: true
    }
}, { timestamps: true });

export const Settings = mongoose.model("Settings", settingsSchema);
