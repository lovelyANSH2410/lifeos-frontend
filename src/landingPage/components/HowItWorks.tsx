import React from 'react';
import { PenLine, Layers, Sparkles } from 'lucide-react';

const steps = [
    {
        icon: PenLine,
        title: "1. Capture Everything",
        desc: "Expenses, random thoughts, trip ideas, or dates. Just type it in. Quick capture is designed to be faster than opening Notes."
    },
    {
        icon: Layers,
        title: "2. Auto-Organize",
        desc: "LifeOS intelligently sorts your input. It detects dates, categories, and contexts, filing everything into the right module automatically."
    },
    {
        icon: Sparkles,
        title: "3. Act with Clarity",
        desc: "Wake up to a dashboard that shows exactly what matters today. No noise. No forgotten bills. Just a clear path forward."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-slate-950/50 border-y border-white/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complexity, simplified.</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        We built LifeOS because we were tired of managing 10 different apps just to get through the week.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-[#0F121E] border border-white/10 flex items-center justify-center mb-6 z-10 shadow-xl group-hover:border-violet-500/40 transition-colors">
                                <step.icon size={32} className="text-violet-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed px-4">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
