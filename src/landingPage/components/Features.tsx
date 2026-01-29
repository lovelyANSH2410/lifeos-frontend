import React from 'react';
import { Wallet, Film, Plane, Lightbulb, Shield, CalendarHeart } from 'lucide-react';
import { MockMoney, MockMovies, MockIdeas, MockTravel } from './ui/MockScreens';

const features = [
    {
        id: 'money',
        title: "Money, without anxiety.",
        description: "See your income, expenses, subscriptions, and savings in one calm snapshot. No spreadsheets. No finance jargon. Just clarity.",
        icon: Wallet,
        color: "text-emerald-400",
        component: <MockMoney />
    },
    {
        id: 'movies',
        title: "Your taste, remembered.",
        description: "Track what you watched, loved, dropped, or want to watch — and never ask “what should I watch?” again.",
        icon: Film,
        color: "text-rose-400",
        component: <MockMovies />
    },
    {
        id: 'travel',
        title: "Trips don’t end when you come home.",
        description: "Plan trips, store details, and attach photos and diary entries — so your memories don’t disappear into your camera roll.",
        icon: Plane,
        color: "text-sky-400",
        component: <MockTravel />
    },
    {
        id: 'ideas',
        title: "Your thoughts, saved.",
        description: "Capture ideas before they disappear. Messy, half-formed, random — all welcome.",
        icon: Lightbulb,
        color: "text-yellow-400",
        component: <MockIdeas />
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 md:py-32 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your life is spread everywhere.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Notes, apps, screenshots, spreadsheets, reminders —
                        pieces of your life live everywhere, and eventually you forget where you saved what.
                    </p>
                </div>

                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <div key={feature.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Text Side */}
                            <div className="flex-1">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 ${feature.color}`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                        <span>Zero clutter interface</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                        <span>Works offline & syncs later</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                        <span>Privacy-focused local encryption</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Image Side (Mock UI) */}
                            <div className="flex-1 w-full perspective-1000">
                                <div className={`relative transform transition-all duration-500 hover:scale-[1.02] ${index % 2 === 0 ? 'rotate-y-3 hover:rotate-y-0' : '-rotate-y-3 hover:rotate-y-0'}`}>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {feature.component}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
