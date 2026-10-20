import React from 'react';
import { Home, Tv, Film, Search, Settings, Radio, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

interface SideNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isTVMode: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ currentTab, onTabChange, isTVMode }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live TV', icon: Tv },
    { id: 'movies', label: 'Cinema', icon: Film },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between shrink-0 liquid-glass border-r border-white/10 p-3 sm:p-4 z-30 transition-all ${
        isTVMode ? 'w-56' : 'w-20 lg:w-56'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Lockup */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors group w-full text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center p-2 shadow-lg shadow-sky-500/20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white" aria-hidden="true">
              <path d="M 30 20 C 30 15 36 12 40 15 L 82 45 C 86 48 86 52 82 55 L 40 85 C 36 88 30 85 30 80 Z" />
            </svg>
          </div>
          <span className={`text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] ${
            isTVMode ? 'block' : 'hidden lg:block'
          }`}>
            elbill
          </span>
        </button>

        {/* Navigation Rail Buttons */}
        <nav className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`tv-nav-item w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-sm truncate ${isTVMode ? 'block' : 'hidden lg:block'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Live Streaming Indicator */}
      <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 ${isTVMode ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Global Network</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          HLS Engine Active
        </p>
      </div>
    </aside>
  );
};
