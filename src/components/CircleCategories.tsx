import { CategoryCircleItem, CategoryKey, VideoItem } from '../types/ott';
import { VJ_SIDDHU_LOGO_URL } from '../data/catalog';
import { SafeImage } from './SafeImage';
import { VideoCard } from './VideoCard';

interface CircleCategoriesProps {
  categories: CategoryCircleItem[];
  selectedCategory: CategoryKey;
  videos: VideoItem[];
  watchlistIds: string[];
  likedIds: string[];
  onSelectCategory: (cat: CategoryKey) => void;
  onPlayVideo: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  onToggleLike: (videoId: string) => void;
}

export function CircleCategories({
  categories,
  selectedCategory,
  videos,
  watchlistIds,
  likedIds,
  onSelectCategory,
  onPlayVideo,
  onToggleWatchlist,
  onToggleLike,
}: CircleCategoriesProps) {
  const effectiveCategory =
    selectedCategory === 'watchlist' ? 'all' : selectedCategory;

  const activeCategoryMeta =
    categories.find((c) => c.id === effectiveCategory) ?? categories[0];

  const categoryEpisodes =
    effectiveCategory === 'all'
      ? videos.slice(0, 8)
      : videos.filter((v) => v.category === effectiveCategory);

  return (
    <section
      aria-label="Shows and Circular Categories"
      className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8"
    >
      {/* Category Circles Immediately After Hero Auto-Slider */}
      <div className="pb-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
            Browse by Show
          </h2>
          {effectiveCategory !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="rounded-lg bg-white ring-1 ring-amber-200 px-3.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-yellow-400 dark:hover:bg-[#261F12] transition-colors whitespace-nowrap shrink-0"
            >
              All Channels
            </button>
          )}
        </div>

        <div className="flex items-start justify-start sm:justify-between gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => {
            const isActive = effectiveCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center text-center shrink-0 w-[124px] sm:w-[148px] focus-visible:outline-none"
              >
                <div className="relative">
                  <div
                    className={`h-24 w-24 sm:h-28 sm:w-28 rounded-full p-[3px] transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 scale-[1.05] shadow-lg shadow-yellow-500/30'
                        : 'bg-amber-200 dark:bg-yellow-400/20 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:to-amber-500'
                    }`}
                  >
                    <div className="h-full w-full overflow-hidden rounded-full bg-[#FFFDF7] dark:bg-[#0D0B07] p-[2px]">
                      <div className="h-full w-full overflow-hidden rounded-full bg-[#FEF6DC] dark:bg-[#1A150C]">
                        <SafeImage
                          src={cat.image}
                          fallbackSrc={cat.fallbackImage}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {cat.id !== 'all' && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#FFFDF7] dark:ring-[#0D0B07] bg-white p-0.5 shadow-md">
                      <SafeImage
                        src={VJ_SIDDHU_LOGO_URL}
                        fallbackSrc={cat.fallbackImage}
                        alt="VJ Siddhu Max logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <span
                  className={`mt-3 text-xs sm:text-sm font-bold leading-tight transition-colors ${
                    isActive
                      ? 'text-amber-700 dark:text-yellow-400'
                      : 'text-[#1A1404] dark:text-[#FEF9E7] group-hover:text-amber-700 dark:group-hover:text-yellow-300'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="mt-1 text-[11px] text-[#5C4D24] dark:text-[#B8A77A] line-clamp-1 max-w-full">
                  {cat.featuredEpisodeTitle}
                </span>
                <span className="mt-0.5 text-[11px] font-mono tabular-nums text-amber-700 dark:text-yellow-400 font-semibold">
                  {cat.episodeCountLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Episodes Below the Circles */}
      <div className="pt-6 border-t border-amber-200/80 dark:border-yellow-400/15">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 overflow-hidden rounded-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 p-[2px] shrink-0">
              <div className="h-full w-full overflow-hidden rounded-full bg-white p-1">
                <SafeImage
                  src={VJ_SIDDHU_LOGO_URL}
                  fallbackSrc={categories[0]?.fallbackImage}
                  alt="VJ Siddhu Max Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]">
                {activeCategoryMeta.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4D24] dark:text-[#B8A77A]">
                VJ Siddhu Vlogs · {activeCategoryMeta.subtitle} · {categoryEpisodes.length} episodes
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryEpisodes.slice(0, 4).map((video) => (
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
      </div>
    </section>
  );
}
