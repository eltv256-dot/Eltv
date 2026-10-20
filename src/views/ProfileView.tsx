import React, { useState } from 'react';
import {
  Heart,
  History,
  Tv,
  Smartphone,
  Database,
  Moon,
  Sun,
  Key,
  Globe,
  Trash2,
  Download,
  Upload,
  Plus,
  Play,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Film,
} from 'lucide-react';
import { Channel, Movie, WatchHistoryItem, AppPreferences } from '../types';
import { clearWatchHistory, savePreferences } from '../services/storage';
import { ChannelCard } from '../components/ChannelCard';
import { MovieCard } from '../components/MovieCard';

interface ProfileViewProps {
  channels: Channel[];
  movies: Movie[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
  preferences: AppPreferences;
  onSelectChannel: (channel: Channel) => void;
  onSelectMovie: (movie: Movie) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAndroidModal: () => void;
  onOpenSyncModal: () => void;
  onOpenCustomChannelModal: () => void;
  onUpdatePreferences: (prefs: Partial<AppPreferences>) => void;
  onReloadHistory: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  channels,
  movies,
  favorites,
  watchHistory,
  preferences,
  onSelectChannel,
  onSelectMovie,
  onToggleFavorite,
  onOpenAndroidModal,
  onOpenSyncModal,
  onOpenCustomChannelModal,
  onUpdatePreferences,
  onReloadHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'settings'>('favorites');
  const [tmdbInput, setTmdbInput] = useState(preferences.tmdbApiKey || '');
  const [tmdbSaved, setTmdbSaved] = useState(false);

  const favoriteChannels = channels.filter((c) => favorites.includes(c.id));
  const favoriteMovies = movies.filter((m) => favorites.includes(String(m.id)));

  const handleSaveTmdb = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({ tmdbApiKey: tmdbInput.trim() });
    setTmdbSaved(true);
    setTimeout(() => setTmdbSaved(false), 3000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all watch history from this device?')) {
      clearWatchHistory();
      onReloadHistory();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Lockup */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center p-3 shadow-lg shadow-sky-500/25 shrink-0">
            <img src="/icon.svg" alt="elbill user" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                elbill Streaming Station
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> FREE LIFETIME PLAN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              100% Free Access · No billing or credit card required · Device ID: <span className="text-sky-300 font-mono">{preferences.syncId || 'EL-LOCAL'}</span>
            </p>
          </div>
        </div>

        {/* Quick Sync & Android App Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSyncModal}
            className="py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-semibold text-xs flex items-center gap-2 border border-sky-400/30 transition-colors shadow-sm"
          >
            <Database className="w-4 h-4" />
            <span>Centralized Sync</span>
          </button>

          <button
            onClick={onOpenAndroidModal}
            className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download Android App</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'favorites'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white bg-white/5'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Watch History ({watchHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'settings'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white bg-white/5'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Preferences & TMDB</span>
        </button>
      </div>

      {/* Tab 1: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-8">
          {favoriteChannels.length === 0 && favoriteMovies.length === 0 ? (
            <div className="liquid-glass rounded-3xl p-12 text-center space-y-3 border border-white/10 max-w-md mx-auto">
              <Heart className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Favorites Added Yet</h3>
              <p className="text-xs text-slate-400">
                Click the heart icon on any live TV channel or movie to pin it here for quick access.
              </p>
            </div>
          ) : (
            <>
              {favoriteChannels.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500" />
                    Favorited TV Channels ({favoriteChannels.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {favoriteChannels.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        isFav={true}
                        onToggleFav={onToggleFavorite}
                        onSelect={onSelectChannel}
                      />
                    ))}
                  </div>
                </div>
              )}

              {favoriteMovies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-sky-400" />
                    Favorited Movies & Series ({favoriteMovies.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {favoriteMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFav={true}
                        onToggleFav={onToggleFavorite}
                        onSelect={onSelectMovie}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 2: Watch History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing recent streams and progress
            </span>
            {watchHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          {watchHistory.length === 0 ? (
            <div className="liquid-glass rounded-3xl p-12 text-center space-y-3 border border-white/10 max-w-md mx-auto">
              <History className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Watch History</h3>
              <p className="text-xs text-slate-400">
                Shows and live channels you watch will appear here so you can pick up where you left off.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {watchHistory.map((item) => (
                <div
                  key={`${item.id}-${item.timestamp}`}
                  onClick={() => {
                    if (item.type === 'live') {
                      const channel = channels.find((c) => c.id === item.id);
                      if (channel) onSelectChannel(channel);
                    } else {
                      const movie = movies.find((m) => String(m.id) === item.id);
                      if (movie) onSelectMovie(movie);
                    }
                  }}
                  className="liquid-glass rounded-2xl p-3 border border-white/10 hover:border-sky-400/40 cursor-pointer flex items-center gap-3 group transition-all"
                >
                  <div className="w-16 h-12 rounded-xl bg-black/40 overflow-hidden shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-sky-300">
                      {item.title}
                    </h4>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="uppercase text-sky-400 font-semibold">{item.type}</span>
                      <span>·</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Settings & Preferences */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Plan & Billing Status Banner */}
          <div className="liquid-glass rounded-3xl p-6 border border-emerald-500/20 bg-emerald-500/[0.04]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Free Lifetime Plan</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      NO BILLING
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    100% free access to all live TV broadcasts, cinema, and multi-device sync with zero subscription fees.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                <span className="text-slate-400">Monthly Billing:</span>
                <span className="font-bold font-mono text-emerald-400">$0.00 / Free Forever</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section A: App Experience & Display */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-sky-400" />
                Interface & Playback Controls
              </h3>

            {/* TV 10-Foot Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Smart TV 10-Foot UI</span>
                <span className="text-[11px] text-slate-400">Enlarged focus states & full D-pad remote navigation</span>
              </div>
              <button
                onClick={() => onUpdatePreferences({ tvMode: !preferences.tvMode })}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  preferences.tvMode ? 'bg-sky-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Auto-Skip Dead Streams */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Auto-Skip Unavailable Feeds</span>
                <span className="text-[11px] text-slate-400">Skips to the next channel automatically if a stream is offline</span>
              </div>
              <button
                onClick={() => onUpdatePreferences({ autoSkipDeadStreams: !preferences.autoSkipDeadStreams })}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  preferences.autoSkipDeadStreams ? 'bg-sky-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Add Custom Channels */}
            <div className="pt-2">
              <button
                onClick={onOpenCustomChannelModal}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-sky-400" />
                Add Custom Licensed HLS Stream
              </button>
            </div>
          </div>

          {/* Section B: TMDB API & Region Settings */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-sky-400" />
              TMDB API & Localization
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your own TheMovieDB API key to dynamically load live posters, backdrop art, trailers, and cast metadata.
            </p>

            <form onSubmit={handleSaveTmdb} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  TMDB v3 API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={tmdbInput}
                    onChange={(e) => setTmdbInput(e.target.value)}
                    placeholder="Enter TMDB API Key..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catalog Language & Region
                </label>
                <select
                  value={preferences.tmdbLanguage || 'en-US'}
                  onChange={(e) => onUpdatePreferences({ tmdbLanguage: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Español (Spain)</option>
                  <option value="fr-FR">Français (France)</option>
                  <option value="de-DE">Deutsch (Germany)</option>
                  <option value="pt-BR">Português (Brazil)</option>
                  <option value="ja-JP">日本語 (Japan)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                {tmdbSaved && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Saved & Applied
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto py-2 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-sky-500/25"
                >
                  Save TMDB Key
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
