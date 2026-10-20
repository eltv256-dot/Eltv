import React, { useState, useEffect } from 'react';
import { Play, Info, Sparkles, Radio, ArrowRight, History, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Channel, Movie, WatchHistoryItem } from '../types';
import { ChannelCard } from '../components/ChannelCard';
import { MovieCard } from '../components/MovieCard';
import { HeroBannerSkeleton } from '../components/SkeletonLoader';

interface HomeViewProps {
  channels: Channel[];
  movies: Movie[];
  watchHistory: WatchHistoryItem[];
  favorites: string[];
  onSelectChannel: (channel: Channel) => void;
  onSelectMovie: (movie: Movie) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateToLive: () => void;
  onNavigateToMovies: () => void;
  loading: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  channels,
  movies,
  watchHistory,
  favorites,
  onSelectChannel,
  onSelectMovie,
  onToggleFavorite,
  onNavigateToLive,
  onNavigateToMovies,
  loading,
}) => {
  // Hero featured slider
  const heroItems = [
    {
      id: 'hero-scifi',
      title: 'Interstellar Odyssey',
      subtitle: 'Beyond Space and Time · 4K Master Broadcast',
      description: 'Humanity ventures into the unknown through a deep space anomaly near Saturn. Experience breathtaking cinematography in ultra high definition.',
      backdrop: '/src/assets/images/hero_scifi_odyssey_1792444847656.jpg',
      category: 'Sci-Fi Cinema',
      rating: 8.8,
      isLive: true,
      channelId: 'cinema-4k-master',
    },
    {
      id: 'hero-deepsea',
      title: 'Deep Ocean Trench: Earth Unseen',
      subtitle: 'Bioluminescent Abyss · BBC Earth Presentation',
      description: 'Gliding along nocturnal abyssal reefs with bioluminescent manta rays and deep sea giants in pure high definition.',
      backdrop: '/src/assets/images/hero_nature_deepsea_1792444848871.jpg',
      category: 'Documentary',
      rating: 9.1,
      isLive: true,
      channelId: 'nasa-tv',
    },
    {
      id: 'hero-action',
      title: 'Midnight Tokyo: Neo-Noir Chronicles',
      subtitle: 'Cyberpunk Metropolis · Directed by Denis Villeneuve',
      description: 'Neon reflections on rain-soaked asphalt and atmospheric mystery under the towering skyscrapers of Shinjuku.',
      backdrop: '/src/assets/images/hero_action_thriller_1792444848391.jpg',
      category: 'Action & Thriller',
      rating: 8.4,
      isLive: false,
      movieId: 'blade-runner-2049',
    },
  ];

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  // Auto-rotate hero every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroItems.length]);

  const activeHero = heroItems[activeHeroIdx];

  const handleHeroPlay = () => {
    if (activeHero.isLive) {
      const channel = channels.find((c) => c.id === activeHero.channelId) || channels[0];
      if (channel) onSelectChannel(channel);
    } else {
      const movie = movies.find((m) => m.id === activeHero.movieId) || movies[0];
      if (movie) onSelectMovie(movie);
    }
  };

  const featuredChannels = channels.filter((c) => c.isFeatured || c.category === 'News').slice(0, 6);
  const trendingMovies = movies.slice(0, 10);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Auto-Rotating Cinematic Hero Banner */}
      {loading ? (
        <HeroBannerSkeleton />
      ) : (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] w-full rounded-3xl overflow-hidden liquid-glass border border-white/10 shadow-2xl group">
          {/* Backdrop Image */}
          <img
            src={activeHero.backdrop}
            alt={activeHero.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Liquid Glass Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent max-w-2xl" />

          {/* Hero Content */}
          <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end max-w-2xl z-10">
            <div className="flex items-center gap-2 mb-2">
              {activeHero.isLive && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                  <Radio className="w-3 h-3 animate-pulse" /> Live Now
                </span>
              )}
              <span className="text-xs font-semibold text-sky-400">
                {activeHero.category}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{activeHero.rating}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
              {activeHero.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-6 max-w-xl leading-relaxed drop-shadow">
              {activeHero.description}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleHeroPlay}
                className="tv-nav-item py-3 px-6 sm:px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-sky-500/30 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Stream Now
              </button>

              <button
                onClick={() => {
                  if (activeHero.isLive) onNavigateToLive();
                  else onNavigateToMovies();
                }}
                className="tv-nav-item py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-colors"
              >
                <Info className="w-4 h-4" />
                Explore Catalog
              </button>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            {heroItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  activeHeroIdx === idx ? 'w-8 bg-sky-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Continue Watching (if watch history exists) */}
      {watchHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-sky-400" />
              Continue Watching
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {watchHistory.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'live') {
                    const channel = channels.find((c) => c.id === item.id);
                    if (channel) onSelectChannel(channel);
                  } else {
                    const movie = movies.find((m) => String(m.id) === item.id);
                    if (movie) onSelectMovie(movie);
                  }
                }}
                className="tv-nav-item flex-shrink-0 w-60 sm:w-72 liquid-glass rounded-2xl p-3 border border-white/10 hover:border-sky-400/30 cursor-pointer transition-all glass-interactive group"
              >
                <div className="relative aspect-video w-full rounded-xl bg-black/40 overflow-hidden mb-2.5">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-sky-400 w-2/3" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[180px]">{item.title}</span>
                  <span className="text-[10px] text-sky-400 uppercase font-semibold">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Live Now Worldwide Channels */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
              Live Now: Top Worldwide Broadcasts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified 24/7 global news, sports, and documentary channels
            </p>
          </div>

          <button
            onClick={onNavigateToLive}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Channels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {featuredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFav={favorites.includes(channel.id)}
              onToggleFav={onToggleFavorite}
              onSelect={onSelectChannel}
            />
          ))}
        </div>
      </section>

      {/* 4. Trending Cinema & Series */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Trending Cinema & Series
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated blockbusters, acclaimed documentaries, and series
            </p>
          </div>

          <button
            onClick={onNavigateToMovies}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Browse Cinema</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
          {trendingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFav={favorites.includes(String(movie.id))}
              onToggleFav={onToggleFavorite}
              onSelect={onSelectMovie}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
