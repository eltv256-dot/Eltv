import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, Channel, Movie, WatchHistoryItem, AppPreferences } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SideNav } from './components/SideNav';
import { Player } from './components/Player';
import { MovieDetailModal } from './components/MovieDetailModal';
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { CustomChannelModal } from './components/CustomChannelModal';

import { HomeView } from './views/HomeView';
import { LiveTVView } from './views/LiveTVView';
import { MoviesView } from './views/MoviesView';
import { SearchView } from './views/SearchView';
import { ProfileView } from './views/ProfileView';

import { fetchChannels, detectUserCountry } from './services/iptv';
import { fetchTrendingMovies } from './services/tmdb';
import {
  getFavorites,
  toggleFavorite,
  getWatchHistory,
  getPreferences,
  savePreferences,
} from './services/storage';
import { useTVNavigation } from './hooks/useTVNavigation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [preferences, setPreferences] = useState<AppPreferences>(getPreferences());
  const [userCountry, setUserCountry] = useState<string>('US');
  const [loading, setLoading] = useState<boolean>(true);

  // Active Modals & Player
  const [activePlayerItem, setActivePlayerItem] = useState<Channel | Movie | null>(null);
  const [selectedMovieDetail, setSelectedMovieDetail] = useState<Movie | null>(null);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isCustomChannelModalOpen, setIsCustomChannelModalOpen] = useState<boolean>(false);

  // Back action handler for Smart TV D-Pad & Escape key
  const handleBack = useCallback(() => {
    if (activePlayerItem) {
      setActivePlayerItem(null);
      return;
    }
    if (selectedMovieDetail) {
      setSelectedMovieDetail(null);
      return;
    }
    if (isAndroidModalOpen) {
      setIsAndroidModalOpen(false);
      return;
    }
    if (isSyncModalOpen) {
      setIsSyncModalOpen(false);
      return;
    }
    if (isCustomChannelModalOpen) {
      setIsCustomChannelModalOpen(false);
      return;
    }
    if (currentTab !== 'home') {
      setCurrentTab('home');
    }
  }, [
    activePlayerItem,
    selectedMovieDetail,
    isAndroidModalOpen,
    isSyncModalOpen,
    isCustomChannelModalOpen,
    currentTab,
  ]);

  const { isTVMode, toggleTVMode } = useTVNavigation(handleBack);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    const country = detectUserCountry();
    setUserCountry(country);

    const [channelList, movieList] = await Promise.all([
      fetchChannels(),
      fetchTrendingMovies(),
    ]);

    setChannels(channelList);
    setMovies(movieList);
    setFavorites(getFavorites());
    setWatchHistory(getWatchHistory());
    setPreferences(getPreferences());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    // Cross-tab and centralized sync listener
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('elbill_local_sync');
      channel.onmessage = () => {
        setFavorites(getFavorites());
        setWatchHistory(getWatchHistory());
        setPreferences(getPreferences());
        fetchChannels().then(setChannels);
      };
      return () => channel.close();
    }
  }, [loadData]);

  // Sync theme changes with DOM documentElement
  useEffect(() => {
    if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [preferences.theme]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    setFavorites(getFavorites());
  };

  const handleToggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    const updated = savePreferences({ theme: nextTheme });
    setPreferences(updated);
  };

  const handleUpdatePreferences = (newPrefs: Partial<AppPreferences>) => {
    const updated = savePreferences(newPrefs);
    setPreferences(updated);
    if (newPrefs.tmdbApiKey !== undefined || newPrefs.tmdbLanguage !== undefined) {
      fetchTrendingMovies().then(setMovies);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isTVMode ? 'tv-mode text-base' : ''}`}>
      {/* Top Header (Visible on Desktop / Tablet) */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isTVMode={isTVMode}
        onToggleTVMode={toggleTVMode}
        theme={preferences.theme}
        onToggleTheme={handleToggleTheme}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Layout Container (Side Nav + Content) */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        {/* Side Nav Rail (Visible on Tablets & Smart TV Mode) */}
        <SideNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isTVMode={isTVMode}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar pb-24 md:pb-8">
          {currentTab === 'home' && (
            <HomeView
              channels={channels}
              movies={movies}
              watchHistory={watchHistory}
              favorites={favorites}
              onSelectChannel={(ch) => setActivePlayerItem(ch)}
              onSelectMovie={(m) => setSelectedMovieDetail(m)}
              onToggleFavorite={handleToggleFavorite}
              onNavigateToLive={() => setCurrentTab('live')}
              onNavigateToMovies={() => setCurrentTab('movies')}
              loading={loading}
            />
          )}

          {currentTab === 'live' && (
            <LiveTVView
              channels={channels}
              favorites={favorites}
              userCountry={userCountry}
              onSelectChannel={(ch) => setActivePlayerItem(ch)}
              onToggleFavorite={handleToggleFavorite}
              onOpenCustomChannelModal={() => setIsCustomChannelModalOpen(true)}
              loading={loading}
            />
          )}

          {currentTab === 'movies' && (
            <MoviesView
              movies={movies}
              favorites={favorites}
              onSelectMovie={(m) => setSelectedMovieDetail(m)}
              onToggleFavorite={handleToggleFavorite}
              loading={loading}
            />
          )}

          {currentTab === 'search' && (
            <SearchView
              channels={channels}
              movies={movies}
              favorites={favorites}
              onSelectChannel={(ch) => setActivePlayerItem(ch)}
              onSelectMovie={(m) => setSelectedMovieDetail(m)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              channels={channels}
              movies={movies}
              favorites={favorites}
              watchHistory={watchHistory}
              preferences={preferences}
              onSelectChannel={(ch) => setActivePlayerItem(ch)}
              onSelectMovie={(m) => setSelectedMovieDetail(m)}
              onToggleFavorite={handleToggleFavorite}
              onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onOpenCustomChannelModal={() => setIsCustomChannelModalOpen(true)}
              onUpdatePreferences={handleUpdatePreferences}
              onReloadHistory={() => setWatchHistory(getWatchHistory())}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Navigation Bar (Phones) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Full-Screen Video Player */}
      {activePlayerItem && (
        <Player
          item={activePlayerItem}
          allChannels={channels}
          onClose={() => {
            setActivePlayerItem(null);
            setWatchHistory(getWatchHistory());
          }}
          onSelectChannel={(nextChannel) => setActivePlayerItem(nextChannel)}
        />
      )}

      {/* Movie Detail & Trailer Modal */}
      {selectedMovieDetail && (
        <MovieDetailModal
          movie={selectedMovieDetail}
          isOpen={Boolean(selectedMovieDetail)}
          onClose={() => setSelectedMovieDetail(null)}
          onPlay={(movie) => {
            setSelectedMovieDetail(null);
            setActivePlayerItem(movie);
          }}
          isFav={favorites.includes(String(selectedMovieDetail.id))}
          onToggleFav={handleToggleFavorite}
        />
      )}

      {/* Android Download Modal */}
      <AndroidDownloadModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Centralized Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncCompleted={() => {
          setFavorites(getFavorites());
          setWatchHistory(getWatchHistory());
          setPreferences(getPreferences());
          fetchChannels().then(setChannels);
        }}
      />

      {/* Custom Licensed HLS Stream Modal */}
      <CustomChannelModal
        isOpen={isCustomChannelModalOpen}
        onClose={() => setIsCustomChannelModalOpen(false)}
        onAdded={(newChannel) => {
          setChannels((prev) => [newChannel, ...prev]);
          setActivePlayerItem(newChannel);
        }}
      />
    </div>
  );
}
