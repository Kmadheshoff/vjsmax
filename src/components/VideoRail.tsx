import { ReactNode, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoItem } from '../types/ott';
import { VideoCard } from './VideoCard';

interface VideoRailProps {
  id?: string;
  title: string;
  subtitle?: string;
  videos: VideoItem[];
  watchlistIds: string[];
  likedIds?: string[];
  headerAction?: ReactNode;
  onPlay: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike?: (videoId: string) => void;
  onViewAll?: () => void;
}

export function VideoRail({
  id,
  title,
  subtitle,
  videos,
  watchlistIds,
  likedIds = [],
  headerAction,
  onPlay,
  onToggleWatchlist,
  onToggleLike,
  onViewAll,
}: VideoRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (videos.length === 0) return null;

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -580 : 580;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id={id} className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerAction}
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mr-1 text-xs font-bold text-amber-700 hover:text-amber-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors whitespace-nowrap shrink-0"
            >
              Explore All
            </button>
          )}
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollByAmount('left')}
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollByAmount('right')}
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2"
      >
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isSaved={watchlistIds.includes(video.id)}
            isLiked={likedIds.includes(video.id)}
            onPlay={onPlay}
            onToggleWatchlist={onToggleWatchlist}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    </section>
  );
}
