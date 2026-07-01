import { create } from "zustand";
import { wishlistApi } from "../api/wishlist.api";

export const useWishlistStore = create((set, get) => ({
    wishlist: null,
    wishlistLoading: false,

    fetchWishlist: async () => {
        set({ wishlistLoading: true });
        const res = await wishlistApi.getWishlist();
        if (res.success && res.data) {
            set({ wishlist: res.data, wishlistLoading: false });
        } else {
            set({ wishlistLoading: false });
        }
        return res;
    },

    addToWishlist: async (productId) => {
        const res = await wishlistApi.addToWishlist(productId);
        if (res.success && res.data) {
            set({ wishlist: res.data });
        }
        return res;
    },

    removeFromWishlist: async (productId) => {
        const res = await wishlistApi.removeFromWishlist(productId);
        if (res.success && res.data) {
            set({ wishlist: res.data });
        }
        return res;
    },

    isInWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (!wishlist || !wishlist.items) return false;
        return wishlist.items.some(item => 
            (item.product?._id || item.product) === productId
        );
    }
}));
