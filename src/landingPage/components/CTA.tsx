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

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Find your focus.
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                    Join the waitlist for the first calm operating system for life. We are opening 100 spots every week.
                </p>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            Join Waitlist <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center text-emerald-400 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">You're on the list!</h3>
                        <p className="text-slate-400">Keep an eye on your inbox.</p>
                    </div>
                )}

                <div className="mt-8 text-sm text-slate-500">
                    No spam. Unsubscribe anytime.
                </div>
            </div>
        </section>
    );
};

export default CTA;
