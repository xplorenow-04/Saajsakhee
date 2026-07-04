import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, Heart, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEcommerceStore } from "../../store/useEcommerceStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { userAuthStore } from "../../store/userStore";
import LoadingSkeleton from "./LoadingSkeleton";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23333'%3E%3Crect width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product, loading = false }) {
  const navigate = useNavigate();
  const { addToCart } = useEcommerceStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const user = userAuthStore((s) => s.user);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);

  const inWishlist = isInWishlist(product?._id);

  if (loading) {
    return <LoadingSkeleton type="card" count={1} />;
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const {
    _id,
    name,
    slug,
    price,
    discount = 0,
    images = [],
    sizes = [],
    category = "",
  } = product;

  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const displayImage = images?.[0]?.url || images?.[0] || fallbackImage;
  const displayCategory =
    typeof category === "object" ? category?.name : category;

  const defaultSize = selectedSize || sizes?.[0]?.size || sizes?.[0] || null;

  const handleAddToCart = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!defaultSize) {
      toast.error("Please select a size");
      return;
    }
    setAdding(true);
    try {
      await addToCart(_id, defaultSize, 1);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/shop/${slug || _id}`;
    const title = name || "Product";
    const text = `Check out ${title} on Saajsakhee!`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Link
      to={`/shop/${slug || _id}`}
      className="group block bg-surface-800 rounded-xl overflow-hidden border border-surface-600/30 hover:border-gold-500/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.06)] hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-700">
        <img
          src={displayImage}
          alt={name || "Product"}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-danger text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg">
            -{Math.round(discount)}%
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-350 flex items-center justify-center gap-3">

          {
            user?.role !== "admin" &&       // -------- Only Visisble to User not Admin ----------------

            <>

              <button
                onClick={handleAddToCart}
                disabled={adding || !defaultSize}
                className="hidden xl:block bg-gradient-to-r from-gold-200 to-gold-500 text-neutral-950 p-3 rounded-full hover:from-gold-300 hover:to-gold-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`hidden xl:block p-3 rounded-full transition-all duration-200 shadow-lg active:scale-95 border ${inWishlist
                  ? "bg-gold-500/20 border-gold-500 text-gold-400"
                  : "bg-surface-800/80 backdrop-blur-sm border-surface-600 text-gold-400 hover:bg-surface-700"
                  }`}
              >
                <Heart size={18} className={inWishlist ? "fill-gold-400" : ""} />
              </button>


            </>
          }

          <div className="hidden xl:block bg-surface-800/80 backdrop-blur-sm border border-surface-600 text-gold-400 p-3 rounded-full hover:bg-surface-700 transition-all duration-200 shadow-lg cursor-pointer">
            <Eye size={18} />
          </div>

          <button
            onClick={handleShare}
            className="hidden xl:block bg-surface-800/80 backdrop-blur-sm border border-surface-600 text-gold-400 p-3 rounded-full hover:bg-surface-700 transition-all duration-200 shadow-lg cursor-pointer active:scale-95"
            title="Share Product"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Category Tag */}
        {displayCategory && (
          <>
            <div className="hidden sm:block absolute top-3 right-3 bg-surface-950/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-widest">
              {displayCategory}
            </div>

            <div className="block sm:hidden absolute bottom-3 right-3 bg-surface-950/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-widest">
              {displayCategory}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {name || "Unnamed Product"}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-accent">
            {formatPrice(discountedPrice)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Size Options */}
        {sizes && sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((s) => {
              const sizeValue = s?.size || s;
              const isSelected = defaultSize === sizeValue;
              const outOfStock = s?.quantity !== undefined && s.quantity === 0;
              return (
                <button
                  key={sizeValue}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!outOfStock) setSelectedSize(sizeValue);
                  }}
                  disabled={outOfStock}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all ${isSelected
                    ? "bg-gradient-to-r from-gold-200 to-gold-500 border-transparent text-neutral-950"
                    : outOfStock
                      ? "bg-surface-800/50 border-surface-600 text-text-muted/20 line-through cursor-not-allowed"
                      : "bg-surface-950 border-surface-600 text-text-secondary hover:border-gold-500/40 hover:text-gold-400"
                    }`}
                >
                  {sizeValue}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Quick Add */}
        <button
          onClick={handleAddToCart}
          disabled={adding || !defaultSize}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-200 via-gold-500 to-gold-600 text-neutral-950 text-sm font-bold py-2.5 rounded-lg transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={16} />
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
