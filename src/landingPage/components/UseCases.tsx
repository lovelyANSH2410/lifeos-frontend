import React from 'react';
import { Briefcase, Heart, Palette, BrainCircuit } from 'lucide-react';

const personas = [
    {
        icon: Briefcase,
        title: "For Professionals",
        desc: "Keep your high-performance career separate from your personal finances and downtime. Track salary milestones and burnout indicators."
    },
    {
        icon: Heart,
        title: "For Couples",
        desc: "A shared space for the shared life. Plan dates, split expenses transparently, and keep a joint wish list for your future home."
    },
    {
        icon: Palette,
        title: "For Creators",
        desc: "Your idea inbox is your greatest asset. Capture inspiration immediately and organize project expenses without the headache."
    },
    {
        icon: BrainCircuit,
        title: "For Overthinkers",
        desc: "Offload your brain. When you write it down in LifeOS, you can stop looping on it. Trust the system to remind you when it matters."
    }
];

const UseCases = () => {
    return (
        <section className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Built for your specific chaos.</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {personas.map((p, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <p.icon className="text-violet-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {p.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
