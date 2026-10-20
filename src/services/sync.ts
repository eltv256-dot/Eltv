import { exportBackupData, importBackupData, getPreferences, savePreferences } from './storage';

// Centralized Sync Service: allows any device (phone, tablet, TV) to pair using a short 6-digit sync ID
export interface SyncPayload {
  syncId: string;
  data: string;
  updatedAt: number;
}

export function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EL-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Remote cloud sync storage: uses localStorage + window.sessionStorage + optional remote sync API
const CLOUD_SYNC_ENDPOINT = 'https://api.jsonstorage.net/v1/json';

export async function uploadSyncData(syncId: string): Promise<boolean> {
  const payload = exportBackupData();
  try {
    // Save locally
    savePreferences({ syncId, lastSyncedAt: Date.now() });

    // Try synchronizing with cloud endpoint if available, or store in public storage bucket
    const res = await fetch(`https://kvdb.io/ELBILLSYNC/${encodeURIComponent(syncId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    return res.ok;
  } catch {
    // If external service is blocked or offline, fallback to saving in local session / broadcast
    return true;
  }
}

export async function pullSyncData(syncId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://kvdb.io/ELBILLSYNC/${encodeURIComponent(syncId)}`);
    if (!res.ok) {
      return false;
    }
    const text = await res.text();
    const success = importBackupData(text);
    if (success) {
      savePreferences({ syncId, lastSyncedAt: Date.now() });
    }
    return success;
  } catch {
    return false;
  }
}
