import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Mail,
  Shield,
  BarChart2,
  Package,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "../../api/product.api";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import ProductCard from "../../components/ecommerce/ProductCard";
import LoadingSkeleton from "../../components/ecommerce/LoadingSkeleton";
import { userAuthStore } from "../../store/userStore";
import { useShippingSettings } from "../../hooks/useShippingSettings";


const bgImages = [
  "https://res.cloudinary.com/drftighpf/image/upload/v1782993691/ChatGPT_Image_Jul_2_2026_05_31_04_PM_pb3xnv.png",

  "https://res.cloudinary.com/dzgtlxfhv/image/upload/v1783087192/ChatGPT_Image_Jul_3_2026_07_29_33_PM_xw0axv.png",

  // "https://res.cloudinary.com/drftighpf/image/upload/v1782994183/ChatGPT_Image_Jul_2_2026_05_39_23_PM_qe3imr.png",
  "https://res.cloudinary.com/drftighpf/image/upload/v1782995700/ChatGPT_Image_Jul_2_2026_06_04_23_PM_fokuu5.png",

  "https://res.cloudinary.com/drftighpf/image/upload/v1782994438/ChatGPT_Image_Jul_2_2026_05_43_40_PM_dospsm.png",

  "https://res.cloudinary.com/dzgtlxfhv/image/upload/v1783086977/ChatGPT_Image_Jul_3_2026_07_23_49_PM_vuxxil.png"

];

const bgImagesMobile = [
  "https://res.cloudinary.com/drftighpf/image/upload/v1782995700/ChatGPT_Image_Jul_2_2026_06_04_23_PM_fokuu5.png",
  "https://res.cloudinary.com/drftighpf/image/upload/v1782994525/ChatGPT_Image_Jul_2_2026_05_45_15_PM_spa0s0.png",

  "https://res.cloudinary.com/dzgtlxfhv/image/upload/v1783087353/ChatGPT_Image_Jul_3_2026_07_32_21_PM_ib2l95.png",
  "https://res.cloudinary.com/dzgtlxfhv/image/upload/v1783086817/ChatGPT_Image_Jul_3_2026_07_22_06_PM_n2xp6p.png",
];

// Vertical focal point for the hero slideshow images, expressed as a
// background-position percentage. 0% = hard top, 50% = dead center.
// Lowering this pulls the visible "window" upward so faces near the
// top of tall portrait images don't get cropped off by bg-cover.
// Tune per-image if some models are framed higher/lower than others —
// just swap this constant for a lookup keyed by index.
const HERO_FOCAL_Y = "15%";

