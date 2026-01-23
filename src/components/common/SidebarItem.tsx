
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full transition-all duration-300 group rounded-xl relative overflow-hidden
        ${active 
          ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'}
        ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}
      `}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
      )}
      <Icon className={`w-5 h-5 transition-colors ${active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
      {!collapsed && <span className="ml-3 text-sm font-medium tracking-wide">{label}</span>}
    </button>
  );
};

export default SidebarItem;
