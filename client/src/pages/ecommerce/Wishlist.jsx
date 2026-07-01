import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "../../store/useWishlistStore";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import ProductCard from "../../components/ecommerce/ProductCard";
import LoadingSkeleton from "../../components/ecommerce/LoadingSkeleton";

export default function Wishlist() {
  const { wishlist, wishlistLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isEmpty = !wishlist || !wishlist.items || wishlist.items.length === 0;

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-text-primary">My Wishlist</h1>
            {!wishlistLoading && !isEmpty && (
              <span className="bg-surface-800 text-gold-400 text-sm font-semibold px-3 py-1 rounded-full border border-surface-700">
                {wishlist.items.length} Items
              </span>
            )}
          </div>

          {wishlistLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} type="card" count={1} />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-800/30 rounded-2xl border border-surface-700/50 text-center">
              <div className="w-24 h-24 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center mb-6 shadow-lg relative">
                <Heart size={40} className="text-gold-400/50" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface-900 rounded-full border-4 border-surface-800 flex items-center justify-center">
                  <span className="text-text-muted text-lg font-bold">0</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                Save items you love and build your dream collection. Discover our latest arrivals and find something special.
              </p>
              <Link
                to="/shop"
                className="bg-gradient-to-r from-gold-200 via-gold-500 to-gold-600 text-neutral-950 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.5)] active:scale-[0.98]"
              >
                Start Exploring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {wishlist.items.map((item) => (
                <ProductCard
                  key={item._id || item.product?._id}
                  product={item.product}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
