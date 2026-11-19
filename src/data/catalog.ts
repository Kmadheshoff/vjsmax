import rawVideos from './raw_videos.json';
import { CategoryCircleItem, VideoItem } from '../types/ott';

export const HERO_BACKDROP_IMAGE =
  '/src/assets/images/hero_purple_backdrop_1795023079425.jpg';
export const VJ_SIDDHU_LOGO_URL =
  'https://yt3.googleusercontent.com/Ep1bqaU3J0HcdsmrLoHivkN265srA7Mdvj9Dq0hcTyCcXiDDLxpegWxnCRuFnKIQiSvX4iqv2g=s900-c-k-c0x00ffffff-no-rj';

const ART_VLOGS = '/src/assets/images/category_vlogs_1795021950439.jpg';
const ART_MOTTAMAADI = '/src/assets/images/category_mottamaadi_1795021950958.jpg';
const ART_VIRUNDHU = '/src/assets/images/category_virundhu_1795021951873.jpg';
const ART_TRAVEL = '/src/assets/images/category_travel_1795021951432.jpg';

export function getYoutubeThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYoutubeEmbedUrl(videoId: string, muted = false): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(muted ? { mute: '1' } : {}),
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export interface RawYouTubeRecord {
  id: string;
  title: string;
  duration?: string;
  views?: string;
  published?: string;
  isNew?: boolean;
}

function parseViewsCount(viewsStr: string): number {
  const clean = viewsStr.replace(/,/g, '').trim().toUpperCase();
  const match = clean.match(/([\d.]+)\s*([KM])?/);
  if (!match) return 500000;
  const num = parseFloat(match[1]);
  if (Number.isNaN(num)) return 500000;
  if (match[2] === 'M') return Math.round(num * 1_000_000);
  if (match[2] === 'K') return Math.round(num * 1_000);
  return Math.round(num);
}

function parseDurationMinutes(durationStr: string): number {
  const parts = durationStr.split(':').map((n) => parseInt(n, 10));
  if (parts.some((n) => Number.isNaN(n))) return 20;
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0];
  return 20;
}

function parseRecencyScore(published: string, index: number): number {
  const lower = published.toLowerCase();
  const num = parseInt(lower, 10) || 1;
  if (lower.includes('just') || lower.includes('min') || lower.includes('h ago')) {
    return 10000 - num;
  }
  if (lower.includes('d ago')) return 9000 - num * 10;
  if (lower.includes('wk') || lower.includes('week')) return 8000 - num * 50;
  if (lower.includes('mo')) return 7000 - num * 100;
  if (lower.includes('y ago')) return 5000 - num * 500 - index;
  return Math.max(100, 4000 - index);
}

