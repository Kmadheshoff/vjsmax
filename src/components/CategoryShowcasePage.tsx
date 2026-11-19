import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Play, Plus, SlidersHorizontal } from 'lucide-react';
import { SortOption, VideoItem } from '../types/ott';
import { getYoutubeThumb, VJ_SIDDHU_LOGO_URL } from '../data/catalog';
import { SafeImage } from './SafeImage';
import { VideoCard } from './VideoCard';

interface CategoryShowcasePageProps {
  page: 'vlogs' | 'mottamaadi' | 'virundhu' | 'top10';
  videos: VideoItem[];
  watchlistIds: string[];
  likedIds: string[];
  onBackHome: () => void;
  onPlayVideo: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike: (videoId: string) => void;
}

const PAGE_META: Record<
  'vlogs' | 'mottamaadi' | 'virundhu' | 'top10',
  { title: string; subtitle: string }
> = {
  vlogs: {
    title: 'Vlogs',
    subtitle: 'Signature Tamil storytelling, Therkku Seemai, Bachelor Kitchen & travel diaries',
  },
  mottamaadi: {
    title: 'Mottamaadi Party Originals',
    subtitle: 'Unfiltered Chennai terrace sessions, celebrity guests & nonstop banter',
  },
  virundhu: {
    title: 'VJ Siddhu Virundhu',
    subtitle: '6M Special, Kovai Virundhu & Malaysia Virundhu grand feast celebrations',
  },
  top10: {
    title: 'Top 10 on VJS Max Today',
    subtitle: 'Most-watched VJ Siddhu Vlogs episodes ranked by viewer demand',
  },
};

const PAGE_SIZE = 24;

