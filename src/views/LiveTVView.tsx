import React, { useState, useMemo } from 'react';
import {
  Globe,
  Radio,
  Plus,
  SlidersHorizontal,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { Channel } from '../types';
import { ChannelCard } from '../components/ChannelCard';
import { EPGTimeline } from '../components/EPGTimeline';
import { ChannelGridSkeleton } from '../components/SkeletonLoader';
import { CONTINENTS, CATEGORIES, COUNTRIES } from '../services/iptv';

interface LiveTVViewProps {
  channels: Channel[];
  favorites: string[];
  userCountry: string;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenCustomChannelModal: () => void;
  loading: boolean;
}

export const LiveTVView: React.FC<LiveTVViewProps> = ({
  channels,
  favorites,
  userCountry,
  onSelectChannel,
  onToggleFavorite,
  onOpenCustomChannelModal,
  loading,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEPG, setShowEPG] = useState<boolean>(true);

  // Filter channels based on continent, country, category, search, and prioritize user's local country
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      // Continent filter
      if (selectedContinent !== 'All' && c.continent !== selectedContinent) {
        return false;
      }
      // Country filter
      if (selectedCountry !== 'ALL' && c.country !== selectedCountry) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCat = c.category.toLowerCase().includes(q);
        const matchesCountry = c.countryName.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesCountry) return false;
      }
      return true;
    }).sort((a, b) => {
      // Prioritize user's local country channels first
      if (selectedCountry === 'ALL') {
        const aIsLocal = a.country === userCountry ? 1 : 0;
        const bIsLocal = b.country === userCountry ? 1 : 0;
        if (aIsLocal !== bIsLocal) return bIsLocal - aIsLocal;
      }
      return 0;
    });
  }, [channels, selectedContinent, selectedCountry, selectedCategory, searchQuery, userCountry]);

  // Countries filtered by selected continent
  const availableCountries = useMemo(() => {
    if (selectedContinent === 'All') return COUNTRIES;
    return COUNTRIES.filter((c) => c.continent === selectedContinent || c.code === 'ALL');
  }, [selectedContinent]);

  const userCountryData = COUNTRIES.find((c) => c.code === userCountry);

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
              Live Television
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-semibold">
              {filteredChannels.length} Streams
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Worldwide public broadcasts, 24/7 news, and licensed HLS networks
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* EPG Timeline Toggle */}
          <button
            onClick={() => setShowEPG(!showEPG)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showEPG
                ? 'bg-sky-500 text-slate-950 border-sky-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{showEPG ? 'Hide TV Guide' : 'Show TV Guide'}</span>
          </button>

          {/* Add Custom Channel */}
          <button
            onClick={onOpenCustomChannelModal}
            className="py-2 px-3.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-400/30 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Stream</span>
          </button>
        </div>
      </div>

      {/* Auto-detected user country banner (if local channels exist) */}
      {userCountryData && userCountry !== 'ALL' && selectedCountry === 'ALL' && (
        <div className="liquid-glass rounded-2xl p-3.5 sm:p-4 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{userCountryData.flag}</span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                Auto-Detected Location: {userCountryData.name}
              </div>
              <p className="text-[11px] text-slate-400">
                Prioritizing local television broadcasts and verified national feeds first
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCountry(userCountry)}
            className="text-xs font-medium text-sky-400 hover:text-sky-300 shrink-0 underline decoration-sky-400/40"
          >
            Filter Only {userCountry}
          </button>
        </div>
      )}

      {/* Multi-tier Filtering: Continent Tabs, Country Dropdown & Search */}
      <div className="space-y-4 liquid-glass rounded-3xl p-4 sm:p-6 border border-white/10">
        {/* Tier 1: Continents */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Continent
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {CONTINENTS.map((cont) => (
              <button
                key={cont}
                onClick={() => {
                  setSelectedContinent(cont);
                  setSelectedCountry('ALL');
                }}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedContinent === cont
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>

        {/* Tier 2: Country Select & Quick Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          {/* Country Dropdown */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-sky-400"
            >
              {availableCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Channels */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-sky-400" />
              Filter Stream or Network
            </label>
            <input
              type="text"
              placeholder="Search channel name, country, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Tier 3: Category Chips */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Category
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white border border-white/30 font-semibold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive EPG Timeline Guide (if enabled) */}
      {showEPG && filteredChannels.length > 0 && (
        <EPGTimeline
          channels={filteredChannels}
          onSelectChannel={onSelectChannel}
        />
      )}

      {/* Channel Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Displaying {filteredChannels.length} active broadcast networks
          </span>
          {selectedCountry !== 'ALL' && (
            <button
              onClick={() => setSelectedCountry('ALL')}
              className="text-sky-400 hover:text-sky-300 underline"
            >
              Reset Country Filter
            </button>
          )}
        </div>

        {loading ? (
          <ChannelGridSkeleton count={12} />
        ) : filteredChannels.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-12 text-center space-y-3 border border-white/10">
            <Radio className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Channels Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No live feeds matching the selected filters. Try choosing "All Continents" or resetting your search.
            </p>
            <button
              onClick={() => {
                setSelectedContinent('All');
                setSelectedCountry('ALL');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isFav={favorites.includes(channel.id)}
                onToggleFav={onToggleFavorite}
                onSelect={onSelectChannel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
