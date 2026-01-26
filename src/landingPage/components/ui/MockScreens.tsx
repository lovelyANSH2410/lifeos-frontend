import React from 'react';
import {
    CreditCard,
    Calendar,
    Play,
    Plus,
    Wallet,
    Plane,
    Lightbulb,
    Lock,
    Film,
    TrendingUp,
    MapPin,
    MoreHorizontal,
    Sparkles
} from 'lucide-react';

// Common container for the "OS" look
export const ScreenContainer = ({ children, title, activeTab }: { children?: React.ReactNode, title: string, activeTab?: string }) => (
    <div className="w-full bg-[#0B0F19] rounded-xl overflow-hidden shadow-2xl border border-white/10 font-sans text-sm relative">
        {/* Sidebar & Topbar Simulation */}
        <div className="flex h-full min-h-[400px]">
            {/* Fake Sidebar */}
            <div className="w-16 md:w-48 border-r border-white/5 p-4 hidden sm:flex flex-col gap-6">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:inline">LifeOS</span>
                </div>
                <div className="flex flex-col gap-2 opacity-60 text-xs md:text-sm">
                    <div className="p-2 rounded bg-white/10 text-white font-medium">Dashboard</div>
                    <div className="p-2">Movies</div>
                    <div className="p-2">Money</div>
                    <div className="p-2">Travel</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-8 bg-[#0F121E]">
                {/* Fake Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
                        {activeTab && (
                            <div className="flex gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{activeTab}</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs border border-white/10">Archive</span>
                            </div>
                        )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"></div>
                </div>
                {children}
            </div>
        </div>
    </div>
);

// 1. Dashboard Mock
export const MockDashboard = () => (
    <ScreenContainer title="Good Evening, Alex 👋">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rent Card */}
            <div className="bg-[#161B28] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-3xl -z-10"></div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Calendar size={12} />Payment
                </div>
                <div className="text-slate-300 text-sm mb-1">Apartment Rent</div>
                <div className="text-2xl text-white font-bold mb-1">$2,400.00</div>
                <div className="text-slate-500 text-xs">Due in 5 days</div>
            </div>

            {/* Subscription Card */}
            <div className="bg-[#161B28] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <TrendingUp size={12} />Subscription
                </div>
                <div className="text-slate-300 text-sm mb-1">Design Tool Pro</div>
                <div className="text-2xl text-white font-bold mb-1">$32.00</div>
                <div className="text-slate-500 text-xs">Renews tomorrow</div>
            </div>

            {/* Financial Snapshot */}
            <div className="md:col-span-1 bg-[#161B28] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Wallet size={12} />Net Position
                </div>
                <div className="text-3xl text-white font-bold mb-2">$42,850.20</div>
                <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-emerald-500 w-[70%] h-full rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Spent: $3,200</span>
                    <span>Safe: $1,200</span>
                </div>
            </div>

            {/* Continue Watching */}
            <div className="md:col-span-1 bg-[#161B28] p-5 rounded-2xl border border-white/5 flex gap-4 items-center">
                <div className="w-16 h-24 bg-slate-800 rounded-lg shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <Play size={10} fill="currentColor" />Resume
                    </div>
                    <div className="text-white font-medium">Sci-Fi Series S1:E4</div>
                    <div className="text-slate-500 text-xs mt-1">Netflix • 24m remaining</div>
                </div>
            </div>
        </div>
    </ScreenContainer>
);

// 2. Money Management Mock
export const MockMoney = () => (
    <ScreenContainer title="Money Management" activeTab="Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#161B28] p-4 rounded-xl border border-emerald-500/20">
                <div className="text-emerald-500 text-xs font-bold mb-1">TOTAL INCOME</div>
                <div className="text-xl text-white font-mono">$8,450.00</div>
            </div>
            <div className="bg-[#161B28] p-4 rounded-xl border border-rose-500/20">
                <div className="text-rose-500 text-xs font-bold mb-1">EXPENSES</div>
                <div className="text-xl text-white font-mono">$3,240.00</div>
            </div>
            <div className="bg-[#161B28] p-4 rounded-xl border border-blue-500/20">
                <div className="text-blue-500 text-xs font-bold mb-1">SAVINGS GOAL</div>
                <div className="text-xl text-white font-mono">$2,000.00</div>
            </div>
        </div>

        {/* Transaction List */}
        <div className="bg-[#161B28] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs text-slate-500 font-medium">RECENT ACTIVITY</div>
            {[
                { name: "Grocery Store", cat: "Food", cost: "-$124.50", icon: Wallet, color: "text-rose-400" },
                { name: "Freelance Project", cat: "Income", cost: "+$1,200.00", icon: TrendingUp, color: "text-emerald-400" },
                { name: "Coffee Shop", cat: "Social", cost: "-$6.50", icon: Wallet, color: "text-rose-400" },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                            <item.icon size={14} />
                        </div>
                        <div>
                            <div className="text-sm text-white font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.cat}</div>
                        </div>
                    </div>
                    <div className={`text-sm font-mono font-medium ${item.color}`}>{item.cost}</div>
                </div>
            ))}
        </div>
    </ScreenContainer>
);