function detectSeriesAndCategory(title: string): {
  series: string;
  category: VideoItem['category'];
  fallbackImage: string;
  description: string;
} {
  const t = title.toLowerCase();

  if (t.includes('mottamadi') || t.includes('mottamaadi') || t.includes('மொட்டமாடி')) {
    return {
      series: 'Mottamaadi Party',
      category: 'mottamaadi',
      fallbackImage: ART_MOTTAMAADI,
      description:
        'Unfiltered rooftop hangout, rapid-fire banter, and spontaneous comedy under the Chennai night sky.',
    };
  }

  if (t.includes('virundhu') || t.includes('விருந்து') || t.includes('விருந்தாளி') || t.includes('6m')) {
    const series = t.includes('malaysia')
      ? 'Malaysia Virundhu'
      : t.includes('kovai')
      ? 'Kovai Virundhu'
      : t.includes('6m')
      ? '6M Virundhu Series'
      : 'VJ Siddhu Virundhu';
    return {
      series,
      category: 'virundhu',
      fallbackImage: ART_VIRUNDHU,
      description:
        'Signature South Indian feast celebration, subscriber surprises, and non-stop food & dance entertainment.',
    };
  }

  const travelMatchers: Array<[RegExp, string]> = [
    [/egypt/i, 'Egypt Series'],
    [/srilanka|sri lanka/i, 'Sri Lanka 2.0 Series'],
    [/vietnam/i, 'Vietnam Series'],
    [/singapore/i, 'Singapore Series'],
    [/dubai/i, 'Dubai Series 2.0'],
    [/china/i, 'China Series'],
    [/maldives/i, 'Maldives Series'],
    [/japan/i, 'Japan Series'],
    [/thailand/i, 'Thailand Series'],
    [/goa/i, 'Goa Series'],
  ];

  for (const [regex, seriesName] of travelMatchers) {
    if (regex.test(title)) {
      return {
        series: seriesName,
        category: 'travel',
        fallbackImage: ART_TRAVEL,
        description: `International travel vlog adventure from the ${seriesName} — roadtrips, local street food, and squad comedy.`,
      };
    }
  }

  const vlogMatchers: Array<[RegExp, string]> = [
    [/தெற்கு சீமை|therkku/i, 'தெற்கு சீமை Series'],
    [/kushkoo/i, 'Kushkoo Series'],
    [/village/i, 'Village Series'],
    [/yelagiri/i, 'Yelagiri Series'],
    [/bike trip/i, 'Bike Trip 2.0'],
    [/velankanni/i, 'Velankanni Series'],
    [/mumbai/i, 'Mumbai Series'],
    [/dharapuram/i, 'Dharapuram Series'],
    [/madurai/i, 'Madurai Series'],
    [/poombarai/i, 'Poombarai Series'],
    [/hyderabad/i, 'Hyderabad Series'],
    [/bachelor food/i, 'Bachelor Food Series'],
    [/pongal/i, 'Pongal Special'],
    [/birthday/i, 'Birthday Series'],
    [/kalyanam/i, 'Namma Veetu Kalyanam'],
    [/delhi/i, 'Delhi Series'],
    [/theni/i, 'Theni Series'],
    [/ooty/i, 'Ooty Series'],
  ];

  for (const [regex, seriesName] of vlogMatchers) {
    if (regex.test(title)) {
      return {
        series: seriesName,
        category: 'vlogs',
        fallbackImage: ART_VLOGS,
        description: `Original episode from ${seriesName} on VJ Siddhu Vlogs — candid storytelling, roadtrip humor, and authentic Tamil camaraderie.`,
      };
    }
  }

  return {
    series: 'VJ Siddhu Vlogs',
    category: 'vlogs',
    fallbackImage: ART_VLOGS,
    description:
      'Official VJ Siddhu Vlogs episode packed with spontaneous Tamil comedy, adventures, and fan moments.',
  };
}

export function normalizeYouTubeVideo(raw: RawYouTubeRecord, index: number): VideoItem {
  const duration = raw.duration && raw.duration.trim() ? raw.duration.trim() : '20:00';
  const views = raw.views && raw.views.trim() ? raw.views.trim() : '1.5M';
  const published = raw.published && raw.published.trim() ? raw.published.trim() : 'Recently';
  const meta = detectSeriesAndCategory(raw.title);

  return {
    id: raw.id,
    title: raw.title,
    series: meta.series,
    category: meta.category,
    duration,
    durationMinutes: parseDurationMinutes(duration),
    views,
    viewsCount: parseViewsCount(views),
    published,
    recencyScore: parseRecencyScore(published, index),
    description: meta.description,
    fallbackImage: meta.fallbackImage,
    isNew: raw.isNew,
  };
}

export const INITIAL_VIDEOS: VideoItem[] = (rawVideos as RawYouTubeRecord[]).map(
  (raw, idx) => normalizeYouTubeVideo(raw, idx)
);