export function CategoryShowcasePage({
  page,
  videos,
  watchlistIds,
  likedIds,
  onBackHome,
  onPlayVideo,
  onToggleWatchlist,
  onToggleLike,
}: CategoryShowcasePageProps) {
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setSelectedSeries('All Series');
    setSortBy(page === 'top10' ? 'views' : 'latest');
    setVisibleCount(PAGE_SIZE);
  }, [page]);

  const seriesOptions = useMemo(() => {
    if (page === 'top10') return [];
    const set = new Set(videos.map((v) => v.series));
    return ['All Series', ...Array.from(set)];
  }, [page, videos]);

  const processedVideos = useMemo(() => {
    if (page === 'top10') {
      return videos.slice(0, 10);
    }

    const filtered =
      selectedSeries === 'All Series'
        ? videos
        : videos.filter((v) => v.series === selectedSeries);

    if (sortBy === 'views') {
      return [...filtered].sort((a, b) => b.viewsCount - a.viewsCount);
    }
    if (sortBy === 'latest') {
      return [...filtered].sort((a, b) => b.recencyScore - a.recencyScore);
    }
    return filtered;
  }, [page, videos, selectedSeries, sortBy]);

  const meta = PAGE_META[page];
  const spotlight = processedVideos[0];
  const gridVideos = page === 'top10' ? processedVideos : processedVideos.slice(0, visibleCount);

  return (
    <section
      aria-label={meta.title}
      className="min-h-[85vh] bg-[#FFFDF7] dark:bg-[#0D0B07]"
    >
      {/* Dedicated Page Header */}
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

            <span className="text-xs font-mono tabular-nums text-[#5C4D24] dark:text-[#B8A77A]">
              {processedVideos.length} {processedVideos.length === 1 ? 'episode' : 'episodes'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 p-[2.5px] shrink-0 shadow-md">
                <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-[#17130B]">
                  <SafeImage
                    src={VJ_SIDDHU_LOGO_URL}
                    fallbackSrc={spotlight?.fallbackImage}
                    alt="VJ Siddhu Vlogs"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] [text-wrap:balance]">
                  {meta.title}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            {page !== 'top10' && (
              <div className="flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200/80 dark:bg-[#1A150C] dark:ring-yellow-400/20 px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700 dark:text-yellow-400 shrink-0" />
                <label htmlFor="category-page-sort" className="sr-only">
                  Sort episodes
                </label>
                <select
                  id="category-page-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-semibold text-[#1A1404] dark:text-[#FEF9E7] focus:outline-none cursor-pointer"
                >
                  <option value="latest" className="bg-white text-[#1A1404] dark:bg-[#1A150C] dark:text-[#FEF9E7]">
                    Sort: Latest First
                  </option>
                  <option value="views" className="bg-white text-[#1A1404] dark:bg-[#1A150C] dark:text-[#FEF9E7]">
                    Sort: Most Viewed
                  </option>
                  <option value="trending" className="bg-white text-[#1A1404] dark:bg-[#1A150C] dark:text-[#FEF9E7]">
                    Sort: Channel Order
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Series Filter Row when multiple series exist */}
          {seriesOptions.length > 2 && (
            <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {seriesOptions.map((series) => (
                <button
                  key={series}
                  type="button"
                  onClick={() => {
                    setSelectedSeries(series);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    selectedSeries === series
                      ? 'bg-yellow-400 text-[#1A1404] font-bold shadow-sm'
                      : 'bg-white ring-1 ring-amber-200/80 text-[#3E2F0A] hover:bg-amber-50 hover:text-amber-900 dark:bg-[#1A150C] dark:ring-yellow-400/15 dark:text-[#D6C79C] dark:hover:bg-[#261F12] dark:hover:text-yellow-300'
                  }`}
                >
                  {series}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-8">
        {/* Featured Episode Spotlight */}
        {spotlight && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-white ring-1 ring-amber-200/80 shadow-lg shadow-amber-900/5 dark:bg-[#16120B] dark:ring-yellow-400/15 dark:shadow-black/40 p-4 sm:p-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <button
                type="button"
                onClick={() => onPlayVideo(spotlight)}
                className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#FEF6DC] dark:bg-[#1A150C] lg:col-span-5 group"
              >
                <SafeImage
                  src={getYoutubeThumb(spotlight.id)}
                  fallbackSrc={spotlight.fallbackImage}
                  alt={spotlight.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-[#1A1404] shadow-xl transition-transform duration-200 group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-white">
                  {spotlight.duration}
                </span>
              </button>

              <div className="lg:col-span-7 min-w-0">
                <p className="text-xs font-bold tracking-wide text-amber-700 dark:text-yellow-400">
                  {page === 'top10' ? '#1 Most Viewed · ' : 'Featured · '}
                  {spotlight.series}
                </p>
                <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] [text-wrap:balance]">
                  {spotlight.title}
                </h2>
                <p className="mt-2 text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                  {spotlight.views} views · {spotlight.published} · HD
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#4A3C18] dark:text-[#D6C79C] line-clamp-2 max-w-2xl">
                  {spotlight.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onPlayVideo(spotlight)}
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-500/20"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(spotlight.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                      watchlistIds.includes(spotlight.id)
                        ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 dark:bg-yellow-400/20 dark:text-yellow-300 dark:ring-yellow-400/40'
                        : 'bg-[#FEF8E6] text-[#2E2208] hover:bg-amber-100 dark:bg-[#211B10] dark:text-[#FEF9E7] dark:hover:bg-[#2C2415]'
                    }`}
                  >
                    {watchlistIds.includes(spotlight.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>
                      {watchlistIds.includes(spotlight.id) ? 'In Watchlist' : 'Watchlist'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ranked Top 10 List OR Category Episode Grid */}
        {page === 'top10' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gridVideos.map((video, idx) => {
              const isSaved = watchlistIds.includes(video.id);
              return (
                <div
                  key={video.id}
                  className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-white ring-1 ring-amber-200/80 p-3.5 sm:p-4 hover:shadow-lg hover:shadow-amber-900/10 dark:bg-[#16120B] dark:ring-yellow-400/15 dark:hover:shadow-black/50 transition-all"
                >
                  <span
                    className="top-rank-numeral select-none text-[56px] sm:text-[72px] font-extrabold leading-none tracking-tighter w-14 sm:w-16 text-center shrink-0"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => onPlayVideo(video)}
                    className="relative aspect-video w-36 sm:w-44 shrink-0 overflow-hidden rounded-lg bg-[#FEF6DC] dark:bg-[#1A150C]"
                  >
                    <SafeImage
                      src={getYoutubeThumb(video.id)}
                      fallbackSrc={video.fallbackImage}
                      alt={`#${idx + 1} ${video.title}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-white">
                      {video.duration}
                    </span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-yellow-400 truncate">
                      #{idx + 1} Today · {video.series}
                    </p>
                    <button
                      type="button"
                      onClick={() => onPlayVideo(video)}
                      className="mt-0.5 text-left"
                    >
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1404] dark:text-[#FEF9E7] leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-yellow-300 transition-colors">
                        {video.title}
                      </h3>
                    </button>
                    <p className="mt-1 text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                      {video.views} views · {video.published}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPlayVideo(video)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-yellow-400 px-3 py-1 text-xs font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWatchlist(video.id)}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                          isSaved
                            ? 'bg-amber-100 text-amber-900 dark:bg-yellow-400/20 dark:text-yellow-300'
                            : 'bg-[#FEF6DC] text-[#2E2208] hover:bg-amber-100 dark:bg-[#211B10] dark:text-[#D6C79C] dark:hover:bg-[#2C2415]'
                        }`}
                      >
                        {isSaved ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{isSaved ? 'Saved' : 'Watchlist'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {gridVideos.map((video) => (
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

            {visibleCount < processedVideos.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="rounded-lg bg-white ring-1 ring-amber-200 px-6 py-3 text-sm font-semibold text-amber-800 hover:bg-yellow-400 hover:text-[#1A1404] dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
                >
                  Load More ({processedVideos.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
