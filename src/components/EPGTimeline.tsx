import React, { useMemo } from 'react';
import { Play, Clock, Sparkles } from 'lucide-react';
import { Channel } from '../types';
import { getEPGSchedule } from '../services/iptv';

interface EPGTimelineProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  selectedChannelId?: string;
}

export const EPGTimeline: React.FC<EPGTimelineProps> = ({
  channels,
  onSelectChannel,
  selectedChannelId,
}) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const minuteProgress = Math.round((currentMinute / 60) * 100);

  // Time headers for next 4 hours
  const timeHeaders = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const h = (currentHour + i) % 24;
      return `${String(h).padStart(2, '0')}:00`;
    });
  }, [currentHour]);

  // Display top 10 channels for EPG guide
  const guideChannels = channels.slice(0, 12);

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-6 border border-white/10 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Live TV Guide (EPG Timeline)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time broadcast schedule with live progress indicator
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Current Time: {String(currentHour).padStart(2, '0')}:{String(currentMinute).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Timeline Grid Container */}
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[760px]">
          {/* Header Row: Channel Column + Hour Columns */}
          <div className="grid grid-cols-[220px_repeat(4,1fr)] gap-2 mb-3 pb-2 border-b border-white/10 text-xs font-semibold text-slate-400">
            <div className="px-2">Channel</div>
            {timeHeaders.map((time, idx) => (
              <div key={time} className="flex items-center gap-1.5 px-2">
                <span>{time}</span>
                {idx === 0 && (
                  <span className="text-[10px] text-sky-400 font-normal">Now Playing</span>
                )}
              </div>
            ))}
          </div>

          {/* Channel Rows */}
          <div className="space-y-2.5">
            {guideChannels.map((channel) => {
              const schedule = getEPGSchedule(channel);
              const isSelected = selectedChannelId === channel.id;

              return (
                <div
                  key={channel.id}
                  className={`grid grid-cols-[220px_repeat(4,1fr)] gap-2 items-center p-1.5 rounded-2xl transition-colors ${
                    isSelected ? 'bg-sky-500/10 border border-sky-400/25' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Channel Info Left Card */}
                  <button
                    onClick={() => onSelectChannel(channel)}
                    className="flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                        {channel.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {channel.category} · {channel.country}
                      </div>
                    </div>
                  </button>

                  {/* Schedule Programs across hours */}
                  {schedule.slice(1, 5).map((prog, pIdx) => {
                    const isNow = pIdx === 0;

                    return (
                      <button
                        key={prog.id}
                        onClick={() => onSelectChannel(channel)}
                        className={`h-14 p-2.5 rounded-xl text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                          isNow
                            ? 'bg-sky-500/15 border border-sky-500/30 text-white shadow-sm'
                            : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-slate-300'
                        }`}
                      >
                        {/* Live progress fill background */}
                        {isNow && (
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-sky-400/10 pointer-events-none transition-all"
                            style={{ width: `${minuteProgress}%` }}
                          />
                        )}

                        <div className="relative z-10 flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold truncate group-hover:text-sky-200">
                            {prog.title}
                          </span>
                          {isNow && (
                            <Play className="w-3 h-3 text-sky-400 shrink-0 fill-sky-400 opacity-80" />
                          )}
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400">
                          <span>
                            {prog.startTime} - {prog.endTime}
                          </span>
                          {isNow && (
                            <span className="text-sky-400 font-mono text-[9px]">
                              {minuteProgress}% elapsed
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