export function buildHeroSlides(videos: VideoItem[]): VideoItem[] {
  const preferredIds = [
    'LAyKxmIsYZE',
    'wzrs19aEmPQ',
    'u2kCZUTg8nc',
    'Cteli94Jlkc',
    'm_NcENviH4g',
  ];
  const picked: VideoItem[] = [];
  for (const id of preferredIds) {
    const found = videos.find((v) => v.id === id);
    if (found) picked.push(found);
  }
  if (picked.length < 5) {
    for (const v of videos) {
      if (!picked.some((p) => p.id === v.id)) picked.push(v);
      if (picked.length >= 5) break;
    }
  }
  return picked;
}

export function buildCategoryCircles(videos: VideoItem[]): CategoryCircleItem[] {
  const vlogs = videos.filter((v) => v.category === 'vlogs');
  const mottamaadi = videos.filter((v) => v.category === 'mottamaadi');
  const virundhu = videos.filter((v) => v.category === 'virundhu');
  const travel = videos.filter((v) => v.category === 'travel');

  const topVlog = vlogs[0] ?? videos[0];
  const topMottamaadi = mottamaadi[0] ?? videos[0];
  const topVirundhu = virundhu[0] ?? videos[0];
  const topTravel = travel[0] ?? videos[0];

  return [
    {
      id: 'all',
      name: 'VJS Max Originals',
      subtitle: 'Complete VJ Siddhu Archive',
      featuredEpisodeTitle: videos[0]?.title || 'Latest & Trending Episodes',
      featuredVideoId: videos[0]?.id || 'LAyKxmIsYZE',
      image: VJ_SIDDHU_LOGO_URL,
      fallbackImage: HERO_BACKDROP_IMAGE,
      episodeCountLabel: `${videos.length} Episodes`,
    },
    {
      id: 'vlogs',
      name: 'Vlogs',
      subtitle: 'Therkku Seemai & Daily',
      featuredEpisodeTitle: topVlog.title,
      featuredVideoId: topVlog.id,
      image: getYoutubeThumb(topVlog.id),
      fallbackImage: ART_VLOGS,
      episodeCountLabel: `${vlogs.length} Episodes`,
    },
    {
      id: 'mottamaadi',
      name: 'Mottamaadi Party',
      subtitle: 'Rooftop Talk & Comedy',
      featuredEpisodeTitle: topMottamaadi.title,
      featuredVideoId: topMottamaadi.id,
      image: getYoutubeThumb(topMottamaadi.id),
      fallbackImage: ART_MOTTAMAADI,
      episodeCountLabel: `${mottamaadi.length} Episodes`,
    },
    {
      id: 'virundhu',
      name: 'VJ Siddhu Virundhu',
      subtitle: '6M, Kovai & Malaysia',
      featuredEpisodeTitle: topVirundhu.title,
      featuredVideoId: topVirundhu.id,
      image: getYoutubeThumb(topVirundhu.id),
      fallbackImage: ART_VIRUNDHU,
      episodeCountLabel: `${virundhu.length} Episodes`,
    },
    {
      id: 'travel',
      name: 'Global Travel Series',
      subtitle: 'Egypt, Goa, Japan & More',
      featuredEpisodeTitle: topTravel.title,
      featuredVideoId: topTravel.id,
      image: getYoutubeThumb(topTravel.id),
      fallbackImage: ART_TRAVEL,
      episodeCountLabel: `${travel.length} Episodes`,
    },
  ];
}

export const SERIES_LIST = [
  'All Series',
  'Egypt Series',
  'Mottamaadi Party',
  '6M Virundhu Series',
  'தெற்கு சீமை Series',
  'Kovai Virundhu',
  'Malaysia Virundhu',
  'Goa Series',
  'Singapore Series',
  'Vietnam Series',
  'Dubai Series 2.0',
  'Japan Series',
  'Thailand Series',
  'Hyderabad Series',
  'China Series',
  'Maldives Series',
  'Village Series',
  'Poombarai Series',
  'Madurai Series',
  'Bachelor Food Series',
];
