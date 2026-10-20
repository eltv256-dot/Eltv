import React, { useState } from 'react';
import { X, Play, Heart, Star, Film, Sparkles, User, Clapperboard } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  isOpen,
  onClose,
  onPlay,
  isFav,
  onToggleFav,
}) => {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="w-full max-w-3xl liquid-glass-elevated rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative text-slate-100 my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors border border-white/10 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop or Trailer Embed */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
          {showTrailer && movie.trailerUrl ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1`}
              title={`${movie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          ) : (
            <>
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/40 to-transparent" />

              {/* Center Play Trailer Button */}
              {movie.trailerUrl && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 hover:bg-sky-500 hover:text-slate-950 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-2xl group"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-sky-400 uppercase tracking-wider">{movie.type}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.releaseYear}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.duration || '2h 15m'}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.rating}</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  onPlay(movie);
                  onClose();
                }}
                className="py-3 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Stream Now
              </button>

              <button
                onClick={(e) => onToggleFav(String(movie.id), e)}
                className={`p-3 rounded-2xl transition-colors border ${
                  isFav
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Genres Chips */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Synopsis
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.overview}
            </p>
          </div>

          {/* Cast & Director */}
          {(movie.cast || movie.director) && (
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {movie.director && (
                <div>
                  <span className="text-slate-400 block mb-1">Director</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5 text-sky-400" />
                    {movie.director}
                  </span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-slate-400 block mb-1">Starring</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    {movie.cast.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
