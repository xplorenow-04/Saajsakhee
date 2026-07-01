import React, { useState, useContext, useEffect } from 'react'
import { userApi } from '../../api/user.api'
import { authContext } from '../../context/AuthProvider.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { userAuthStore } from '../../store/userStore.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const setUser1 = userAuthStore((s) => s.setUser)
    const authData = useContext(authContext)
    const navigate = useNavigate()

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const validate = () => {
        const { email, password } = form
        if (!email.trim() || !password.trim()) {
            toast.error('All fields are required')
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            toast.error('Enter a valid email address')
            return false
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return false
        }
        return true
    }

    const login = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const response = await userApi.loginUser({ email: form.email.trim(), password: form.password })
            if (response.success) {
                authData.login(response.data)
                setUser1(response.data)
                toast.success(`Welcome back, ${response.data.name}!`)
                navigate(response.data?.role === 'admin' ? '/admin' : '/')
            } else {
                toast.error(response.message || 'Invalid credentials')
            }
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-surface-900 flex overflow-hidden">
            {/* Decorative corner accents */}
            <div className="fixed top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-l-2 border-t-2 border-gold-500/10 rounded-tl-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 border-r-2 border-b-2 border-gold-500/10 rounded-br-3xl pointer-events-none" />

            {/* Left — Visual Panel */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-surface-900/30" />

                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />

                {/* Decorative gold circles — hidden on smaller lg screens */}
                <div className="absolute top-[15%] right-[20%] w-64 h-64 border border-gold-500/10 rounded-full xl:block" />
                <div className="absolute top-[18%] right-[23%] w-48 h-48 border border-gold-500/5 rounded-full xl:block" />

                {/* Brand Content */}
                <div className="absolute top-1/4 xl:top-1/3 left-10 xl:left-16 right-10 xl:right-20 z-10">
                    <div className="flex items-center gap-3 xl:gap-4 mb-6 xl:mb-8">
                        <div className="w-10 h-10 xl:w-14 xl:h-14 rounded-full border border-gold-500/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden bg-black flex items-center justify-center shrink-0">
                            <img src="/logo_emblem.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <span className="text-base xl:text-lg font-luxury italic text-gold-400 tracking-wide">Saajsakhee</span>
                            <p className="text-[10px] xl:text-[11px] text-text-dim/50 tracking-[0.2em] uppercase mt-0.5">Premium Ethnic Wear</p>
                        </div>
                    </div>

                    <h2 className="text-3xl xl:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight">
                        Celebrate<br />
                        <span className="font-luxury italic text-gradient-gold text-4xl xl:text-6xl">Your Grace</span>
                    </h2>

                    <div className="h-px w-12 xl:w-16 bg-gold-500/30 my-4 xl:my-6" />

                    <p className="text-text-muted text-xs xl:text-sm leading-relaxed max-w-xs xl:max-w-sm">
                        Discover thoughtfully crafted women's fashion that blends timeless tradition with modern elegance — designed for confidence, beauty, and every special moment.
                    </p>

                    {/* Stat badges — stacked on smaller lg, row on larger */}
                    <div className="flex flex-wrap items-center gap-x-4 xl:gap-x-6 gap-y-3 mt-6 xl:mt-10">
                        <div>
                            <p className="text-base xl:text-xl font-bold text-gold-400">10K+</p>
                            <p className="text-[10px] xl:text-[11px] text-text-dim/60 tracking-wider uppercase">Happy Customers</p>
                        </div>
                        <div className="w-px h-6 xl:h-8 bg-gold-500/20 hidden xs:block" />
                        <div className="w-full xs:w-auto">
                            <p className="text-base xl:text-xl font-bold text-gold-400">500+</p>
                            <p className="text-[10px] xl:text-[11px] text-text-dim/60 tracking-wider uppercase">Traditional Designs</p>
                        </div>
                        <div className="w-px h-6 xl:h-8 bg-gold-500/20 hidden xs:block" />
                        <div className="w-full xs:w-auto">
                            <p className="text-base xl:text-xl font-bold text-gold-400">4.9★</p>
                            <p className="text-[10px] xl:text-[11px] text-text-dim/60 tracking-wider uppercase">Customer Rating</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 xl:bottom-12 left-10 xl:left-16 z-10 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border-2 border-surface-900 bg-surface-700 flex items-center justify-center">
                                <span className="text-[9px] xl:text-[10px] font-bold text-gold-400">S</span>
                            </div>
                        ))}
                    </div>
                    <span className="text-[11px] xl:text-xs text-text-dim/60">Trusted by women nationwide</span>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 relative">
                {/* Ambient glows — smaller on mobile */}
                <div className="fixed top-[20%] right-[10%] sm:right-[20%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gold-500/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
                <div className="fixed bottom-[10%] right-[5%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-accent/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

                <div className="relative w-full max-w-sm animate-slide-up">
                    <div className="relative bg-surface-900/80 backdrop-blur-2xl border border-gold-500/15 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
                        />

                        {/* Desktop heading */}
                        <div className="pt-8 sm:pt-12 pb-2 px-6 sm:px-8 xl:px-10">
                            <p className="text-[10px] sm:text-[11px] text-gold-500/60 tracking-[0.25em] uppercase mb-2 sm:mb-3">Welcome Back</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Sign In</h1>
                            <p className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-1.5">Enter your credentials to continue</p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent mx-6 sm:mx-8 xl:mx-10 mt-4 sm:mt-6 mb-2" />

                        <form className="flex flex-col gap-4 sm:gap-5 px-6 sm:px-8 xl:px-10 pt-4 sm:pt-6 pb-8 sm:pb-12 relative z-10" onSubmit={login} noValidate>
                            <div>
                                <label htmlFor="login-email" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase mb-1.5 sm:mb-2 block">Email Address</label>
                                <div className="relative group">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="login-email"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="email"
                                        placeholder="you@example.com"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                    <label htmlFor="login-password" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase">Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="login-password"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <button
                                id="login-submit"
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-3 sm:py-3.5 mt-1 sm:mt-2 rounded-xl text-neutral-950 text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 bg-gradient-to-r from-gold-200 via-gold-500 to-gold-600 hover:shadow-[0_8px_28px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 overflow-hidden"
                                style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.2)' }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'Signing In…' : 'Sign In'}
                            </button>

                            <p className="text-center text-[11px] sm:text-xs text-text-muted mt-1">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors duration-150 font-medium">
                                    Create one
                                </Link>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
