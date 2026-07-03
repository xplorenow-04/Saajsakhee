import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, X, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "../../api/product.api";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import LoadingSkeleton from "../../components/ecommerce/LoadingSkeleton";
import EmptyState from "../../components/ecommerce/EmptyState";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await productApi.getCategories();
                if (res.success) {
                    setCategories(res.data || []);
                } else {
                    toast.error(res.message || "Failed to load categories");
                }
            } catch {
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        if (!searchInput.trim()) return categories;
        const q = searchInput.trim().toLowerCase();
        return categories.filter((cat) => cat.name?.toLowerCase().includes(q));
    }, [categories, searchInput]);

    return (
        <div className="min-h-screen bg-surface-900">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                            Collections
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-luxury text-gradient-gold mt-2">
                            All Categories
                        </h1>
                        <p className="text-text-muted text-sm mt-1.5 max-w-md mx-auto">
                            Browse our full range of curated categories designed for every occasion
                        </p>
                        {!loading && (
                            <p className="text-xs text-text-muted mt-3">
                                {filteredCategories.length} categor
                                {filteredCategories.length !== 1 ? "ies" : "y"} available
                            </p>
                        )}
                    </div>

                    {/* Search */}
                    <div className="max-w-md mx-auto mb-10">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                            />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full bg-surface-800 border border-surface-600 rounded-xl pl-10 pr-10 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => setSearchInput("")}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            <LoadingSkeleton type="card" count={8} />
                        </div>
                    ) : filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {filteredCategories.map((cat) => (
                                <Link
                                    key={cat._id || cat.slug}
                                    to={`/shop?category=${cat.slug}`}
                                    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-800 border border-surface-700/50 hover:border-accent/30 transition-all duration-300"
                                >
                                    {cat.image?.url || cat.image ? (
                                        <img
                                            src={cat.image?.url || cat.image}
                                            alt={cat.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-violet/20 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-accent/30">
                                                {cat.name?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                                        <h3 className="text-base lg:text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                                            <span>Explore</span>
                                            <ArrowRight
                                                size={12}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={LayoutGrid}
                            title="No categories found"
                            description={
                                searchInput
                                    ? "Try a different search term"
                                    : "No categories available right now"
                            }
                            actionLabel={searchInput ? "Clear Search" : undefined}
                            actionLink={searchInput ? undefined : undefined}
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}