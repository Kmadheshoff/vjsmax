import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { VideoItem } from '../types/ott';
import { getYoutubeThumb } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface TopTenRailProps {
  videos: VideoItem[];
  onPlay: (video: VideoItem) => void;
}

export function TopTenRail({ videos, onPlay }: TopTenRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -520 : 520;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section
      id="top-ten-section"
      aria-label="Top 10 Videos on VJS Max Today"
      className="mx-auto max-w-[1600px] px-4 py-7 sm:px-8"
    >
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
            Top 10 on VJS Max Today
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
            Most-watched VJ Siddhu Vlogs episodes ranked by views
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll Top 10 left"
            onClick={() => scrollByAmount('left')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll Top 10 right"
            onClick={() => scrollByAmount('right')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto no-scrollbar pb-2"
      >
        {videos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            onClick={() => onPlay(video)}
            className="group relative flex items-end shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
          >
            <span
              className="top-rank-numeral select-none text-[88px] sm:text-[108px] font-extrabold leading-none tracking-tighter -mr-4 z-10 pb-7 transition-all duration-200"
              aria-hidden="true"
            >
              {index + 1}
            </span>

            <div className="w-[238px] sm:w-[260px] flex flex-col">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#FEF6DC] dark:bg-[#1A150C] shadow-sm ring-1 ring-amber-900/5 dark:ring-yellow-400/10 transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-amber-900/15 dark:group-hover:shadow-yellow-500/15">
                <SafeImage
                  src={getYoutubeThumb(video.id)}
                  fallbackSrc={video.fallbackImage}
                  alt={`#${index + 1} ${video.title}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-[#1A1404] shadow-xl">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white">
                  {video.duration}
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-[11px] font-bold text-amber-700 dark:text-yellow-400 truncate">
                  #{index + 1} Today · {video.series}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold text-[#1A1404] dark:text-[#FEF9E7] leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-yellow-300 transition-colors">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                  {video.views} views · {video.published}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
