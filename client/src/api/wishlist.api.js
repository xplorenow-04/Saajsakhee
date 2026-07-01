import axios from "axios";

class WishlistApi {
    constructor() {
        this.baseUrl = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/wishlist`;
    }

    async getWishlist() {
        try {
            const response = await axios.get(this.baseUrl, { withCredentials: true });
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message, error };
        }
    }

    async addToWishlist(productId) {
        try {
            const response = await axios.post(this.baseUrl, { productId }, { withCredentials: true });
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message, error };
        }
    }

    async removeFromWishlist(productId) {
        try {
            const response = await axios.delete(`${this.baseUrl}/${productId}`, { withCredentials: true });
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message, error };
        }
    }
}

export const wishlistApi = new WishlistApi();
