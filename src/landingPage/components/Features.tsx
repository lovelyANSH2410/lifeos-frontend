import React from 'react';
import { Wallet, Film, Plane, Lightbulb, Shield, CalendarHeart } from 'lucide-react';
import { MockMoney, MockMovies, MockIdeas, MockTravel } from './ui/MockScreens';

const features = [
    {
        id: 'money',
        title: "Financial clarity, finally.",
        description: "Track income, expenses, subscriptions, and savings in one place. No complex spreadsheets, just a clear snapshot of your financial health.",
        icon: Wallet,
        color: "text-emerald-400",
        component: <MockMoney />
    },
    {
        id: 'movies',
        title: "Your entertainment library.",
        description: "Track what you're watching across Netflix, HBO, and more. Rate favorites, manage your watchlist, and never ask 'what should we watch?' again.",
        icon: Film,
        color: "text-rose-400",
        component: <MockMovies />
    },
    {
        id: 'travel',
        title: "Plan trips, keep memories.",
        description: "Organize flights, stays, and budgets for your adventures. Attach photos and journal entries to keep the memories alive forever.",
        icon: Plane,
        color: "text-sky-400",
        component: <MockTravel />
    },
    {
        id: 'ideas',
        title: "Never lose a thought.",
        description: "Capture ideas instantly. Whether it's a gift idea, a business concept, or a book recommendation, throw it in the Inbox and sort it later.",
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
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">An operating system <br />for your daily life.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Most apps do one thing. LifeOS connects everything, creating a context-aware dashboard that helps you live better.
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
