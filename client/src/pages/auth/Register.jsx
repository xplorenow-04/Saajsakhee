import React, { useState, useEffect } from 'react'
import { userApi } from '../../api/user.api'
import { User, AtSign, Mail, Lock, Loader2, Sparkles, Phone } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const validate = () => {
        const { name, username, email, phone, password } = form
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
            toast.error('All fields are required')
            return false
        }
        if (name.trim().length < 2) {
            toast.error('Name must be at least 2 characters')
            return false
        }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
            toast.error('Username must be 3–20 characters and can only contain letters, numbers, and underscores')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            toast.error('Enter a valid email address')
            return false
        }
        if (phone.trim() !== '' && !/^[0-9]{10}$/.test(phone.trim())) {
            toast.error('Phone number must be a valid 10-digit number')
            return false
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return false
        }
        return true
    }

    const register = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            const response = await userApi.registerUser({
                name: form.name.trim(),
                username: form.username.trim().toLowerCase(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                password: form.password
            })
            if (response.success) {
                toast.success('Account created! Please sign in.')
                navigate('/login')
            } else {
                toast.error(response.message || 'Registration failed. Please try again.')
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
            <div className="fixed top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 border-r-2 border-t-2 border-gold-500/10 rounded-tr-3xl pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-l-2 border-b-2 border-gold-500/10 rounded-bl-3xl pointer-events-none" />

            {/* Left — Visual Panel */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-surface-900/30" />

                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />

                {/* Decorative gold circles */}
                <div className="absolute top-[20%] right-[15%] w-72 h-72 border border-gold-500/10 rounded-full xl:block" />
                <div className="absolute top-[23%] right-[18%] w-56 h-56 border border-gold-500/5 rounded-full xl:block" />

                {/* Brand Content */}
                <div className="absolute top-1/4 left-10 xl:left-16 right-10 xl:right-20 z-10">
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
                        Begin Your<br />
                        <span className="font-luxury italic text-gradient-gold text-4xl xl:text-6xl">Style Journey</span>
                    </h2>

                    <div className="h-px w-12 xl:w-16 bg-gold-500/30 my-4 xl:my-6" />

                    <p className="text-text-muted text-xs xl:text-sm leading-relaxed max-w-xs xl:max-w-sm">
                        Join thousands of women who trust Saajsakhee for authentic ethnic wear that celebrates tradition with a modern touch.
                    </p>

                    {/* Benefits list */}
                    <div className="mt-6 xl:mt-10 space-y-3 xl:space-y-4">
                        {[
                            { label: 'Free Shipping', desc: 'On orders above ₹999' },
                            { label: 'Easy Returns', desc: '30-day return policy' },
                            { label: 'Secure Checkout', desc: '100% safe & encrypted' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                                    <svg className="w-2 xl:w-2.5 h-2 xl:h-2.5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs xl:text-sm font-medium text-text-primary">{item.label}</p>
                                    <p className="text-[11px] xl:text-xs text-text-dim/60">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 xl:bottom-12 left-10 xl:left-16 z-10">
                    <div className="flex items-center gap-3 text-text-dim/50">
                        <Sparkles size={10} className="text-gold-500/60" />
                        <span className="text-[11px] xl:text-xs tracking-widest uppercase">Join 10,000+ Happy Customers</span>
                        <Sparkles size={10} className="text-gold-500/60" />
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 relative">
                {/* Ambient glows */}
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
                            <p className="text-[10px] sm:text-[11px] text-gold-500/60 tracking-[0.25em] uppercase mb-2 sm:mb-3">Get Started</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Create Account</h1>
                            <p className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-1.5">Fill in the details to join</p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent mx-6 sm:mx-8 xl:mx-10 mt-4 sm:mt-6 mb-2" />

                        <form className="flex flex-col gap-4 px-6 sm:px-8 xl:px-10 pt-4 sm:pt-6 pb-8 sm:pb-12 relative z-10" onSubmit={register} noValidate>
                            <div>
                                <label htmlFor="register-name" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase mb-1.5 sm:mb-2 block">Full Name</label>
                                <div className="relative group">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="register-name"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="text"
                                        placeholder="Enter your full name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-username" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase mb-1.5 sm:mb-2 block">Username</label>
                                <div className="relative group">
                                    <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="register-username"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="text"
                                        placeholder="Choose a username"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-email" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase mb-1.5 sm:mb-2 block">Email Address</label>
                                <div className="relative group">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="register-email"
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
                                <label htmlFor="register-phone" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase mb-1.5 sm:mb-2 block">Mobile Number <span className="text-text-dim/40 normal-case">(optional)</span></label>
                                <div className="relative group">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="register-phone"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                    <label htmlFor="register-password" className="text-[10px] sm:text-xs text-text-dim/70 tracking-wider uppercase">Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50 pointer-events-none transition-colors group-focus-within:text-gold-400" />
                                    <input
                                        id="register-password"
                                        className="w-full bg-surface-800/60 border border-gold-500/10 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-text-primary text-sm outline-none transition-all duration-200 placeholder:text-text-dim/30 focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] focus:bg-surface-800/80"
                                        type="password"
                                        placeholder="Create a password (min 8 chars)"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                id="register-submit"
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-3 sm:py-3.5 mt-1 sm:mt-2 rounded-xl text-neutral-950 text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 bg-gradient-to-r from-gold-200 via-gold-500 to-gold-600 hover:shadow-[0_8px_28px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 overflow-hidden"
                                style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.2)' }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'Creating Account…' : 'Create Account'}
                            </button>

                            <p className="text-center text-[11px] sm:text-xs text-text-muted mt-1">
                                Already have an account?{' '}
                                <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors duration-150 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register
