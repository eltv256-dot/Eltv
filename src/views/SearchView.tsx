import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Radio, Film, Globe, Sparkles } from 'lucide-react';
import { Channel, Movie } from '../types';
import { ChannelCard } from '../components/ChannelCard';
import { MovieCard } from '../components/MovieCard';

interface SearchViewProps {
  channels: Channel[];
  movies: Movie[];
  favorites: string[];
  onSelectChannel: (channel: Channel) => void;
  onSelectMovie: (movie: Movie) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  channels,
  movies,
  favorites,
  onSelectChannel,
  onSelectMovie,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'channels' | 'movies'>('all');

  const popularSearches = [
    'NASA TV',
    'DW News',
    'Sci-Fi',
    'Sports',
    'France',
    'Germany',
    'Japan',
    'Christopher Nolan',
    'Denis Villeneuve',
    'Music',
  ];

  const { matchingChannels, matchingMovies } = useMemo(() => {
    if (!query.trim()) return { matchingChannels: [], matchingMovies: [] };
    const q = query.toLowerCase().trim();

    const cMatches = channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.countryName.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        (c.nowPlaying && c.nowPlaying.toLowerCase().includes(q))
    );

    const mMatches = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.overview.toLowerCase().includes(q) ||
        (m.cast && m.cast.some((actor) => actor.toLowerCase().includes(q))) ||
        (m.director && m.director.toLowerCase().includes(q))
    );

    return { matchingChannels: cMatches, matchingMovies: mMatches };
  }, [query, channels, movies]);

  const totalResults = matchingChannels.length + matchingMovies.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, movies, directors, countries..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl liquid-glass border border-white/15 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 shadow-2xl transition-all"
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-4.5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        {!query && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="py-1.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/5 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {query && (
        <div className="space-y-6">
          {/* Result Filter Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-sm text-slate-300">
              Found <strong className="text-white">{totalResults}</strong> results for "{query}"
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'all' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setFilterType('channels')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'channels' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Channels ({matchingChannels.length})
              </button>
              <button
                onClick={() => setFilterType('movies')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'movies' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Cinema ({matchingMovies.length})
              </button>
            </div>
          </div>

          {totalResults === 0 ? (
            <div className="liquid-glass rounded-3xl p-12 text-center space-y-3 border border-white/10 max-w-md mx-auto">
              <SearchIcon className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Results Found</h3>
              <p className="text-xs text-slate-400">
                We couldn't find any channels or films matching "{query}". Check spelling or try a broader keyword like "News" or "Sci-Fi".
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Channel Results */}
              {(filterType === 'all' || filterType === 'channels') && matchingChannels.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500" />
                    Live Channels ({matchingChannels.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {matchingChannels.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        isFav={favorites.includes(channel.id)}
                        onToggleFav={onToggleFavorite}
                        onSelect={onSelectChannel}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Movie Results */}
              {(filterType === 'all' || filterType === 'movies') && matchingMovies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-sky-400" />
                    Cinema & Series ({matchingMovies.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {matchingMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFav={favorites.includes(String(movie.id))}
                        onToggleFav={onToggleFavorite}
                        onSelect={onSelectMovie}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
