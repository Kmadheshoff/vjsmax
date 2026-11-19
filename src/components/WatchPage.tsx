import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Heart,
  Maximize2,
  Minimize2,
  Play,
  Plus,
  Share2,
} from 'lucide-react';
import { VideoItem } from '../types/ott';
import {
  getYoutubeEmbedUrl,
  getYoutubeThumb,
  VJ_SIDDHU_LOGO_URL,
} from '../data/catalog';
import { SafeImage } from './SafeImage';
import { VideoCard } from './VideoCard';

interface WatchPageProps {
  video: VideoItem;
  upNextVideos: VideoItem[];
  moreVideos: VideoItem[];
  watchlistIds: string[];
  likedIds: string[];
  onBack: () => void;
  onSelectVideo: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike: (videoId: string) => void;
}

export function WatchPage({
  video,
  upNextVideos,
  moreVideos,
  watchlistIds,
  likedIds,
  onBack,
  onSelectVideo,
  onToggleWatchlist,
  onToggleLike,
}: WatchPageProps) {
  const [copied, setCopied] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCopied(false);
  }, [video.id]);

  const isSaved = watchlistIds.includes(video.id);
  const isLiked = likedIds.includes(video.id);

  const handleCopyShare = async () => {
    const shareUrl = `https://www.youtube.com/watch?v=${video.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-[#0D0B07] pt-14 sm:pt-16 text-[#1A1404] dark:text-[#FEF9E7]">
      {/* Theater Video Stage */}
      <div className="bg-[#FEF7DE] dark:bg-[#14110A] border-b border-amber-200/80 dark:border-yellow-400/15">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2E2208] hover:text-amber-800 dark:text-[#E5D7AE] dark:hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700 dark:text-yellow-400" />
              <span>Back to VJS Max</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-semibold text-amber-700 dark:text-yellow-400">
                {video.series}
              </span>
              <button
                type="button"
                onClick={() => setTheaterMode((prev) => !prev)}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-amber-200 px-3 py-1.5 text-xs font-semibold text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
              >
                {theaterMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Default View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Theater Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Primary Embedded Video Player */}
            <div className={theaterMode ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'}>
              <div
                className={`w-full bg-black ${
                  theaterMode ? 'aspect-[21/9] max-h-[76vh]' : 'aspect-video'
                }`}
              >
                <iframe
                  key={video.id}
                  src={getYoutubeEmbedUrl(video.id, false)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            </div>

            {/* Up Next Queue */}
            {!theaterMode && (
              <aside className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-[#16120B] border-t lg:border-t-0 lg:border-l border-amber-200/75 dark:border-yellow-400/15 px-4 py-4 sm:px-5 lg:max-h-[calc(56.25vw)] lg:overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-sm font-bold text-[#1A1404] dark:text-[#FEF9E7]">
                    Up Next · {video.series}
                  </h2>
                  <span className="text-[11px] font-mono tabular-nums text-[#5C4D24] dark:text-[#B8A77A]">
                    {upNextVideos.length} episodes
                  </span>
                </div>

                <div className="space-y-2.5">
                  {upNextVideos.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectVideo(item)}
                      className="group flex w-full items-start gap-3 rounded-lg p-1.5 text-left hover:bg-amber-50 dark:hover:bg-[#211B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-[#FEF6DC] dark:bg-[#1A150C]">
                        <SafeImage
                          src={getYoutubeThumb(item.id)}
                          fallbackSrc={item.fallbackImage}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-yellow-400 fill-current" />
                        </span>
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 font-mono text-[10px] tabular-nums text-white">
                          {item.duration}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#1A1404] dark:text-[#FEF9E7] leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-yellow-300 transition-colors">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                          {item.views} views · {item.published}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Episode Details & Actions */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 overflow-hidden rounded-full shrink-0 ring-1 ring-amber-300 dark:ring-yellow-400/40 bg-white p-0.5">
                <SafeImage
                  src={VJ_SIDDHU_LOGO_URL}
                  fallbackSrc={video.fallbackImage}
                  alt="VJ Siddhu Max Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                <span className="font-bold text-amber-700 dark:text-yellow-400">VJ Siddhu Vlogs</span>
                <span aria-hidden="true">·</span>
                <span>{video.series}</span>
                <span aria-hidden="true">·</span>
                <span>{video.duration}</span>
                <span aria-hidden="true">·</span>
                <span>{video.views} views</span>
                <span aria-hidden="true">·</span>
                <span>{video.published}</span>
              </div>
            </div>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] leading-snug [text-wrap:balance]">
              {video.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#4A3C18] dark:text-[#D6C79C]">
              {video.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleLike(video.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                isLiked
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleWatchlist(video.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                isSaved
                  ? 'bg-yellow-400 text-[#1A1404] shadow-sm'
                  : 'bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12]'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isSaved ? 'In Watchlist' : 'Watchlist'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-amber-700 dark:text-yellow-400" />
                  <span className="text-amber-800 dark:text-yellow-300">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>YouTube</span>
            </a>
          </div>
        </div>

        {/* More Episodes Grid */}
        <div className="mt-10 pt-8 border-t border-amber-200/80 dark:border-yellow-400/15">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#1A1404] dark:text-[#FEF9E7] mb-5">
            More Like This on VJS Max
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {moreVideos.map((item) => (
              <VideoCard
                key={item.id}
                video={item}
                isSaved={watchlistIds.includes(item.id)}
                isLiked={likedIds.includes(item.id)}
                onPlay={onSelectVideo}
                onToggleWatchlist={onToggleWatchlist}
                onToggleLike={onToggleLike}
                fluid
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
