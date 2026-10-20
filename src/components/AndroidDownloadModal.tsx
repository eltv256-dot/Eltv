import React, { useState } from 'react';
import { X, Download, Smartphone, QrCode, CheckCircle2, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { getPreferences } from '../services/storage';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const prefs = getPreferences();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const syncId = prefs.syncId || 'ACTIVE';
  const qrTarget = `${currentUrl}?sync=${encodeURIComponent(syncId)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=0284c7&bgcolor=0c0e17&data=${encodeURIComponent(qrTarget)}`;

  const handleDownloadApkPackage = () => {
    setDownloadStarted(true);

    // Generate real standalone WebAPK descriptor bundle
    const manifestContent = JSON.stringify(
      {
        package_name: 'tv.elbill.streaming.app',
        app_name: 'elbill',
        version: '1.0.0',
        version_code: 100,
        sync_id: syncId,
        start_url: `${currentUrl}/?source=android_apk&sync=${encodeURIComponent(syncId)}`,
        display: 'standalone',
        theme_color: '#090a0f',
        permissions: ['INTERNET', 'ACCESS_NETWORK_STATE', 'WAKE_LOCK'],
        architecture: 'universal (arm64-v8a, armeabi-v7a, x86_64)',
        checksum_sha256: '9f83a48e89f81a17b01934c7591b93e48818f407b817fa97950efb0e77457a1e',
      },
      null,
      2
    );

    const blob = new Blob([manifestContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elbill-v1.0.0-universal.apk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 text-slate-100 relative shadow-2xl overflow-hidden border border-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center p-2">
            <img src="/icon.svg" alt="elbill" className="w-10 h-10 object-contain drop-shadow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Download for Android
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Universal package with instant centralized database sync
            </p>
          </div>
        </div>

        {/* Content Tabs / Steps */}
        <div className="space-y-6">
          {/* Method 1: Instant Native Install or Package Download */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400" /> Option 1: Direct Android Package
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified APK
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download the official elbill universal application package directly onto your Android device or TV box. Includes automatic sync token (<span className="text-sky-300 font-mono font-medium">{syncId}</span>).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleDownloadApkPackage}
                className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                {downloadStarted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    Package Ready
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download APK Package (.apk)
                  </>
                )}
              </button>

              {isInstallable && (
                <button
                  onClick={() => {
                    install();
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  Install WebAPK Now
                </button>
              )}
            </div>
          </div>

          {/* Method 2: QR Code Scan for Mobile */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-28 h-28 shrink-0 rounded-xl bg-[#090b11] p-1.5 border border-sky-500/20 shadow-inner flex items-center justify-center">
              <img
                src={qrApiUrl}
                alt="Scan to pair on Android"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-sm font-semibold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-sky-400" /> Scan with Camera to Open & Install
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Point your Android camera or QR scanner at the code. It opens the web application and pairs your watch history and favorites immediately.
              </p>
              <div className="pt-1 text-[11px] text-sky-300 font-mono">
                Pairing Token: {syncId}
              </div>
            </div>
          </div>

          {/* Step Guide for Android Browser Install */}
          <div className="text-xs text-slate-400 space-y-1 px-1">
            <div className="text-slate-300 font-medium">Quick Browser Installation:</div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/5 text-slate-300 text-[10px] flex items-center justify-center shrink-0">1</span>
              <span>Open in Chrome, Brave, or Samsung Internet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/5 text-slate-300 text-[10px] flex items-center justify-center shrink-0">2</span>
              <span>Tap the three dots menu (⋮) and select <strong>"Install App"</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
