import React, { useState } from 'react';
import { LayoutDashboard, Wallet, Plus, Plane, MoreHorizontal, Film, Lightbulb, Book, Shield, Heart, Repeat } from 'lucide-react';
import { Tab } from '@/types';
import BottomSheet from '@/components/common/BottomSheet';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onCaptureClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onCaptureClick }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const navItems = [
    { id: Tab.Dashboard, icon: LayoutDashboard, label: 'Dashboard' },
    { id: Tab.Money, icon: Wallet, label: 'Money' },
    { id: Tab.Travel, icon: Plane, label: 'Plans' },
  ];
  
  // Tabs available in "More" menu
  const moreMenuItems = [
    { id: Tab.Entertainment, icon: Film, label: 'Movies & Series' },
    { id: Tab.Ideas, icon: Lightbulb, label: 'Idea Inbox' },
    { id: Tab.Journal, icon: Book, label: 'Personal Diary' },
    { id: Tab.Vault, icon: Shield, label: 'Vault & Docs' },
    { id: Tab.Dates, icon: Heart, label: 'Gifting & Dates' },
    { id: Tab.Subscriptions, icon: Repeat, label: 'Subscriptions' },
  ];

  // Check if current tab is in "More" menu
  const isMoreTabActive = moreMenuItems.some(item => item.id === activeTab);
  
  const handleMoreClick = () => {
    setIsMoreMenuOpen(true);
  };

  const handleMoreMenuItemClick = (tab: Tab) => {
    onTabChange(tab);
    setIsMoreMenuOpen(false);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F131F] border-t border-white/5 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      {/* Safe area padding for iOS */}
      <div>
        <div className="flex items-center justify-around px-2 py-2 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as Tab)}
                className={`
                  flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all relative
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </button>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={handleMoreClick}
            className={`
              flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all relative
              ${isMoreTabActive 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            {isMoreTabActive && (
              <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
            )}
            <MoreHorizontal className={`w-5 h-5 relative z-10 ${isMoreTabActive ? 'text-indigo-400' : ''}`} />
            <span className="text-[10px] font-medium relative z-10">More</span>
          </button>
          
          {/* Floating Capture Button */}
          <button
            onClick={onCaptureClick}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center transition-all z-20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* More Menu Bottom Sheet */}
      <BottomSheet
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        title="More"
      >
        <div className="p-4 space-y-2">
          {moreMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMoreMenuItemClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </nav>
  );
};

export default BottomNav;
