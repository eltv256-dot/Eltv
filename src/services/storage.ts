import { AppPreferences, Channel, WatchHistoryItem } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'elbill_favorites',
  HISTORY: 'elbill_history',
  CUSTOM_CHANNELS: 'elbill_custom_channels',
  PREFERENCES: 'elbill_preferences',
  SYNC_ID: 'elbill_sync_id',
};

const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'dark',
  tvMode: false,
  autoSkipDeadStreams: true,
  preferredQuality: 'Auto',
  preferredCountry: 'ALL',
  tmdbApiKey: '',
  tmdbLanguage: 'en-US',
  syncId: '',
  lastSyncedAt: Date.now(),
};

// Cross-tab broadcast channel for immediate multi-window sync
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('elbill_local_sync');
  } catch {
    // Ignore fallback
  }
}

export function notifySync(action: string, payload?: unknown) {
  if (syncChannel) {
    syncChannel.postMessage({ action, payload, timestamp: Date.now() });
  }
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  const current = getFavorites();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    notifySync('FAVORITES_UPDATED', updated);
  } catch {
    // quota exceeded or private mode
  }
  return !exists;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function getWatchHistory(): WatchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchHistory(item: Omit<WatchHistoryItem, 'timestamp'>): void {
  const current = getWatchHistory();
  const filtered = current.filter((h) => h.id !== item.id);
  const updated: WatchHistoryItem[] = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    notifySync('HISTORY_UPDATED', updated);
  } catch {
    // ignore
  }
}

export function clearWatchHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  notifySync('HISTORY_UPDATED', []);
}

export function getCustomChannels(): Channel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHANNELS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomChannel(channel: Channel): void {
  const current = getCustomChannels();
  const updated = [...current.filter((c) => c.id !== channel.id), channel];
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(updated));
  notifySync('CHANNELS_UPDATED', updated);
}

export function deleteCustomChannel(id: string): void {
  const current = getCustomChannels();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(updated));
  notifySync('CHANNELS_UPDATED', updated);
}

export function getPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<AppPreferences>): AppPreferences {
  const current = getPreferences();
  const updated = { ...current, ...prefs, lastSyncedAt: Date.now() };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  notifySync('PREFS_UPDATED', updated);
  return updated;
}

export function exportBackupData(): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    favorites: getFavorites(),
    history: getWatchHistory(),
    customChannels: getCustomChannels(),
    preferences: getPreferences(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.favorites && Array.isArray(parsed.favorites)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(parsed.favorites));
    }
    if (parsed.history && Array.isArray(parsed.history)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
    }
    if (parsed.customChannels && Array.isArray(parsed.customChannels)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(parsed.customChannels));
    }
    if (parsed.preferences) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(parsed.preferences));
    }
    notifySync('ALL_RESTORED');
    return true;
  } catch {
    return false;
  }
}
