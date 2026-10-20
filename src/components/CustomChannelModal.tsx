import React, { useState } from 'react';
import { X, Plus, Radio, Globe, Layers, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Channel } from '../types';
import { CATEGORIES, CONTINENTS, COUNTRIES } from '../services/iptv';
import { saveCustomChannel } from '../services/storage';

interface CustomChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (channel: Channel) => void;
}

export const CustomChannelModal: React.FC<CustomChannelModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<string>('News');
  const [country, setCountry] = useState<string>('US');
  const [logo, setLogo] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a channel name.');
      return;
    }
    if (!url.trim() || !url.startsWith('http')) {
      setError('Please enter a valid HTTP/HTTPS HLS stream URL.');
      return;
    }

    const countryObj = COUNTRIES.find((c) => c.code === country);
    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      url: url.trim(),
      category,
      country,
      countryName: countryObj ? countryObj.name : country,
      continent: countryObj ? countryObj.continent : 'Europe',
      logo: logo.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff`,
      nowPlaying: 'User Stream Broadcast',
      isCustom: true,
    };

    saveCustomChannel(newChannel);
    onAdded(newChannel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg liquid-glass-elevated rounded-3xl p-6 sm:p-8 text-slate-100 relative shadow-2xl border border-white/10"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add Custom HLS Channel</h3>
            <p className="text-xs text-slate-400">Stream your own licensed live feeds and M3U8 URLs</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Channel Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Regional Sports HD"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              HLS Stream URL (.m3u8) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/live/master.m3u8"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 font-mono text-xs"
              />
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
              >
                {COUNTRIES.filter((c) => c.code !== 'ALL').map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Logo Image URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 text-xs"
              />
              <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Save Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
