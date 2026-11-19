export type PageKey =
  | 'home'
  | 'vlogs'
  | 'mottamaadi'
  | 'virundhu'
  | 'top10'
  | 'search'
  | 'watchlist'
  | 'watch';

export type CategoryKey =
  | 'all'
  | 'mottamaadi'
  | 'virundhu'
  | 'vlogs'
  | 'travel'
  | 'watchlist';

export type DurationFilter = 'all' | 'short' | 'feature';

export type SortOption = 'trending' | 'views' | 'latest';

export interface VideoItem {
  id: string;
  title: string;
  series: string;
  category: Exclude<CategoryKey, 'all' | 'watchlist'>;
  duration: string;
  durationMinutes: number;
  views: string;
  viewsCount: number;
  published: string;
  recencyScore: number;
  description: string;
  fallbackImage: string;
  isNew?: boolean;
}

export interface CategoryCircleItem {
  id: Exclude<CategoryKey, 'watchlist'>;
  name: string;
  subtitle: string;
  featuredEpisodeTitle: string;
  featuredVideoId: string;
  image: string;
  fallbackImage?: string;
  episodeCountLabel: string;
}
