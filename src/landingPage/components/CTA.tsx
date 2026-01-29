import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const CTA = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            // Simulate API call
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <section id="early-access" className="py-24 px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-violet-900/20 to-slate-900/40 border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden backdrop-blur-sm">

                {/* Glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-violet-500/10 blur-[100px] -z-10"></div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold text-white mb-5 leading-tight tracking-tight max-w-2xl mx-auto">
                    You don’t need to organize your life.
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                    You just need a place to keep it.
                </p>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        >
                            Join Early Access <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5 text-emerald-400">
                            <Check size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">You're on the list!</h3>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Keep an eye on your inbox.</p>
                    </div>
                )}

                <p className="mt-10 text-sm text-slate-500 leading-relaxed">
                    No spam. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
};

export default CTA;
