import React from 'react';
import { Star, Play, Heart, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFav,
  onToggleFav,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      tabIndex={0}
      role="button"
      className="tv-nav-item group relative flex-shrink-0 w-36 sm:w-44 md:w-48 flex flex-col cursor-pointer transition-all glass-interactive text-left"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden liquid-glass border border-white/10 group-hover:border-sky-400/50 shadow-lg group-hover:shadow-sky-500/10 transition-all">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLElement;
            target.style.display = 'none';
          }}
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges: Rating & Favorite */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
          </div>

          <button
            onClick={(e) => onToggleFav(String(movie.id), e)}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
              isFav ? 'bg-rose-500/80 text-white' : 'bg-black/40 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover / Remote Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom Year / Type tag */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
            {movie.type === 'series' ? 'Series' : 'Cinema'} · {movie.releaseYear}
          </span>
        </div>
      </div>

      {/* Title & Category Under Poster */}
      <div className="mt-2.5 px-0.5 space-y-0.5">
        <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
          {movie.title}
        </h4>
        <div className="text-[11px] text-slate-400 truncate">
          {movie.genres.join(', ')}
        </div>
      </div>
    </div>
  );
};
