import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture2,
  Tv,
  ChevronUp,
  ChevronDown,
  X,
  Settings2,
  Subtitles,
  Cast,
  Radio,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Channel, Movie } from '../types';
import { addToWatchHistory, toggleFavorite, isFavorite } from '../services/storage';

interface PlayerProps {
  item: Channel | Movie;
  allChannels?: Channel[];
  onClose: () => void;
  onSelectChannel?: (channel: Channel) => void;
}

export const Player: React.FC<PlayerProps> = ({ item, allChannels = [], onClose, onSelectChannel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [levels, setLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [hasAirplay, setHasAirplay] = useState(false);
  const [hasChromecast, setHasChromecast] = useState(false);

  // Stream health & error auto-skip state
  const [streamError, setStreamError] = useState<string | null>(null);
  const [autoSkipCountdown, setAutoSkipCountdown] = useState<number | null>(null);
  const hideControlsTimer = useRef<number | null>(null);

  const isChannel = 'country' in item;
  const streamUrl = isChannel ? (item as Channel).url : (item as Movie).streamUrl || (item as Movie).trailerUrl || '';

  const currentChannelIndex = isChannel ? allChannels.findIndex((c) => c.id === item.id) : -1;

  // Next / Previous Channel Switching
  const handleNextChannel = useCallback(() => {
    if (!isChannel || allChannels.length === 0 || !onSelectChannel) return;
    const nextIdx = (currentChannelIndex + 1) % allChannels.length;
    onSelectChannel(allChannels[nextIdx]);
  }, [isChannel, allChannels, currentChannelIndex, onSelectChannel]);

  const handlePrevChannel = useCallback(() => {
    if (!isChannel || allChannels.length === 0 || !onSelectChannel) return;
    const prevIdx = (currentChannelIndex - 1 + allChannels.length) % allChannels.length;
    onSelectChannel(allChannels[prevIdx]);
  }, [isChannel, allChannels, currentChannelIndex, onSelectChannel]);

  // Stream Initialization with hls.js & Native HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setStreamError(null);
    setAutoSkipCountdown(null);

    // Destroy any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Save to watch history
    addToWatchHistory({
      id: String(item.id),
      title: isChannel ? (item as Channel).name : (item as Movie).title,
      type: isChannel ? 'live' : 'movie',
      thumbnail: isChannel ? (item as Channel).logo : (item as Movie).posterUrl,
      url: streamUrl,
      channelName: isChannel ? (item as Channel).name : undefined,
    });

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 8000,
        levelLoadingTimeOut: 8000,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLevels(
          data.levels.map((lvl, index) => ({
            id: index,
            height: lvl.height || 720,
            bitrate: lvl.bitrate || 0,
          }))
        );
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_, errorData) => {
        if (errorData.fatal) {
          switch (errorData.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setStreamError('Network connection to stream timed out or was blocked.');
              triggerAutoSkip();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setStreamError('Stream format not supported or broadcast offline.');
              triggerAutoSkip();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS
      video.src = streamUrl;
      video.play().catch(() => setIsPlaying(false));
    } else {
      setStreamError('Your browser does not support HLS streaming.');
    }

    // Detect AirPlay support on WebKit
    if ((window as any).WebKitPlaybackTargetAvailabilityEvent) {
      setHasAirplay(true);
    }
    // Detect Cast API
    if ('remote' in video) {
      setHasChromecast(true);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, item]);

  // Auto-skip countdown if stream is dead
  const triggerAutoSkip = () => {
    if (!isChannel || allChannels.length <= 1) return;
    setAutoSkipCountdown(3);
  };

  useEffect(() => {
    if (autoSkipCountdown === null) return;
    if (autoSkipCountdown <= 0) {
      handleNextChannel();
      return;
    }
    const timer = setTimeout(() => {
      setAutoSkipCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoSkipCountdown, handleNextChannel]);

  // Controls Visibility Activity Timer
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) {
      window.clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
        setShowQualityMenu(false);
        setShowSubtitlesMenu(false);
      }
    }, 4000);
  }, [isPlaying]);

  useEffect(() => {
    const handleActivity = () => resetControlsTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    };
  }, [resetControlsTimer]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevChannel();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextChannel();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, handleNextChannel, handlePrevChannel, onClose]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      video.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch {
      // not supported
    }
  };

  const handleQualityChange = (levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
      setSelectedLevel(levelId);
      setShowQualityMenu(false);
    }
  };

  const triggerAirplay = () => {
    const video = videoRef.current as any;
    if (video && video.webkitShowPlaybackTargetPicker) {
      video.webkitShowPlaybackTargetPicker();
    }
  };

  const itemName = isChannel ? (item as Channel).name : (item as Movie).title;
  const itemSubtitle = isChannel
    ? (item as Channel).nowPlaying || `${(item as Channel).category} · ${(item as Channel).countryName}`
    : `${(item as Movie).releaseYear} · ${(item as Movie).genres.join(', ')}`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
        webkit-playsinline="true"
      />

      {/* Dead Stream Notice / Friendly Skip Overlay */}
      {streamError && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center z-40 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Stream Temporarily Unavailable</h3>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            {streamError} This broadcast may be geo-restricted or momentarily offline.
          </p>

          <div className="flex items-center gap-3">
            {autoSkipCountdown !== null && (
              <button
                onClick={handleNextChannel}
                className="py-2.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                Skip to Next Channel ({autoSkipCountdown}s)
              </button>
            )}
            <button
              onClick={() => {
                setStreamError(null);
                setAutoSkipCountdown(null);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Top Glass Bar (Title, AirPlay, Cast, Close) */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-4 transition-opacity duration-300 z-30 pt-safe ${
          controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isChannel && (item as Channel).logo && (
            <img
              src={(item as Channel).logo}
              alt={itemName}
              className="w-9 h-9 object-contain rounded-lg bg-white/5 p-1 border border-white/10 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">{itemName}</h2>
              {isChannel && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 truncate">{itemSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Chromecast / AirPlay */}
          {hasAirplay && (
            <button
              onClick={triggerAirplay}
              title="AirPlay"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <Tv className="w-4 h-4" />
            </button>
          )}

          {/* Picture in Picture */}
          <button
            onClick={togglePiP}
            title="Picture in Picture"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <PictureInPicture2 className="w-4 h-4" />
          </button>

          {/* Close Player */}
          <button
            onClick={onClose}
            title="Close Player (Esc)"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Quick Switchers for Channels (TV & Desktop Remote P+ / P-) */}
      {isChannel && allChannels.length > 1 && (
        <div
          className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={handlePrevChannel}
            title="Previous Channel (Up Arrow)"
            className="w-11 h-11 rounded-2xl liquid-glass text-white hover:text-sky-400 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextChannel}
            title="Next Channel (Down Arrow)"
            className="w-11 h-11 rounded-2xl liquid-glass text-white hover:text-sky-400 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-30 pb-safe ${
          controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left Controls: Play/Pause, Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/30 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl">
              <button onClick={toggleMute} className="text-white hover:text-sky-300 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 accent-sky-400 h-1 rounded-lg cursor-pointer bg-white/20"
              />
            </div>
          </div>

          {/* Right Controls: Quality, Subtitles, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Quality Selector */}
            {levels.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>
                    {selectedLevel === -1
                      ? 'Auto'
                      : `${levels[selectedLevel]?.height || 720}p`}
                  </span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 liquid-glass-elevated rounded-2xl py-1.5 shadow-2xl border border-white/15 z-50">
                    <button
                      onClick={() => handleQualityChange(-1)}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between ${
                        selectedLevel === -1 ? 'text-sky-400 bg-white/10' : 'text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span>Auto</span>
                      {selectedLevel === -1 && <span className="text-[10px]">✓</span>}
                    </button>
                    {levels.map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => handleQualityChange(lvl.id)}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between ${
                          selectedLevel === lvl.id ? 'text-sky-400 bg-white/10' : 'text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <span>{lvl.height}p</span>
                        {selectedLevel === lvl.id && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subtitles Toggle */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              title="Subtitles"
              className={`p-2.5 rounded-xl transition-colors ${
                subtitlesEnabled ? 'bg-sky-500 text-slate-950' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Fullscreen (F)"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
