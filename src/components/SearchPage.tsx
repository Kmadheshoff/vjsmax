import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Moon,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import {
  CategoryKey,
  DurationFilter,
  SortOption,
  VideoItem,
} from '../types/ott';
import { getYoutubeThumb, SERIES_LIST } from '../data/catalog';
import { SafeImage } from './SafeImage';
import { VideoCard } from './VideoCard';

interface SearchPageProps {
  videos: VideoItem[];
  watchlistIds: string[];
  likedIds: string[];
  theme: 'light' | 'dark';
  initialQuery?: string;
  onBackHome: () => void;
  onPlayVideo: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike: (videoId: string) => void;
  onToggleTheme: () => void;
}

const TRENDING_TERMS = [
  'Egypt',
  'Mottamaadi Party',
  'Virundhu',
  '6M',
  'தெற்கு சீமை',
  'Goa',
  'Singapore',
  'Vietnam',
  'Thailand',
  'Hyderabad',
];

const CATEGORY_TABS: Array<{ id: CategoryKey | 'liked'; label: string }> = [
  { id: 'all', label: 'All Videos' },
  { id: 'vlogs', label: 'Vlogs' },
  { id: 'mottamaadi', label: 'Mottamaadi Party' },
  { id: 'virundhu', label: 'VJ Siddhu Virundhu' },
  { id: 'travel', label: 'Travel Series' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'liked', label: 'Liked' },
];

const PAGE_SIZE = 24;