// 3. Movies Mock
export const MockMovies = () => (
    <ScreenContainer title="Watchlist" activeTab="To Watch">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                    {/* Placeholder Art */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-blue-900 to-slate-900' : i === 2 ? 'from-purple-900 to-slate-900' : 'from-slate-800 to-slate-900'}`}></div>

                    {/* Status Tag */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] text-white font-medium border border-white/10">
                        {i === 1 ? 'Streaming' : 'Plan'}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                        <div className="text-white text-sm font-bold truncate">Movie Title {i}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>Sci-Fi</span> • <span>2024</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ScreenContainer>
)

// 4. Ideas Mock
export const MockIdeas = () => (
    <ScreenContainer title="Idea Inbox" activeTab="New">
        <div className="bg-[#161B28] p-4 rounded-xl border border-white/10 mb-4 flex gap-3 items-center text-slate-400 cursor-text">
            <Plus size={16} />
            <span>Type a new thought...</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-r from-violet-500/10 to-transparent hover:border-violet-500/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Project</span>
                    <span className="text-[10px] text-slate-500">10m ago</span>
                </div>
                <div className="text-white text-sm font-medium mb-1">App interface redesign concept</div>
                <div className="text-slate-400 text-xs line-clamp-2">Focus on glassmorphism and reduced complexity. Needs to feel airier.</div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-[#161B28] hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Life</span>
                </div>
                <div className="text-white text-sm font-medium mb-1">Gift for anniversary</div>
                <div className="text-slate-400 text-xs">Look for that vintage camera store downtown.</div>
            </div>
        </div>
    </ScreenContainer>
)

export const MockTravel = () => (
    <ScreenContainer title="Kyoto Trip" activeTab="Itinerary">
        <div className="relative h-32 rounded-xl overflow-hidden mb-6 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-indigo-900 opacity-80"></div>
            <div className="absolute bottom-4 left-4">
                <div className="text-xs text-rose-200 font-bold uppercase tracking-wider mb-1">Oct 12 - Oct 20</div>
                <div className="text-2xl text-white font-bold">Autumn in Japan</div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div className="w-0.5 h-full bg-white/5 min-h-[40px]"></div>
                </div>
                <div className="flex-1 bg-[#161B28] p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between">
                        <div className="text-white text-sm font-medium">Flight to Tokyo</div>
                        <div className="text-slate-500 text-xs">10:00 AM</div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                        <Plane size={10} />JL 402
                    </div>
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <div className="flex-1 bg-[#161B28] p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between">
                        <div className="text-white text-sm font-medium">Hotel Check-in</div>
                        <div className="text-slate-500 text-xs">03:00 PM</div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                        <MapPin size={10} />Shinjuku Granbell
                    </div>
                </div>
            </div>
        </div>
    </ScreenContainer>
)
