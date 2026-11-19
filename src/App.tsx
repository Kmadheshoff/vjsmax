import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  buildCategoryCircles,
  buildHeroSlides,
  INITIAL_VIDEOS,
  normalizeYouTubeVideo,
  RawYouTubeRecord,
  SERIES_LIST,
} from './data/catalog';
import { CategoryKey, PageKey, VideoItem } from './types/ott';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroAutoSlider } from './components/HeroAutoSlider';
import { CircleCategories } from './components/CircleCategories';
import { TopTenRail } from './components/TopTenRail';
import { VideoRail } from './components/VideoRail';
import { VideoCard } from './components/VideoCard';
import { SearchPage } from './components/SearchPage';
import { WatchlistPage } from './components/WatchlistPage';
import { CategoryShowcasePage } from './components/CategoryShowcasePage';
import { WatchPage } from './components/WatchPage';
import { SplashScreen } from './components/SplashScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const WATCHLIST_STORAGE_KEY = 'vjs_max_watchlist_v1';
const HISTORY_STORAGE_KEY = 'vjs_max_history_v1';
const LIKES_STORAGE_KEY = 'vjs_max_likes_v1';
const THEME_STORAGE_KEY = 'vjs_max_theme_v1';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [newUploadsCount, setNewUploadsCount] = useState(0);

  const [activePage, setActivePage] = useState<PageKey>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [archiveSeries, setArchiveSeries] = useState('All Series');
  const [archiveVisible, setArchiveVisible] = useState(24);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['wzrs19aEmPQ', 'LAyKxmIsYZE'];
    } catch {
      return ['wzrs19aEmPQ', 'LAyKxmIsYZE'];
    }
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [watchlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [likedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [historyIds]);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage quota errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Automatic YouTube Live Fetch for New Uploads every 5 seconds
  const syncLiveYouTubeVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos');
      if (!res.ok) return;
      const data = (await res.json()) as { videos?: RawYouTubeRecord[] };
      const liveList = data.videos || [];
      if (liveList.length === 0) return;

      setVideos((prev) => {
        const existingMap = new Map(prev.map((v) => [v.id, v]));
        const freshNew: VideoItem[] = [];

        liveList.forEach((raw, idx) => {
          const existing = existingMap.get(raw.id);
          if (!existing) {
            freshNew.push(normalizeYouTubeVideo({ ...raw, isNew: true }, idx));
          } else {
            const normalized = normalizeYouTubeVideo(raw, idx);
            existingMap.set(raw.id, {
              ...existing,
              views: normalized.views || existing.views,
              viewsCount: Math.max(existing.viewsCount, normalized.viewsCount),
              published: normalized.published || existing.published,
            });
          }
        });

        if (freshNew.length > 0) {
          setNewUploadsCount((c) => c + freshNew.length);
        }

        const updatedRest = prev.map((v) => existingMap.get(v.id) ?? v);
        return [...freshNew, ...updatedRest];
      });
    } catch {
      // Keep current catalog silently if offline
    }
  }, []);

  useEffect(() => {
    syncLiveYouTubeVideos();
    const interval = window.setInterval(() => {
      syncLiveYouTubeVideos();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [syncLiveYouTubeVideos]);

  const handleToggleWatchlist = (videoId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [videoId, ...prev]
    );
  };

  const handleToggleLike = (videoId: string) => {
    setLikedIds((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [videoId, ...prev]
    );
  };

  const handlePlayVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setActivePage('watch');
    setHistoryIds((prev) =>
      [video.id, ...prev.filter((id) => id !== video.id)].slice(0, 12)
    );
  };

  const openSearchPage = (initialQuery = '') => {
    setSearchInitialQuery(initialQuery);
    setActivePage('search');
    window.scrollTo({ top: 0 });
  };

  const handleSelectNav = (target: PageKey) => {
    if (target === 'search') {
      openSearchPage('');
      return;
    }

    if (target === 'home') {
      setSelectedCategory('all');
    }

    setActivePage(target);
    window.scrollTo({ top: 0 });
  };

  const heroSlides = useMemo(() => buildHeroSlides(videos), [videos]);
  const categoryCircles = useMemo(() => buildCategoryCircles(videos), [videos]);
  const topTenVideos = useMemo(
    () => [...videos].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 10),
    [videos]
  );

  const latestVideos = useMemo(() => videos.slice(0, 16), [videos]);

  const continueWatchingVideos = useMemo(
    () =>
      historyIds
        .map((id) => videos.find((v) => v.id === id))
        .filter((v): v is VideoItem => Boolean(v)),
    [historyIds, videos]
  );

  const watchlistVideos = useMemo(
    () =>
      watchlistIds
        .map((id) => videos.find((v) => v.id === id))
        .filter((v): v is VideoItem => Boolean(v)),
    [watchlistIds, videos]
  );

  const likedVideos = useMemo(
    () =>
      likedIds
        .map((id) => videos.find((v) => v.id === id))
        .filter((v): v is VideoItem => Boolean(v)),
    [likedIds, videos]
  );

  const mottamaadiVideos = useMemo(
    () => videos.filter((v) => v.category === 'mottamaadi'),
    [videos]
  );
  const virundhuVideos = useMemo(
    () => videos.filter((v) => v.category === 'virundhu'),
    [videos]
  );
  const travelVideos = useMemo(
    () => videos.filter((v) => v.category === 'travel'),
    [videos]
  );
  const vlogVideos = useMemo(
    () => videos.filter((v) => v.category === 'vlogs'),
    [videos]
  );

  const archiveFiltered = useMemo(() => {
    if (archiveSeries === 'All Series') return videos;
    return videos.filter((v) => v.series === archiveSeries);
  }, [videos, archiveSeries]);

  const upNextVideos = useMemo(() => {
    if (!activeVideo) return [];
    const sameSeries = videos.filter(
      (v) => v.id !== activeVideo.id && v.series === activeVideo.series
    );
    const sameCategory = videos.filter(
      (v) =>
        v.id !== activeVideo.id &&
        v.series !== activeVideo.series &&
        v.category === activeVideo.category
    );
    const others = videos.filter(
      (v) => v.id !== activeVideo.id && v.category !== activeVideo.category
    );
    return [...sameSeries, ...sameCategory, ...others].slice(0, 10);
  }, [activeVideo, videos]);

  const moreVideos = useMemo(() => {
    if (!activeVideo) return [];
    const upNextIds = new Set(upNextVideos.map((v) => v.id));
    return videos
      .filter((v) => v.id !== activeVideo.id && !upNextIds.has(v.id))
      .slice(0, 8);
  }, [activeVideo, upNextVideos, videos]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A1404] dark:bg-[#0D0B07] dark:text-[#FEF9E7] transition-colors duration-200">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <Navbar
        activePage={activePage}
        onSelectNav={handleSelectNav}
      />

      {activePage === 'watch' && activeVideo ? (
        <main>
          <WatchPage
            video={activeVideo}
            upNextVideos={upNextVideos}
            moreVideos={moreVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onBack={() => handleSelectNav('home')}
            onSelectVideo={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
          />
        </main>
      ) : activePage === 'search' ? (
        <main>
          <SearchPage
            videos={videos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            theme={theme}
            initialQuery={searchInitialQuery}
            onBackHome={() => handleSelectNav('home')}
            onPlayVideo={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onToggleTheme={handleToggleTheme}
          />
        </main>
      ) : activePage === 'watchlist' ? (
        <main>
          <WatchlistPage
            watchlistVideos={watchlistVideos}
            likedVideos={likedVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            theme={theme}
            onBackHome={() => handleSelectNav('home')}
            onExploreSearch={() => handleSelectNav('search')}
            onPlayVideo={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onToggleTheme={handleToggleTheme}
          />
        </main>
      ) : activePage === 'vlogs' ||
        activePage === 'mottamaadi' ||
        activePage === 'virundhu' ||
        activePage === 'top10' ? (
        <main>
          <CategoryShowcasePage
            page={activePage}
            videos={
              activePage === 'vlogs'
                ? vlogVideos
                : activePage === 'mottamaadi'
                ? mottamaadiVideos
                : activePage === 'virundhu'
                ? virundhuVideos
                : topTenVideos
            }
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onBackHome={() => handleSelectNav('home')}
            onPlayVideo={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
          />
        </main>
      ) : (
        <main>
          {/* Auto-Slider: Mobile Video 1st on Top + Image/Title 2nd; Desktop Image/Title Left + Video Right */}
          <HeroAutoSlider
            slides={heroSlides}
            watchlistIds={watchlistIds}
            onWatchFull={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
          />

          {/* Aha/BS Value Featured Showcase + Circular Categories */}
          <CircleCategories
            categories={categoryCircles}
            selectedCategory={selectedCategory}
            videos={videos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onPlayVideo={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
          />

          {/* Latest Uploads (Auto-Updated via Live YouTube Sync) */}
          <VideoRail
            title={
              newUploadsCount > 0
                ? `Latest Releases (${newUploadsCount} Newly Synced)`
                : 'Latest Releases on VJS Max'
            }
            subtitle="Automatically synced with new uploads from VJ Siddhu Vlogs"
            videos={latestVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onPlay={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onViewAll={() => openSearchPage('')}
          />

          {/* Top 10 Rank Shelf */}
          <TopTenRail videos={topTenVideos} onPlay={handlePlayVideo} />

          {/* Continue Watching Rail */}
          {continueWatchingVideos.length > 0 && (
            <VideoRail
              title="Continue Watching"
              subtitle="Pick up right where you left off"
              videos={continueWatchingVideos}
              watchlistIds={watchlistIds}
              likedIds={likedIds}
              onPlay={handlePlayVideo}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleLike={handleToggleLike}
            />
          )}

          {/* Vlogs Rail */}
          <VideoRail
            id="vlogs-section"
            title="Vlogs — Therkku Seemai, Hyderabad & Hills"
            subtitle="Signature Tamil storytelling, village warmth & bachelor kitchen chaos"
            videos={vlogVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onPlay={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onViewAll={() => handleSelectNav('vlogs')}
          />

          {/* Mottamaadi Party Rail */}
          <VideoRail
            id="mottamaadi-section"
            title="Mottamaadi Party Originals"
            subtitle="Unfiltered Chennai terrace sessions, celebrity guests & nonstop banter"
            videos={mottamaadiVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onPlay={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onViewAll={() => handleSelectNav('mottamaadi')}
          />

          {/* VJ Siddhu Virundhu Rail */}
          <VideoRail
            id="virundhu-section"
            title="VJ Siddhu Virundhu"
            subtitle="6M Special, Kovai Virundhu & Malaysia Virundhu grand feasts"
            videos={virundhuVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onPlay={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onViewAll={() => handleSelectNav('virundhu')}
          />

          {/* Global Travel Series Rail */}
          <VideoRail
            id="travel-section"
            title="Global Travel Series — Egypt, Goa, Japan & Thailand"
            subtitle="International roadtrips, desert adventures & 4K binge specials"
            videos={travelVideos}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onPlay={handlePlayVideo}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            onViewAll={() => openSearchPage('Egypt')}
          />

          {/* Complete 340+ Episode Archive by Series */}
          <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
                  All Episodes Library ({archiveFiltered.length})
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
                  Browse every series and full archive on VJS Max
                </p>
              </div>
            </div>

            {/* Series Selector Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-5">
              {SERIES_LIST.map((series) => (
                <button
                  key={series}
                  type="button"
                  onClick={() => {
                    setArchiveSeries(series);
                    setArchiveVisible(24);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    archiveSeries === series
                      ? 'bg-yellow-400 text-[#1A1404] font-bold shadow-sm'
                      : 'bg-white ring-1 ring-amber-200/80 text-[#3E2F0A] hover:bg-amber-50 hover:text-amber-900 dark:bg-[#1A150C] dark:ring-yellow-400/15 dark:text-[#D6C79C] dark:hover:bg-[#261F12] dark:hover:text-yellow-300'
                  }`}
                >
                  {series}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {archiveFiltered.slice(0, archiveVisible).map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSaved={watchlistIds.includes(video.id)}
                  isLiked={likedIds.includes(video.id)}
                  onPlay={handlePlayVideo}
                  onToggleWatchlist={handleToggleWatchlist}
                  onToggleLike={handleToggleLike}
                  fluid
                />
              ))}
            </div>

            {archiveVisible < archiveFiltered.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setArchiveVisible((prev) => prev + 24)}
                  className="rounded-lg bg-white ring-1 ring-amber-200 px-6 py-3 text-sm font-semibold text-amber-800 hover:bg-yellow-400 hover:text-[#1A1404] dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
                >
                  Load More Episodes ({archiveFiltered.length - archiveVisible} left)
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Quiet OTT Footer with Bottom Nav Clearance */}
      <footer className="mt-10 border-t border-amber-200/80 dark:border-yellow-400/15 bg-white dark:bg-[#120F09] pb-24 sm:pb-24">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-lg font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
              VJS <span className="text-amber-600 dark:text-yellow-400">Max</span>
            </p>
            <p className="mt-1 text-xs text-[#5C4D24] dark:text-[#B8A77A]">
              Fan-Made OTT for VJ Siddhu Vlogs · {videos.length}+ episodes streaming live via YouTube embeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#5C4D24] dark:text-[#B8A77A]">
            <button
              type="button"
              onClick={() => handleSelectNav('home')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('vlogs')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Vlogs
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('mottamaadi')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Mottamaadi Party
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('virundhu')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              VJ Siddhu Virundhu
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('top10')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Top 10
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('watchlist')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Watchlist
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('search')}
              className="hover:text-amber-800 dark:hover:text-yellow-300 transition-colors"
            >
              Search
            </button>
            <a
              href="https://www.youtube.com/@VjSiddhuVlog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold transition-colors"
            >
              VJ Siddhu Vlogs YouTube
            </a>
            <PWAInstallButton variant="primary" />
          </div>
        </div>
      </footer>

      <OfflineIndicator />

      <BottomNav
        activePage={activePage}
        watchlistCount={watchlistIds.length}
        onSelectNav={handleSelectNav}
      />
    </div>
  );
}
