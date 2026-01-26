import React from 'react';
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { MockDashboard } from './ui/MockScreens';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] -z-10 opacity-30"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    {/* Pill Label */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-300 mb-8 hover:bg-white/10 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        Accepting Early Access Requests
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Your life. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                            Organized.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
                        LifeOS brings your money, plans, ideas, memories, and routines into one intelligent dashboard. Stop switching between apps and start living with clarity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <a
                            href="/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-slate-100 transition-all hover:scale-105"
                        >
                            Request Access
                        </a>
                        <a
                            href="#features"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-white/10 transition-all group"
                        >
                            Explore the System
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} />Privacy-first</span>
                        <span className="flex items-center gap-1.5"><span className="text-yellow-500">★</span>Designed for real life</span>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="relative mx-auto max-w-5xl mt-12 md:mt-20 perspective-1000">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 rounded-2xl opacity-20 blur-lg"></div>

                    <div className="relative transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out border border-white/10 rounded-xl shadow-2xl bg-black/50 backdrop-blur-sm">
                        <MockDashboard />

                        {/* Floating Callouts */}
                        <div className="absolute -right-4 md:-right-12 top-20 bg-slate-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md hidden md:block animate-bounce-slow">
                            <div className="text-xs font-bold text-emerald-400 mb-1">Total Clarity</div>
                            <div className="text-[10px] text-slate-300">Net worth updated in real-time</div>
                        </div>

                        <div className="absolute -left-4 md:-left-12 bottom-20 bg-slate-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md hidden md:block animate-bounce-slow delay-700">
                            <div className="text-xs font-bold text-rose-400 mb-1">Never Forget</div>
                            <div className="text-[10px] text-slate-300">Upcoming bills tracked auto-magically</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
