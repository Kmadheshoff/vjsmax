import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, Heart, Moon, Play, Sun } from 'lucide-react';
import { VideoItem } from '../types/ott';
import { VideoCard } from './VideoCard';
import { PWAInstallButton } from './PWAInstallButton';

interface WatchlistPageProps {
  watchlistVideos: VideoItem[];
  likedVideos: VideoItem[];
  watchlistIds: string[];
  likedIds: string[];
  theme: 'light' | 'dark';
  onBackHome: () => void;
  onExploreSearch: () => void;
  onPlayVideo: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike: (videoId: string) => void;
  onToggleTheme: () => void;
}

export function WatchlistPage({
  watchlistVideos,
  likedVideos,
  watchlistIds,
  likedIds,
  theme,
  onBackHome,
  onExploreSearch,
  onPlayVideo,
  onToggleWatchlist,
  onToggleLike,
  onToggleTheme,
}: WatchlistPageProps) {
  const [activeTab, setActiveTab] = useState<'saved' | 'liked'>('saved');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const displayedVideos = activeTab === 'saved' ? watchlistVideos : likedVideos;

  return (
    <section
      aria-label="Watchlist Page"
      className="min-h-[85vh] bg-[#FFFDF7] dark:bg-[#0D0B07]"
    >
      {/* Warm Yellow Spotlight Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FEF4D4] via-[#FEF9E8] to-[#FFFDF7] dark:from-[#1B160B] dark:via-[#120F09] dark:to-[#0D0B07] px-4 pt-20 pb-7 sm:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.28),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.16),transparent_70%)] blur-2xl" />

        <div className="relative mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={onBackHome}
              className="group inline-flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#2E2208] hover:bg-yellow-400 hover:text-[#1A1404] dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700 dark:text-yellow-400 group-hover:text-[#1A1404] transition-colors" />
              <span>Back to Home</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <PWAInstallButton variant="subtle" />

              {/* Dark / Light Mode Toggle Button on Watchlist */}
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-pressed={theme === 'dark'}
                className="group inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-amber-200 px-4 py-2 text-xs sm:text-sm font-bold text-[#1A1404] hover:bg-yellow-400 dark:bg-[#1A150C] dark:ring-yellow-400/25 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-sm"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-yellow-400 group-hover:text-[#1A1404] transition-colors" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-amber-700 group-hover:text-[#1A1404] transition-colors" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] [text-wrap:balance]">
                My Watchlist
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
                Saved episodes and favorites ready to stream anytime on VJS Max
              </p>
            </div>

            {/* Watchlist / Liked Segmented Control */}
            <div className="inline-flex items-center gap-1 rounded-xl bg-white ring-1 ring-amber-200/90 dark:bg-[#1A150C] dark:ring-yellow-400/20 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-yellow-400 text-[#1A1404] shadow-sm'
                    : 'text-[#5C4D24] hover:text-[#1A1404] dark:text-[#D6C79C] dark:hover:text-yellow-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'saved' ? 'fill-current' : ''}`} />
                <span>Saved</span>
                <span className="font-mono tabular-nums text-[11px] opacity-80">
                  {watchlistVideos.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('liked')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === 'liked'
                    ? 'bg-yellow-400 text-[#1A1404] shadow-sm'
                    : 'text-[#5C4D24] hover:text-[#1A1404] dark:text-[#D6C79C] dark:hover:text-yellow-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === 'liked' ? 'fill-current' : ''}`} />
                <span>Liked</span>
                <span className="font-mono tabular-nums text-[11px] opacity-80">
                  {likedVideos.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Content Grid */}
      <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-8">
        {displayedVideos.length === 0 ? (
          <div className="rounded-2xl bg-white ring-1 ring-amber-200/80 dark:bg-[#16120B] dark:ring-yellow-400/15 px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20 text-amber-700 dark:text-yellow-400">
              {activeTab === 'saved' ? (
                <Bookmark className="w-5 h-5" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </div>
            <h2 className="mt-4 font-display text-lg sm:text-xl font-bold text-[#1A1404] dark:text-[#FEF9E7]">
              {activeTab === 'saved'
                ? 'Your Watchlist is empty'
                : 'No liked episodes yet'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A] max-w-md mx-auto">
              {activeTab === 'saved'
                ? 'Tap the + icon on any episode across VJS Max to save it here for quick playback.'
                : 'Tap the heart icon on episodes you enjoy to build your favorites list.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Browse Home</span>
              </button>
              <button
                type="button"
                onClick={onExploreSearch}
                className="inline-flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1A1404] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
              >
                <span>Search Episodes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isSaved={watchlistIds.includes(video.id)}
                isLiked={likedIds.includes(video.id)}
                onPlay={onPlayVideo}
                onToggleWatchlist={onToggleWatchlist}
                onToggleLike={onToggleLike}
                fluid
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
