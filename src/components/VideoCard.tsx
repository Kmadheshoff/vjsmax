import { Check, Heart, Play, Plus } from 'lucide-react';
import { VideoItem } from '../types/ott';
import { getYoutubeThumb } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface VideoCardProps {
  video: VideoItem;
  isSaved: boolean;
  isLiked?: boolean;
  onPlay: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike?: (videoId: string) => void;
  fluid?: boolean;
}

export function VideoCard({
  video,
  isSaved,
  isLiked = false,
  onPlay,
  onToggleWatchlist,
  onToggleLike,
  fluid = false,
}: VideoCardProps) {
  return (
    <article
      className={`group flex flex-col ${
        fluid ? 'w-full' : 'w-[264px] sm:w-[296px] shrink-0'
      }`}
    >
      {/* Borderless Poster Card */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#FEF6DC] dark:bg-[#1A150C] shadow-sm ring-1 ring-amber-900/5 dark:ring-yellow-400/10 transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-[0_18px_38px_-14px_rgba(202,138,4,0.34)] dark:group-hover:shadow-[0_18px_38px_-14px_rgba(250,204,21,0.18)]">
        <button
          type="button"
          onClick={() => onPlay(video)}
          aria-label={`Play ${video.title}`}
          className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <SafeImage
            src={getYoutubeThumb(video.id)}
            fallbackSrc={video.fallbackImage}
            alt={video.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-[#1A1404] shadow-xl">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        {/* Top-Left Fresh Release Tag if New */}
        {video.isNew && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#1A1404] shadow">
            New
          </span>
        )}

        {/* Top-Right Quick Actions */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onToggleLike && (
            <button
              type="button"
              aria-label={isLiked ? 'Unlike episode' : 'Like episode'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(video.id);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isLiked
                  ? 'bg-rose-600 text-white opacity-100'
                  : 'bg-white/95 text-[#1A1404] dark:bg-[#17130B]/90 dark:text-[#FEF9E7] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-rose-600 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            type="button"
            aria-label={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(video.id);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isSaved
                ? 'bg-yellow-400 text-[#1A1404] opacity-100'
                : 'bg-white/95 text-[#1A1404] dark:bg-[#17130B]/90 dark:text-[#FEF9E7] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-yellow-400 hover:text-[#1A1404]'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-white">
          {video.duration}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onPlay(video)}
        className="mt-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
      >
        <p className="text-[11px] font-bold text-amber-700 dark:text-yellow-400 truncate">
          {video.series}
        </p>
        <h3 className="mt-0.5 text-sm font-semibold text-[#1A1404] dark:text-[#FEF9E7] leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-yellow-300 transition-colors">
          {video.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
          <span>{video.views} views</span>
          <span aria-hidden="true">·</span>
          <span>{video.published}</span>
        </div>
      </button>
    </article>
  );
}
