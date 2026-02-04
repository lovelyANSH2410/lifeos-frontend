import React from 'react';
import { createPortal } from 'react-dom';
import { X, LayoutDashboard, Film, Heart, Wallet, Shield, Plane, Repeat, Book, Lightbulb, Crown, LogOut, Users, Sparkles, GraduationCap } from 'lucide-react';
import { Tab } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import SidebarItem from '@/components/common/SidebarItem';
import type { UserSubscription } from '@/types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onProfileClick: () => void;
  onLogout: () => void;
  userSubscription: UserSubscription | null;
  getPlanDisplayName: (plan: string) => string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onProfileClick,
  onLogout,
  userSubscription,
  getPlanDisplayName
}) => {
  const { user } = useAuth();

  const handleTabClick = (tab: Tab) => {
    onTabChange(tab);
    onClose();
  };

  if (!isOpen) return null;

  const sidebarContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] sm:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-80 bg-[#0F131F] border-r border-white/5 z-[9999] sm:hidden flex flex-col shadow-2xl animate-slide-in-left" style={{ animation: 'slide-in-left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">LifeOS</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === Tab.Dashboard} onClick={() => handleTabClick(Tab.Dashboard)} collapsed={false} />
          <SidebarItem icon={Film} label="Movies & Series" active={activeTab === Tab.Entertainment} onClick={() => handleTabClick(Tab.Entertainment)} collapsed={false} />
          <SidebarItem icon={Heart} label="Gifting & Dates" active={activeTab === Tab.Dates} onClick={() => handleTabClick(Tab.Dates)} collapsed={false} />
          <SidebarItem icon={Wallet} label="Money Manager" active={activeTab === Tab.Money} onClick={() => handleTabClick(Tab.Money)} collapsed={false} />
          <SidebarItem icon={Shield} label="Vault & Docs" active={activeTab === Tab.Vault} onClick={() => handleTabClick(Tab.Vault)} collapsed={false} />
          <SidebarItem icon={Plane} label="Travel Plans" active={activeTab === Tab.Travel} onClick={() => handleTabClick(Tab.Travel)} collapsed={false} />
          <SidebarItem icon={GraduationCap} label="Exams & Study" active={activeTab === Tab.Exams} onClick={() => handleTabClick(Tab.Exams)} collapsed={false} />
          <SidebarItem icon={Repeat} label="Subscriptions" active={activeTab === Tab.Subscriptions} onClick={() => handleTabClick(Tab.Subscriptions)} collapsed={false} />
          <SidebarItem icon={Book} label="Personal Diary" active={activeTab === Tab.Journal} onClick={() => handleTabClick(Tab.Journal)} collapsed={false} />
          <SidebarItem icon={Lightbulb} label="Idea Inbox" active={activeTab === Tab.Ideas} onClick={() => handleTabClick(Tab.Ideas)} collapsed={false} />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Current Plan Badge */}
          {user && (
            <button
              onClick={() => {
                handleTabClick(Tab.SubscriptionPlans);
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-600/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-indigo-400" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-400">Current Plan</p>
                  <p className="text-sm font-bold text-white">
                    {userSubscription ? getPlanDisplayName(userSubscription.plan) : 'Free'}
                  </p>
                </div>
                {userSubscription && userSubscription.plan !== 'LIFETIME' && (
                  <span className="text-xs text-indigo-400 font-medium">Upgrade</span>
                )}
              </div>
            </button>
          )}

          {/* Profile Button */}
          <button
            onClick={() => {
              onProfileClick();
              onClose();
            }}
            className="flex items-center w-full p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            {user?.profileImage ? (
              <img
                src={typeof user.profileImage === 'string' ? user.profileImage : user.profileImage.url}
                alt={user?.name || 'Profile'}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-[#0F131F]">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            )}
            <div className="ml-3 text-left overflow-hidden flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-rose-400" />
                <p className="text-xs text-rose-400 truncate">
                  {userSubscription ? getPlanDisplayName(userSubscription.plan) : 'Free'} Plan
                </p>
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center w-full p-3 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );

  return createPortal(sidebarContent, document.body);
};

export default MobileSidebar;
