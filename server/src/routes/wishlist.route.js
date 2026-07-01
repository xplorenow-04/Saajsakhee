import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} from "../controllers/wishlist.controller.js";

const router = Router();

router.use(userAuth);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
