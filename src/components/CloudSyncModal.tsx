import React, { useState } from 'react';
import { X, RefreshCw, Upload, Download, CheckCircle2, Copy, Smartphone, Monitor, Database } from 'lucide-react';
import { getPreferences, exportBackupData, importBackupData } from '../services/storage';
import { generateSyncCode, uploadSyncData, pullSyncData } from '../services/sync';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncCompleted: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncCompleted,
}) => {
  const prefs = getPreferences();
  const [syncId, setSyncId] = useState(prefs.syncId || generateSyncCode());
  const [targetSyncId, setTargetSyncId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    setIsSyncing(true);
    setStatusMessage('Uploading watch history and favorites to centralized database...');
    const ok = await uploadSyncData(syncId);
    setIsSyncing(false);
    if (ok) {
      setIsSuccess(true);
      setStatusMessage(`Data synchronized successfully under ID: ${syncId}`);
      onSyncCompleted();
    } else {
      setIsSuccess(false);
      setStatusMessage('Synchronization completed locally.');
    }
  };

  const handlePull = async () => {
    if (!targetSyncId.trim()) return;
    setIsSyncing(true);
    setStatusMessage(`Connecting to remote device with ID: ${targetSyncId}...`);
    const ok = await pullSyncData(targetSyncId.trim().toUpperCase());
    setIsSyncing(false);
    if (ok) {
      setIsSuccess(true);
      setSyncId(targetSyncId.trim().toUpperCase());
      setStatusMessage('Data pulled successfully! All favorites & history restored.');
      onSyncCompleted();
    } else {
      setIsSuccess(false);
      setStatusMessage('Device sync ID not found or network timed out.');
    }
  };

  const handleExportJSON = () => {
    const data = exportBackupData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elbill-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = importBackupData(text);
        if (success) {
          setIsSuccess(true);
          setStatusMessage('Backup file imported successfully!');
          onSyncCompleted();
        } else {
          setIsSuccess(false);
          setStatusMessage('Invalid backup JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 text-slate-100 relative shadow-2xl border border-white/10"
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
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Centralized Database Sync</h3>
            <p className="text-xs text-slate-400">Pair phone, tablet, and TV screens seamlessly</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mb-5 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Section 1: This Device Sync ID */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                This Device Pairing Code
              </span>
              <button
                onClick={() => setSyncId(generateSyncCode())}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" /> Generate New
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 px-4 py-3 rounded-xl border border-white/10 text-lg font-mono font-bold text-sky-400 tracking-widest text-center select-all">
                {syncId}
              </div>
              <button
                onClick={handleUpload}
                disabled={isSyncing}
                className="py-3 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all shrink-0"
              >
                <Upload className="w-4 h-4" />
                {isSyncing ? 'Syncing...' : 'Sync Cloud'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Enter this code on your TV, iPhone, or Android app to mirror your watch state.
            </p>
          </div>

          {/* Section 2: Pair with Another Screen */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Pair with Another Device
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Sync Code (e.g. EL-9821)"
                value={targetSyncId}
                onChange={(e) => setTargetSyncId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-sky-400 uppercase"
              />
              <button
                onClick={handlePull}
                disabled={!targetSyncId.trim() || isSyncing}
                className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" /> Link & Restore
              </button>
            </div>
          </div>

          {/* Section 3: File Backup / JSON Export & Import */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Manual JSON Backup:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors"
              >
                Export JSON
              </button>
              <label className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors cursor-pointer">
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
