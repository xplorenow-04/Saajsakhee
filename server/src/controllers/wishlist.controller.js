import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiUtils.js";
import { wishlistService } from "../services/wishlist.service.js";

export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user._id);

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Wishlist fetched successfully")
    );
});

export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const wishlist = await wishlistService.addToWishlist(req.user._id, productId);

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Item added to wishlist")
    );
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const wishlist = await wishlistService.removeFromWishlist(req.user._id, productId);

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Item removed from wishlist")
    );
});
