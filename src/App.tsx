
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Heart, 
  Wallet, 
  Shield, 
  Plane, 
  Book, 
  Repeat,
  Search,
  Menu,
  Bell,
  Sparkles,
  Users,
  Crown,
  LogOut,
  Lightbulb
} from 'lucide-react';
import { Tab, Plan } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import SidebarItem from '@/components/common/SidebarItem';
import Login from '@/components/auth/Login';
import Dashboard from '@/components/features/Dashboard';
import WatchView from '@/components/features/WatchView';
import DateNightView from '@/components/features/DateNightView';
import MoneyView from '@/components/features/MoneyView';
import VaultView from '@/components/features/VaultView';
import TravelView from '@/components/features/TravelView';
import SubscriptionsView from '@/components/features/SubscriptionsView';
import JournalView from '@/components/features/JournalView';
import IdeaInboxView from '@/components/features/IdeaInboxView';
import ProfileModal from './components/features/ProfileModal';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [currentPlan, setCurrentPlan] = useState<Plan>('Couple');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F17]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F17] text-gray-100">
      {/* Premium Dark Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        border-r border-white/5
        bg-[#0F131F] z-40 hidden md:flex flex-col
      `}>
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="ml-3 font-bold text-lg tracking-tight text-white">LifeOS</span>}
        </div>

        <div className="px-4 pt-6 pb-2">
           {isSidebarOpen ? (
             <div className="bg-[#151B28] rounded-xl p-1 flex border border-white/5">
                <button onClick={() => setCurrentPlan('Free')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${currentPlan === 'Free' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Free</button>
                <button onClick={() => setCurrentPlan('Couple')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${currentPlan === 'Couple' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>Couple</button>
                <button onClick={() => setCurrentPlan('Pro')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${currentPlan === 'Pro' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Pro</button>
             </div>
           ) : (
             <div className="flex justify-center">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
             </div>
           )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === Tab.Dashboard} onClick={() => setActiveTab(Tab.Dashboard)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Film} label="Movies & Series" active={activeTab === Tab.Entertainment} onClick={() => setActiveTab(Tab.Entertainment)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Heart} label="Gifting & Dates" active={activeTab === Tab.Dates} onClick={() => setActiveTab(Tab.Dates)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Wallet} label="Money Manager" active={activeTab === Tab.Money} onClick={() => setActiveTab(Tab.Money)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Shield} label="Vault & Docs" active={activeTab === Tab.Vault} onClick={() => setActiveTab(Tab.Vault)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Plane} label="Travel Plans" active={activeTab === Tab.Travel} onClick={() => setActiveTab(Tab.Travel)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Repeat} label="Subscriptions" active={activeTab === Tab.Subscriptions} onClick={() => setActiveTab(Tab.Subscriptions)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Book} label="Personal Diary" active={activeTab === Tab.Journal} onClick={() => setActiveTab(Tab.Journal)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={Lightbulb} label="Idea Inbox" active={activeTab === Tab.Ideas} onClick={() => setActiveTab(Tab.Ideas)} collapsed={!isSidebarOpen} />
        </nav>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className={`flex items-center w-full p-2 rounded-xl hover:bg-white/5 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-[#0F131F]">
                 <span className="text-white text-xs font-bold">
                   {user?.name?.charAt(0).toUpperCase() || 'U'}
                 </span>
               </div>
            </div>
            {isSidebarOpen && (
              <div className="ml-3 text-left overflow-hidden flex-1">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1.5">
                   <Users className="w-3 h-3 text-rose-400" />
                   <p className="text-xs text-rose-400 truncate">{currentPlan} Plan</p>
                </div>
              </div>
            )}
          </button>
          {isSidebarOpen && (
            <button
              onClick={logout}
              className="flex items-center w-full p-2 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Glass Header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/5 z-40 shrink-0 glass-panel sticky top-0">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-400 hover:text-white"><Menu className="w-5 h-5" /></button>
             <div className="relative max-w-sm w-full hidden sm:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search movies, docs, memories..." 
                  className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none placeholder:text-gray-600" 
                />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {currentPlan === 'Free' && (
                <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:shadow-lg transition-all">
                   <Crown className="w-3 h-3" /> Upgrade
                </button>
             )}
             <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
            <div className="animate-enter">
              {activeTab === Tab.Dashboard && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === Tab.Entertainment && <WatchView />}
              {activeTab === Tab.Dates && <DateNightView />}
              {activeTab === Tab.Money && <MoneyView />}
              {activeTab === Tab.Vault && <VaultView />}
              {activeTab === Tab.Travel && <TravelView />}
              {activeTab === Tab.Subscriptions && <SubscriptionsView />}
              {activeTab === Tab.Journal && <JournalView />}
              {activeTab === Tab.Ideas && <IdeaInboxView />}
            </div>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default App;
