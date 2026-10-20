import React from 'react';

export const ChannelCardSkeleton: React.FC = () => (
  <div className="liquid-glass rounded-2xl p-4 animate-pulse border border-white/5 space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-3.5 w-14 bg-white/10 rounded-md" />
      <div className="h-3.5 w-10 bg-white/10 rounded-md" />
    </div>
    <div className="aspect-video w-full bg-white/[0.05] rounded-xl" />
    <div className="space-y-1.5 pt-1">
      <div className="h-3.5 w-3/4 bg-white/10 rounded-md" />
      <div className="h-2.5 w-1/2 bg-white/5 rounded-md" />
    </div>
  </div>
);

export const ChannelGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ChannelCardSkeleton key={i} />
    ))}
  </div>
);

export const MovieCardSkeleton: React.FC = () => (
  <div className="w-36 sm:w-44 md:w-48 flex-shrink-0 animate-pulse space-y-2">
    <div className="aspect-[2/3] w-full rounded-2xl bg-white/[0.06] border border-white/5" />
    <div className="h-3.5 w-3/4 bg-white/10 rounded-md" />
    <div className="h-2.5 w-1/2 bg-white/5 rounded-md" />
  </div>
);

export const MovieRowSkeleton: React.FC = () => (
  <div className="space-y-3">
    <div className="h-4 w-36 bg-white/10 rounded-md" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HeroBannerSkeleton: React.FC = () => (
  <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-3xl bg-white/[0.04] border border-white/10 animate-pulse overflow-hidden p-6 sm:p-12 flex flex-col justify-end">
    <div className="space-y-3 max-w-md">
      <div className="h-4 w-28 bg-white/15 rounded-md" />
      <div className="h-8 w-72 bg-white/20 rounded-lg" />
      <div className="h-4 w-full bg-white/10 rounded-md" />
      <div className="flex gap-3 pt-2">
        <div className="h-11 w-32 bg-white/25 rounded-xl" />
        <div className="h-11 w-32 bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);
