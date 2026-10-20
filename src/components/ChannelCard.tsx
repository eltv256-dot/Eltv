import React from 'react';
import { Play, Heart, Radio, Tv } from 'lucide-react';
import { Channel } from '../types';
import { COUNTRIES } from '../services/iptv';

interface ChannelCardProps {
  channel: Channel;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onSelect: (channel: Channel) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isFav,
  onToggleFav,
  onSelect,
}) => {
  const countryData = COUNTRIES.find((c) => c.code === channel.country);
  const flag = countryData ? countryData.flag : '🌐';

  return (
    <div
      onClick={() => onSelect(channel)}
      tabIndex={0}
      role="button"
      className="tv-nav-item group relative liquid-glass rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer glass-interactive border border-white/10 hover:border-sky-400/40 transition-all text-left"
    >
      {/* Top Bar: Live Tag, Country Flag, Favorite Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="text-sm" title={channel.countryName}>{flag}</span>
          <span className="text-[11px] font-medium text-slate-400 truncate max-w-[80px]">
            {channel.country}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
          </span>
          <button
            onClick={(e) => onToggleFav(channel.id, e)}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors ${
              isFav ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Center: Channel Logo and Play Overlay */}
      <div className="relative aspect-video w-full rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center p-3 overflow-hidden mb-3 group-hover:bg-white/[0.06] transition-colors">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Clean fallback to channel initial
              const target = e.target as HTMLElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm';
                fallback.innerText = channel.name.substring(0, 2).toUpperCase();
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
            {channel.name.substring(0, 2).toUpperCase()}
          </div>
        )}

        {/* Hover / TV Select Play Button */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-10 h-10 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Bottom: Channel Name, Category & Now Playing */}
      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
          {channel.name}
        </h4>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>{channel.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate text-slate-500">{channel.nowPlaying || 'Live Broadcast'}</span>
        </div>
      </div>
    </div>
  );
};
