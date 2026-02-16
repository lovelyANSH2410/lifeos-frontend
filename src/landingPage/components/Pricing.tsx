import React, { useState } from 'react';
import { Check, Sparkles, Crown, ArrowRight } from 'lucide-react';

const Pricing = () => {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

    const plans = [
        {
            name: "Free",
            price: "₹0",
            period: "forever",
            description: "Get started",
            features: [
                "Dashboard overview",
                "Limited money tracking",
                "1 diary entry per day",
                "Limited ideas & notes",
                "Limited subscription tracking",
                "No credit card required"
            ],
            cta: "Start Free",
            highlight: false
        },
        {
            name: "Pro",
            price: billing === 'monthly' ? "₹199" : "₹1,499",
            period: billing === 'monthly' ? "/ month" : "/ year",
            subPrice: billing === 'yearly' ? "Just ₹4 / day" : undefined,
            description: "Most Popular",
            features: [
                "Unlimited diary & ideas",
                "Complete money management",
                "Budgets & expenses",
                "Movies & series manager",
                "Travel plans & memories",
                "Gifting & dates",
                "Secure vault & cloud storage",
                "Smart dashboard insights"
            ],
            cta: "Upgrade to Pro",
            highlight: true,
            helper: "Less than one coffee per week."
        },
        {
            name: "Couple",
            price: billing === 'monthly' ? "₹299" : "₹2,499",
            period: billing === 'monthly' ? "/ month" : "/ year",
            description: "For partners",
            features: [
                "Everything in Pro",
                "Shared dashboard",
                "Shared money tracking",
                "Shared plans & memories",
                "Shared secure vault",
                "Privacy controls"
            ],
            cta: "Start Couple Plan",
            highlight: false,
            helper: "Built for partners building a life together."
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">One place for your entire life.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                        One calm app for money, plans, ideas, memories, and daily life.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 relative">
                        <button
                            onClick={() => setBilling('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Yearly <span className="text-[10px] ml-1 opacity-80 font-normal">SAVE ~30%</span>
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                ? 'bg-gradient-to-b from-violet-900/20 to-[#0F121E] border-violet-500/50 shadow-2xl shadow-violet-900/10 scale-100 md:scale-105 z-10'
                                : 'bg-[#0F121E] border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white/20">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="text-slate-400 text-sm font-medium mb-2">{plan.description}</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-500 text-sm">{plan.period}</span>
                                </div>
                                {plan.subPrice && (
                                    <div className="text-emerald-400 text-xs font-medium mt-2 flex items-center gap-1">
                                        <Sparkles size={12} /> {plan.subPrice}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex items-start gap-3 text-sm text-slate-300">
                                        <Check size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-violet-400' : 'text-slate-500'}`} />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="/dashboard"
                                className={`w-full block text-center py-3 rounded-xl font-semibold transition-all ${plan.highlight
                                    ? 'bg-white text-slate-950 hover:bg-slate-200 shadow-lg shadow-white/5'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                    }`}
                            >
                                {plan.cta}
                            </a>
                            {plan.helper && (
                                <p className="text-center text-[10px] text-slate-500 mt-4">{plan.helper}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Lifetime Banner */}
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-r from-amber-900/10 to-transparent p-1 max-w-2xl mx-auto group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-50"></div>
                    <div className="relative bg-[#0F121E]/80 backdrop-blur-sm rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                                <Crown size={20} />
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-white font-bold text-lg">Lifetime Access (Limited)</div>
                                <div className="text-amber-200/60 text-sm">Early supporter offer. Pay once, own forever.</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-1">
                            <div className="text-2xl font-bold text-white">₹4,999</div>
                            <a href="/dashboard" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                                Become a supporter <ArrowRight size={12} />
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-12">
                    Prices inclusive of taxes. Cancel anytime. Secure payments via Stripe/Razorpay.
                </p>

            </div>
        </section>
    );
};

export default Pricing;