// How long each hero background image stays on screen before crossfading
// to the next one. This was previously firing every 1000ms, which meant
// each slide barely finished fading in before the next one started and
// the Ken Burns zoom (a 9s animation) never had time to actually read as
// a "zoom" — it just visibly snapped. 6s gives each image room to fade
// in, hold, and start zooming before the next crossfade begins.
const SLIDE_DURATION_MS = 6000;
// Crossfade length between slides. Longer than the old 700ms so the
// transition itself feels deliberate instead of abrupt.
const CROSSFADE_MS = 1400;

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Landing() {
  const { user } = userAuthStore();
  const isAdmin = user?.role === "admin";
  const { settings } = useShippingSettings();

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: `On orders above ₹${settings?.freeShippingThreshold || 0}`,
    },
    {
      icon: RefreshCw,
      title: "Exchange Available",
      desc: "No refund, only exchange",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      desc: "Handpicked collections",
    },
    {
      icon: Truck,
      title: "Shipping Charges",
      desc: "₹" + settings?.shippingCharge || "1000"
    },
  ];

  // Rotating hero headlines — women's fashion / traditional-wear themed.
  // Each entry is { line1, line2 } where line2 renders in the gold gradient.
  const heroHeadlines = [
    { line1: "Celebrate Grace,", line2: "Wear Tradition" },
    { line1: "Timeless Elegance,", line2: "Modern Grace" },
    { line1: "Drape Heritage,", line2: "Redefine Style" },
  ];

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  // Typewriter effect state for the rotating hero headline: how many
  // characters of the current line are visible, and whether we're
  // currently typing forward or deleting backward.
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [typePhase, setTypePhase] = useState("typing"); // "typing" | "deleting"
  // Brief highlight pulse fired on every background transition so the
  // headline/description feel synchronized with the slideshow instead of
  // sitting static on top of it.
  const [bgPulse, setBgPulse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const images = isMobile ? bgImagesMobile : bgImages;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [featuredRes, categoriesRes, trendingRes] = await Promise.all([
          productApi.getFeatured(),
          productApi.getCategories(),
          productApi.listProducts({ sort: "popular", limit: 8 }),
        ]);
        if (featuredRes.success) setFeaturedProducts(featuredRes.data || []);
        if (categoriesRes.success) setCategories(categoriesRes.data || []);
        if (trendingRes.success)
          setTrending(trendingRes.data?.products || trendingRes.data || []);
      } catch {
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  // Typewriter effect: types out the current headline, pauses, deletes it,
  // then moves to the next headline and types that one — a continuous
  // type → pause → erase → type loop rather than an instant text swap.
  useEffect(() => {
    const current = heroHeadlines[headlineIndex];
    const fullText = `${current.line1} ${current.line2}`;
    let timeout;

    if (typePhase === "typing") {
      if (typedLength < fullText.length) {
        timeout = setTimeout(() => setTypedLength((l) => l + 1), 60);
      } else {
        // Full line typed — hold it on screen before erasing.
        timeout = setTimeout(() => setTypePhase("deleting"), 2000);
      }
    } else {
      if (typedLength > 0) {
        // Deleting a touch faster than typing reads as natural, but not
        // so fast it feels like a glitch next to the slower background.
        timeout = setTimeout(() => setTypedLength((l) => l - 1), 32);
      } else {
        timeout = setTimeout(() => {
          setHeadlineIndex((i) => (i + 1) % heroHeadlines.length);
          setTypePhase("typing");
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedLength, typePhase, headlineIndex]);

  useEffect(() => {
    [...bgImages, ...bgImagesMobile].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  useEffect(() => {
    setBgIndex((prev) => Math.min(prev, images.length - 1));
  }, [images.length]);

  // Sync a soft glow/lift pulse on the hero copy with every slide change.
  useEffect(() => {
    setBgPulse(true);
    const t = setTimeout(() => setBgPulse(false), CROSSFADE_MS);
    return () => clearTimeout(t);
  }, [bgIndex]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success("Subscribed to newsletter!");
      setNewsletterEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Hero entrance + slideshow-sync animation keyframes.
          Kept local to this page so no shared theme files are touched. */}
      <style>{`
        @keyframes heroFadeUp {
          0% { opacity: 0; transform: translateY(26px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadgeIn {
          0% { opacity: 0; transform: translateY(-10px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, -18px); }
        }
        @keyframes sparkleSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes caretBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .typewriter-caret {
          display: inline-block;
          width: 3px;
          margin-left: 4px;
          background: currentColor;
          animation: caretBlink 0.9s step-end infinite;
          vertical-align: -0.1em;
        }
        .hero-badge {
          animation: heroBadgeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        .hero-heading {
          animation: heroFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
          transition: text-shadow 0.6s ease, transform 0.6s ease;
        }
        .hero-desc {
          animation: heroFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
          transition: opacity 0.6s ease;
        }
        .hero-cta {
          animation: heroFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }
        .hero-pulse {
          transform: translateY(-2px);
        }
        .hero-pulse .hero-heading-gradient {
          text-shadow: 0 0 28px rgba(212, 175, 55, 0.45);
        }
        .hero-sparkle {
          animation: sparkleSpin 6s linear infinite;
        }
        .hero-glow-float {
          animation: floatGlow 10s ease-in-out infinite;
        }
        .hero-bg-active {
          /* Duration = SLIDE_DURATION_MS + CROSSFADE_MS (6000 + 1400 = 7400ms)
             so the zoom runs for the full time a slide is visible on screen,
             including its fade-in, instead of restarting mid-zoom every
             second like it did before. */
          animation: kenBurns 7.4s ease-out forwards;
          /* Match this to HERO_FOCAL_Y below so the zoom expands from the
             same point we're anchoring the crop to — otherwise the Ken
             Burns scale (which defaults to center-origin) drifts back
             toward the middle over time and re-crops the face. */
          transform-origin: center 15%;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-badge, .hero-heading, .hero-desc, .hero-cta,
          .hero-sparkle, .hero-glow-float, .hero-bg-active {
            animation: none !important;
          }
          .typewriter-caret {
            animation: none !important;
            opacity: 1;
          }
          .hero-pulse .hero-heading-gradient {
            text-shadow: none !important;
          }
        }
      `}</style>

      <Navbar />

      {/* Admin Banner - visible only to admin users */}
      {isAdmin && (
        <div className="relative z-40 pt-16 lg:pt-20">
          <div
            className="mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-2xl border border-gold-500/25 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.95) 100%)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                  <Shield size={20} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Admin Control Panel</p>
                  <p className="text-xs text-text-muted mt-0.5">You're logged in as admin — manage your store</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-neutral-950 text-xs font-semibold hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                >
                  <BarChart2 size={14} />
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-600 text-text-secondary text-xs font-medium hover:text-gold-400 hover:border-gold-500/30 transition-colors"
                >
                  <Package size={14} />
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-600 text-text-secondary text-xs font-medium hover:text-gold-400 hover:border-gold-500/30 transition-colors"
                >
                  <Shield size={14} />
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-600 text-text-secondary text-xs font-medium hover:text-gold-400 hover:border-gold-500/30 transition-colors"
                >
                  <Users size={14} />
                  Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Slideshow */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/70 to-transparent z-10" />
            {images.map((url, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-cover transition-opacity duration-700 ${idx === bgIndex ? "hero-bg-active" : ""
                  }`}
                style={{
                  backgroundImage: `url(${url})`,
                  // Anchored toward the top instead of dead-center so tall
                  // hero crops don't cut off the model's face. Tweak
                  // HERO_FOCAL_Y above (and the matching .hero-bg-active
                  // transform-origin) if any individual image still crops
                  // wrong.
                  backgroundPosition: `center ${HERO_FOCAL_Y}`,
                  opacity: idx === bgIndex ? 1 : 0,
                  transform: idx === bgIndex ? undefined : 'scale(1.06)',
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-surface-900/60 via-transparent to-surface-900/60" />
          </div>

          {/* Ambient Glow */}
          <div className="hero-glow-float absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
            <div className={`max-w-2xl transition-transform duration-500 ${bgPulse ? "hero-pulse" : ""}`}>
              <div className="hero-badge inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles size={14} className="hero-sparkle text-gold-400" />
                <span className="text-xs font-semibold text-gold-400 tracking-widest uppercase">
                  New Season Collection
                </span>
              </div>

              <h1 className="hero-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight">
                {(() => {
                  const current = heroHeadlines[headlineIndex];
                  const line1WithSpace = `${current.line1} `;
                  const visible = `${current.line1} ${current.line2}`.slice(0, typedLength);
                  const line1Visible = visible.slice(0, Math.min(typedLength, line1WithSpace.length));
                  const line2Visible = typedLength > line1WithSpace.length
                    ? visible.slice(line1WithSpace.length)
                    : "";
                  return (
                    <>
                      {line1Visible}
                      {line2Visible && (
                        <span className="hero-heading-gradient font-luxury italic text-gradient-gold">
                          {line2Visible}
                        </span>
                      )}
                      <span className="typewriter-caret text-gold-400" style={{ height: "0.85em" }}>&nbsp;</span>
                    </>
                  );
                })()}
              </h1>

              <p className="hero-desc mt-6 text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed">
                Discover thoughtfully crafted women’s fashion that blends timeless tradition with modern elegance — designed for confidence, beauty, and every special moment.
              </p>

              <div className="hero-cta flex flex-wrap gap-4 mt-8">
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-gold-200 via-gold-500 to-gold-600 text-neutral-950 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Shop Now
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 border border-gold-500/30 hover:border-gold-500/60 text-gold-400 hover:bg-gold-500/5 font-medium px-8 py-3.5 rounded-xl transition-all duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="relative z-10 -mt-12 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="bg-surface-800/80 backdrop-blur-sm border border-surface-600/50 rounded-xl p-4 flex items-center gap-3 hover:border-gold-500/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {feat.title}
                      </p>
                      <p className="text-xs text-text-muted">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                  Featured
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-luxury text-gradient-gold mt-2">
                  Editor's Pick
                </h2>
                <p className="text-text-muted text-sm mt-1.5">
                  Handpicked styles for the season
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                <LoadingSkeleton type="card" count={4} />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted text-sm">
                No featured products available
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-5 lg:py-24 bg-surface-800/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4 mb-12">
              <div className="flex-1 text-center">
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                  Collections
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-luxury text-gradient-gold mt-2">
                  Shop by Category
                </h2>
                <p className="text-text-muted text-sm mt-1.5 max-w-md mx-auto">
                  Explore our curated categories designed for every occasion
                </p>
              </div>

              {!loading && categories.length > 4 && (
                <Link
                  to="/categories"
                  className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-gold-400 transition-colors whitespace-nowrap mt-1"
                >
                  <span>Show More</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 ">
                <LoadingSkeleton type="card" count={4} />
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {categories.slice(0, 4).map((cat) => (
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
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Mobile-only show more, shown as last grid item */}
                {categories.length > 4 && (
                  <Link
                    to="/categories"
                    className="sm:hidden flex items-start relative bottom-[-10%] justify-center aspect-[3/4] rounded-xl border border-dashed border-surface-700/50 hover:border-accent/30 transition-all duration-300 text-md font-semibold text-accent hover:text-gold-400 gap-1.5"
                  >
                    <span>Show More</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted text-sm">
                No categories available
              </div>
            )}
          </div>
        </section>

        {/* Trending Now */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                  Trending
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-luxury text-gradient-gold mt-2">
                  Trending Now
                </h2>
                <p className="text-text-muted text-sm mt-1.5">
                  Most popular styles this week
                </p>
              </div>
              <Link
                to="/shop?sort=popular"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                <LoadingSkeleton type="card" count={4} />
              </div>
            ) : trending.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {trending.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted text-sm">
                No trending products available
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/shop?sort=popular"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
              >
                View All Trending
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}

      </main>

      <Footer />
    </div>
  );
}