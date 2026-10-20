import React from 'react';
import { Home, Tv, Film, Search, Settings } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live TV', icon: Tv },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 liquid-glass-elevated rounded-3xl p-1.5 border border-white/15 shadow-2xl backdrop-blur-2xl">
      <div className="grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[46px] flex flex-col items-center justify-center rounded-2xl transition-all ${
                isActive
                  ? 'text-sky-400 bg-sky-500/15 font-bold shadow-inner'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
