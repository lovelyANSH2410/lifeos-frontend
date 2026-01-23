
import React from 'react';
import { 
  ArrowRight, 
  Heart,
  Plane,
  Film,
  TrendingUp,
  Wallet,
  CalendarHeart
} from 'lucide-react';
import { Tab } from '@/types';
import ReflectionPrompt from './ReflectionPrompt';

const Widget: React.FC<{
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
}> = ({ title, icon: Icon, children, className, onClick, accentColor = 'text-indigo-400' }) => (
  <div 
    onClick={onClick}
    className={`modern-card p-6 flex flex-col justify-between cursor-pointer group hover:bg-[#1A2235] ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${accentColor} opacity-80`} />}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </div>
    {children}
  </div>
);

const Dashboard: React.FC<{ setActiveTab: (tab: Tab) => void }> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Home</h1>
          <p className="text-gray-400">Your shared life, organized.</p>
        </div>
        <div className="flex gap-2">
           <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
             <Heart className="w-3 h-3 fill-rose-500" /> Anniversary in 12 days
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Next Date Night Widget */}
        <Widget 
          title="Next Date Night" 
          icon={CalendarHeart} 
          className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#151B28] to-[#1c1825]"
          onClick={() => setActiveTab(Tab.Dates)}
          accentColor="text-rose-400"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Heart className="w-32 h-32" />
          </div>
          <div className="flex gap-6 items-center">
             <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" className="w-24 h-24 rounded-xl object-cover shadow-lg border border-white/10" alt="Date" />
             <div>
               <h3 className="text-2xl font-bold text-white mb-1 leading-tight">Jazz & Cocktails</h3>
               <p className="text-gray-400 text-sm mb-3">Blue Velvet Lounge • Friday 8pm</p>
               <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">Confirmed</span>
             </div>
          </div>
        </Widget>

        {/* Watchlist Widget */}
        <Widget title="Watchlist" icon={Film} onClick={() => setActiveTab(Tab.Entertainment)} accentColor="text-purple-400">
           <div className="flex gap-3 overflow-hidden">
             <img src="https://image.tmdb.org/t/p/w200/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" className="w-16 h-24 rounded-lg object-cover border border-white/10 hover:scale-105 transition-transform" />
             <div className="flex flex-col justify-center">
                <p className="text-sm font-bold text-white mb-1">Inception</p>
                <p className="text-xs text-gray-500 mb-2">Sci-Fi • 8.8</p>
                <button className="bg-white/10 hover:bg-white/20 text-xs text-white px-2 py-1 rounded">Play Now</button>
             </div>
           </div>
        </Widget>

        {/* Joint Budget */}
        <Widget title="Wishlist Budget" icon={Wallet} onClick={() => setActiveTab(Tab.Money)} accentColor="text-emerald-400">
           <div className="mt-2">
             <div className="flex justify-between items-end mb-2">
                <p className="text-2xl font-bold text-white">$450</p>
                <p className="text-xs text-gray-500">left for gifts</p>
             </div>
             <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[65%]"></div>
             </div>
             <p className="text-[10px] text-gray-500 mt-2 text-right">Saving for: Espresso Machine</p>
           </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trip */}
        <Widget title="Dream Trip" icon={Plane} onClick={() => setActiveTab(Tab.Travel)} accentColor="text-sky-400">
          <div className="space-y-4">
            <div className="h-32 rounded-xl bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center relative group-hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                <p className="text-xl font-bold text-white tracking-widest uppercase drop-shadow-lg">Paris</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sept 2025</span>
              <span className="text-emerald-400 font-medium">$2,400 saved</span>
            </div>
          </div>
        </Widget>

        {/* Quick Notes / Diary */}
        <div className="lg:col-span-2">
          <ReflectionPrompt />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
