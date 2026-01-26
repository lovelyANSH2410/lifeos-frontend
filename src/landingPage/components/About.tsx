import React from 'react';

const About = () => {
    return (
        <section id="vision" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-900/10 to-transparent rounded-full blur-3xl -z-10"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <span className="text-violet-400 font-bold tracking-wider text-sm uppercase mb-6 block">Our Manifesto</span>

                <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-10 leading-tight">
                    Technology should be <br />
                    <span className="italic text-slate-400">calm</span>, not demanding.
                </h2>

                <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                    <p>
                        We are drowning in notifications. Every app wants your attention, your data, and your time. They are designed to be addictive, not helpful.
                    </p>
                    <p>
                        LifeOS is the antithesis of the attention economy. It is a tool that waits for you. It respects your privacy. It doesn't sell your data. It doesn't bombard you with red dots.
                    </p>
                    <p>
                        We built this because we wanted a digital home that feels as peaceful as a clean desk on a Sunday morning. A place where you are in control.
                    </p>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 flex justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Fake trusted by logos */}
                    <div className="text-xl font-bold font-serif">Linear</div>
                    <div className="text-xl font-bold">Notion</div>
                    <div className="text-xl font-bold tracking-tighter">Apple</div>
                </div>
                <p className="text-xs text-slate-600 mt-4">Inspired by the craftsmanship of industry leaders.</p>
            </div>
        </section>
    );
};

export default About;
