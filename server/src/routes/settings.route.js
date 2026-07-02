import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Public — frontend can read shipping settings
router.get("/", getSettings);

// Admin only — update settings
router.put("/", adminAuth, updateSettings);

export default router;
