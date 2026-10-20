import React, { useState, useMemo } from 'react';
import { Film, Sparkles, Star, Clapperboard, Layers, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieRowSkeleton } from '../components/SkeletonLoader';

interface MoviesViewProps {
  movies: Movie[];
  favorites: string[];
  onSelectMovie: (movie: Movie) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  loading: boolean;
}

export const MoviesView: React.FC<MoviesViewProps> = ({
  movies,
  favorites,
  onSelectMovie,
  onToggleFavorite,
  loading,
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'series'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Animation', 'Documentary', 'Thriller'];

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (mediaType !== 'all' && m.type !== mediaType) return false;
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;
      return true;
    });
  }, [movies, mediaType, selectedGenre]);

  const sciFiMovies = movies.filter((m) => m.genres.includes('Sci-Fi'));
  const actionMovies = movies.filter((m) => m.genres.includes('Action'));
  const dramaMovies = movies.filter((m) => m.genres.includes('Drama'));
  const animationMovies = movies.filter((m) => m.genres.includes('Animation'));
  const docMovies = movies.filter((m) => m.genres.includes('Documentary'));

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Film className="w-6 h-6 text-sky-400" />
            Cinema & Television Series
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated cinematic masterpieces, full-length trailers, and TMDB media
          </p>
        </div>

        {/* Media Type Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setMediaType('all')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              mediaType === 'all' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setMediaType('movie')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              mediaType === 'movie' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            Feature Films
          </button>
          <button
            onClick={() => setMediaType('series')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              mediaType === 'series' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'
            }`}
          >
            Series
          </button>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`py-1.5 px-4 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedGenre === g
                ? 'bg-white/20 text-white font-bold border border-white/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* When specific genre or filter is chosen, show a unified responsive grid */}
      {selectedGenre !== 'All' || mediaType !== 'all' ? (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Showing {filteredMovies.length} titles in {selectedGenre} ({mediaType})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
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
      ) : (
        /* Default Genre Rows Layout */
        <div className="space-y-10">
          {/* Row 1: Sci-Fi & Speculative Fiction */}
          {sciFiMovies.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Sci-Fi & Cosmic Horizons
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {sciFiMovies.map((movie) => (
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
          )}

          {/* Row 2: Action & High Octane */}
          {actionMovies.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  Action & Blockbusters
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {actionMovies.map((movie) => (
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
          )}

          {/* Row 3: Acclaimed Drama & Series */}
          {dramaMovies.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-rose-400" />
                  Award-Winning Drama & Narrative
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {dramaMovies.map((movie) => (
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
          )}

          {/* Row 4: Animation & Fantasy */}
          {animationMovies.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Animation & Fantastic Realms
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {animationMovies.map((movie) => (
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
          )}
        </div>
      )}
    </div>
  );
};
