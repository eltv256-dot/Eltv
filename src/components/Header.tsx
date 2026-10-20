import React from 'react';
import { Tv, Smartphone, Moon, Sun, Download, Database } from 'lucide-react';
import { NavTab } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isTVMode: boolean;
  onToggleTVMode: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAndroidModal: () => void;
  onOpenSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isTVMode,
  onToggleTVMode,
  theme,
  onToggleTheme,
  onOpenAndroidModal,
  onOpenSyncModal,
}) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 liquid-glass border-b border-white/10 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with small play mark */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center p-1.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white" aria-hidden="true">
              <path d="M 30 20 C 30 15 36 12 40 15 L 82 45 C 86 48 86 52 82 55 L 40 85 C 36 88 30 85 30 80 Z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            elbill
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('live')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'live'
                ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Live TV
          </button>
          <button
            onClick={() => onTabChange('movies')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'movies'
                ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Movies & Series
          </button>
          <button
            onClick={() => onTabChange('search')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'search'
                ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'profile'
                ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Quick Action Buttons & TV Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Centralized Cloud Sync Trigger */}
          <button
            onClick={onOpenSyncModal}
            title="Multi-Screen Database Sync"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Android App Download Button */}
          <button
            onClick={onOpenAndroidModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-sky-400 border border-sky-500/25 flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android App</span>
          </button>

          {/* 10-Foot TV Mode Toggle */}
          <button
            onClick={onToggleTVMode}
            title={isTVMode ? 'Exit TV Mode' : 'Switch to 10-Foot TV Mode'}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isTVMode
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden xl:inline">{isTVMode ? 'TV Mode Active' : 'TV Mode'}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
