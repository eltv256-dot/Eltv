export type ScreenMode = 'phone' | 'tablet' | 'desktop' | 'tv';

export type NavTab = 'home' | 'live' | 'movies' | 'search' | 'profile';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  countryName: string;
  continent: string;
  language?: string;
  url: string;
  nowPlaying?: string;
  isFeatured?: boolean;
  isCustom?: boolean;
}

export interface EPGProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string; // ISO string or HH:mm
  endTime: string;
  durationMinutes: number;
  category: string;
  rating?: string;
}

export interface Movie {
  id: string | number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  releaseYear: number;
  genres: string[];
  duration?: string;
  trailerUrl?: string; // YouTube or direct video URL
  streamUrl?: string;  // Sample VOD stream
  type: 'movie' | 'series';
  cast?: string[];
  director?: string;
}

export interface WatchHistoryItem {
  id: string;
  title: string;
  type: 'live' | 'movie';
  timestamp: number;
  progressSeconds?: number;
  durationSeconds?: number;
  thumbnail: string;
  url: string;
  channelName?: string;
  releaseYear?: number;
}

export interface AppPreferences {
  theme: 'dark' | 'light';
  tvMode: boolean;
  autoSkipDeadStreams: boolean;
  preferredQuality: string;
  preferredCountry: string;
  tmdbApiKey: string;
  tmdbLanguage: string;
  syncId: string;
  lastSyncedAt?: number;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  continent: string;
}