export function SearchPage({
  videos,
  watchlistIds,
  likedIds,
  theme,
  initialQuery = '',
  onBackHome,
  onPlayVideo,
  onToggleWatchlist,
  onToggleLike,
  onToggleTheme,
}: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryKey | 'liked'>('all');
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category, selectedSeries, durationFilter, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey | 'liked', number> = {
      all: videos.length,
      vlogs: 0,
      mottamaadi: 0,
      virundhu: 0,
      travel: 0,
      watchlist: watchlistIds.length,
      liked: likedIds.length,
    };
    videos.forEach((v) => {
      if (v.category in counts) {
        counts[v.category] += 1;
      }
    });
    return counts;
  }, [videos, watchlistIds.length, likedIds.length]);

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = videos.filter((video) => {
      if (category === 'watchlist') {
        if (!watchlistIds.includes(video.id)) return false;
      } else if (category === 'liked') {
        if (!likedIds.includes(video.id)) return false;
      } else if (category !== 'all' && video.category !== category) {
        return false;
      }

      if (selectedSeries !== 'All Series' && video.series !== selectedSeries) {
        return false;
      }

      if (durationFilter === 'short' && video.durationMinutes >= 20) return false;
      if (durationFilter === 'feature' && video.durationMinutes < 20) return false;

      if (q) {
        const hay = `${video.title} ${video.series} ${video.description} ${video.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'views') {
      return [...list].sort((a, b) => b.viewsCount - a.viewsCount);
    }
    if (sortBy === 'latest') {
      return [...list].sort((a, b) => b.recencyScore - a.recencyScore);
    }
    return list;
  }, [videos, query, category, selectedSeries, durationFilter, sortBy, watchlistIds, likedIds]);

  const isActiveSearch =
    query.trim().length > 0 ||
    category !== 'all' ||
    selectedSeries !== 'All Series' ||
    durationFilter !== 'all';

  const resetAll = () => {
    setQuery('');
    setCategory('all');
    setSelectedSeries('All Series');
    setDurationFilter('all');
    setSortBy('latest');
    inputRef.current?.focus();
  };

  const topMatch = query.trim().length > 0 && filteredVideos.length > 0 ? filteredVideos[0] : null;
  const gridSource = topMatch ? filteredVideos.slice(1) : filteredVideos;
  const displayedVideos = gridSource.slice(0, visibleCount);

  return (
    <section
      aria-label="Search VJS Max Catalog"
      className="min-h-[85vh] bg-[#FFFDF7] dark:bg-[#0D0B07]"
    >
      {/* Atmospheric Spotlight Search Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FEF4D4] via-[#FEF9E8] to-[#FFFDF7] dark:from-[#1B160B] dark:via-[#120F09] dark:to-[#0D0B07] px-4 pt-20 pb-7 sm:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.3),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.16),transparent_70%)] blur-2xl" />

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
              {filteredVideos.length} of {videos.length} episodes
            </span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] [text-wrap:balance]">
              Search VJS Max
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
              Find episodes across {videos.length}+ VJ Siddhu Vlogs, Mottamaadi Party, Virundhu &amp; global travel series
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative mt-6 group">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 dark:text-yellow-400 transition-colors group-focus-within:text-amber-700 dark:group-focus-within:text-yellow-300" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (query) {
                      setQuery('');
                    } else {
                      onBackHome();
                    }
                  }
                }}
                placeholder="Search titles, series, guests, or destinations..."
                aria-label="Search episodes"
                className="w-full rounded-2xl bg-white py-4 pl-12 pr-24 text-sm sm:text-base text-[#1A1404] placeholder:text-[#8A7542] ring-1 ring-amber-200 shadow-[0_14px_38px_-14px_rgba(202,138,4,0.22)] focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-[#1A150C] dark:text-[#FEF9E7] dark:placeholder:text-[#8E7D54] dark:ring-yellow-400/20 dark:shadow-[0_14px_38px_-14px_rgba(0,0,0,0.6)] transition-shadow"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF6DC] text-[#2E2208] hover:bg-yellow-400 dark:bg-[#261F12] dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Popular Quick Searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {TRENDING_TERMS.map((term) => {
                const selected = query.toLowerCase() === term.toLowerCase();
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(selected ? '' : term)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      selected
                        ? 'bg-yellow-400 text-[#1A1404] font-bold shadow-md shadow-yellow-500/20'
                        : 'bg-white ring-1 ring-amber-200/80 text-[#3E2F0A] hover:bg-amber-50 hover:text-amber-900 dark:bg-[#1A150C] dark:ring-yellow-400/15 dark:text-[#D6C79C] dark:hover:bg-[#261F12] dark:hover:text-yellow-300'
                    }`}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Tabs & Unified Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-amber-200/80 dark:border-yellow-400/15">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {CATEGORY_TABS.map((tab) => {
                const active = category === tab.id;
                const count = categoryCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-yellow-400 text-[#1A1404] font-bold shadow-md shadow-yellow-500/20'
                        : 'bg-white ring-1 ring-amber-200/80 text-[#3E2F0A] hover:bg-amber-50 hover:text-amber-900 dark:bg-[#1A150C] dark:ring-yellow-400/15 dark:text-[#D6C79C] dark:hover:bg-[#261F12] dark:hover:text-yellow-300'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 font-mono tabular-nums text-[11px] opacity-80">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="rounded-lg bg-white ring-1 ring-amber-200/80 dark:bg-[#1A150C] dark:ring-yellow-400/20 px-3 py-1.5">
                <label htmlFor="series-filter-select" className="sr-only">
                  Filter by series
                </label>
                <select
                  id="series-filter-select"
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#1A1404] dark:text-[#FEF9E7] focus:outline-none cursor-pointer"
                >
                  {SERIES_LIST.map((s) => (
                    <option key={s} value={s} className="bg-white text-[#1A1404] dark:bg-[#1A150C] dark:text-[#FEF9E7]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-white ring-1 ring-amber-200/80 dark:bg-[#1A150C] dark:ring-yellow-400/20 p-1">
                {(
                  [
                    { id: 'all', label: 'All Lengths' },
                    { id: 'short', label: 'Under 20m' },
                    { id: 'feature', label: '20m+' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDurationFilter(opt.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      durationFilter === opt.id
                        ? 'bg-yellow-400 text-[#1A1404] font-bold'
                        : 'text-[#5C4D24] hover:text-[#1A1404] dark:text-[#B8A77A] dark:hover:text-[#FEF9E7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-white ring-1 ring-amber-200/80 dark:bg-[#1A150C] dark:ring-yellow-400/20 px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700 dark:text-yellow-400 shrink-0" />
                <label htmlFor="search-page-sort" className="sr-only">
                  Sort search results
                </label>
                <select
                  id="search-page-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-medium text-[#1A1404] dark:text-[#FEF9E7] focus:outline-none cursor-pointer"
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
            </div>
          </div>
        </div>
      </div>

      {/* Results Body */}
      <div className="mx-auto max-w-[1600px] px-4 pb-14 sm:px-8">
        {/* Top Match Spotlight Banner when searching */}
        {topMatch && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-white ring-1 ring-amber-200/80 shadow-lg shadow-amber-900/5 dark:bg-[#16120B] dark:ring-yellow-400/15 dark:shadow-black/40 p-4 sm:p-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <button
                type="button"
                onClick={() => onPlayVideo(topMatch)}
                className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#FEF6DC] dark:bg-[#1A150C] lg:col-span-5 group"
              >
                <SafeImage
                  src={getYoutubeThumb(topMatch.id)}
                  fallbackSrc={topMatch.fallbackImage}
                  alt={topMatch.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-[#1A1404] shadow-xl transition-transform duration-200 group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-white">
                  {topMatch.duration}
                </span>
              </button>

              <div className="lg:col-span-7 min-w-0">
                <p className="text-xs font-bold tracking-wide text-amber-700 dark:text-yellow-400">
                  Top Match · {topMatch.series}
                </p>
                <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] [text-wrap:balance]">
                  {topMatch.title}
                </h2>
                <p className="mt-2 text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums">
                  {topMatch.views} views · {topMatch.published} · HD
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#4A3C18] dark:text-[#D6C79C] line-clamp-2 max-w-2xl">
                  {topMatch.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onPlayVideo(topMatch)}
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-500/20"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(topMatch.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                      watchlistIds.includes(topMatch.id)
                        ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 dark:bg-yellow-400/20 dark:text-yellow-300 dark:ring-yellow-400/40'
                        : 'bg-[#FEF8E6] text-[#2E2208] hover:bg-amber-100 dark:bg-[#211B10] dark:text-[#FEF9E7] dark:hover:bg-[#2C2415]'
                    }`}
                  >
                    {watchlistIds.includes(topMatch.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{watchlistIds.includes(topMatch.id) ? 'In Watchlist' : 'Watchlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredVideos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-lg font-bold text-[#1A1404] dark:text-[#FEF9E7]">
              No matching videos found
            </p>
            <p className="mt-1.5 text-sm text-[#5C4D24] dark:text-[#B8A77A]">
              Try searching for Mottamaadi, Virundhu, Egypt, Goa, or reset your active filters.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-lg bg-yellow-400 px-5 py-2.5 text-xs font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors"
              >
                Show All Videos
              </button>
              {category === 'watchlist' && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="group inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-amber-200 px-4 py-2 text-xs font-bold text-[#1A1404] hover:bg-yellow-400 dark:bg-[#1A150C] dark:ring-yellow-400/25 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-yellow-400 group-hover:text-[#1A1404]" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-amber-700 group-hover:text-[#1A1404]" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          gridSource.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <h2 className="font-display text-xl font-bold text-[#1A1404] dark:text-[#FEF9E7]">
                  {category === 'watchlist'
                    ? 'Your Watchlist'
                    : query.trim()
                    ? `More Results for "${query.trim()}"`
                    : isActiveSearch
                    ? 'Filtered Episodes'
                    : 'Recommended & Latest Videos'}
                </h2>
                <div className="flex items-center gap-3">
                  {category === 'watchlist' && (
                    <button
                      type="button"
                      onClick={onToggleTheme}
                      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                      aria-pressed={theme === 'dark'}
                      className="group inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-amber-200 px-3.5 py-1.5 text-xs font-bold text-[#1A1404] hover:bg-yellow-400 dark:bg-[#1A150C] dark:ring-yellow-400/25 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors whitespace-nowrap shrink-0"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-yellow-400 group-hover:text-[#1A1404]" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-amber-700 group-hover:text-[#1A1404]" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  )}
                  {isActiveSearch && (
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                    >
                      Reset Search
                    </button>
                  )}
                </div>
              </div>

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

              {visibleCount < gridSource.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="rounded-lg bg-white ring-1 ring-amber-200 px-6 py-3 text-sm font-semibold text-amber-800 hover:bg-yellow-400 hover:text-[#1A1404] dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
                  >
                    Load More ({gridSource.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
}
