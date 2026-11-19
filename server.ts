import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface LiveYouTubeVideo {
  id: string;
  title: string;
  duration: string;
  views: string;
  published: string;
  isNew?: boolean;
}

const CHANNEL_ID = 'UCJcCB-QYPIBcbKcBQOTwhiA';
const CHANNEL_VIDEOS_URL = 'https://www.youtube.com/@VjSiddhuVlog/videos';
const CHANNEL_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const CACHE_TTL_MS = 4500;
let cachedPayload: { videos: LiveYouTubeVideo[]; syncedAt: string } | null = null;
let cachedAt = 0;
let inFlightFetch: Promise<LiveYouTubeVideo[]> | null = null;

function parseLockup(lockup: Record<string, unknown>): LiveYouTubeVideo | null {
  const id = typeof lockup.contentId === 'string' ? lockup.contentId : '';
  if (!id || id.length !== 11) return null;

  const metadata = lockup.metadata as Record<string, unknown> | undefined;
  const lockupMeta = metadata?.lockupMetadataViewModel as Record<string, unknown> | undefined;
  const titleObj = lockupMeta?.title as Record<string, unknown> | undefined;
  const title = typeof titleObj?.content === 'string' ? titleObj.content : '';
  if (!title) return null;

  let duration = '';
  const contentImage = lockup.contentImage as Record<string, unknown> | undefined;
  const thumbVM = contentImage?.thumbnailViewModel as Record<string, unknown> | undefined;
  const overlays = (thumbVM?.overlays as Array<Record<string, unknown>>) || [];
  for (const ov of overlays) {
    const bottom = ov?.thumbnailBottomOverlayViewModel as Record<string, unknown> | undefined;
    const badges = (bottom?.badges as Array<Record<string, unknown>>) || [];
    const badgeVM = badges[0]?.thumbnailBadgeViewModel as Record<string, unknown> | undefined;
    if (typeof badgeVM?.text === 'string') {
      duration = badgeVM.text;
      break;
    }
  }

  const metaContainer = lockupMeta?.metadata as Record<string, unknown> | undefined;
  const contentMeta = metaContainer?.contentMetadataViewModel as Record<string, unknown> | undefined;
  const rows = (contentMeta?.metadataRows as Array<Record<string, unknown>>) || [];
  const parts: string[] = [];
  for (const row of rows) {
    const metaParts = (row.metadataParts as Array<Record<string, unknown>>) || [];
    for (const part of metaParts) {
      const textObj = part?.text as Record<string, unknown> | undefined;
      if (typeof textObj?.content === 'string') {
        parts.push(textObj.content);
      }
    }
  }

  const viewsRaw = parts.find((p) => /views/i.test(p)) || parts[0] || '';
  const published = parts.find((p) => /ago/i.test(p)) || parts[1] || 'Just now';
  const views = viewsRaw.replace(/\s*views/i, '').trim() || 'New';

  return { id, title, duration: duration || '20:00', views, published };
}

function parseRssXml(xml: string): LiveYouTubeVideo[] {
  const entries = xml.split('<entry>').slice(1);
  const out: LiveYouTubeVideo[] = [];
  for (const entry of entries) {
    const idMatch = entry.match(/<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
    if (!idMatch || !titleMatch) continue;
    const publishedDate = pubMatch ? new Date(pubMatch[1]) : null;
    let publishedLabel = 'New';
    if (publishedDate && !Number.isNaN(publishedDate.getTime())) {
      const diffHours = Math.max(
        1,
        Math.floor((Date.now() - publishedDate.getTime()) / (1000 * 60 * 60))
      );
      publishedLabel =
        diffHours < 24
          ? `${diffHours}h ago`
          : `${Math.floor(diffHours / 24)}d ago`;
    }
    const decodedTitle = titleMatch[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    out.push({
      id: idMatch[1],
      title: decodedTitle,
      duration: '20:00',
      views: 'New',
      published: publishedLabel,
      isNew: true,
    });
  }
  return out;
}

async function fetchLatestFromYouTube(): Promise<LiveYouTubeVideo[]> {
  const collected: LiveYouTubeVideo[] = [];
  const seen = new Set<string>();

  try {
    const htmlRes = await fetch(CHANNEL_VIDEOS_URL, {
      headers: {
        'User-Agent': CHROME_UA,
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(4500),
    });
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
      if (match) {
        const data = JSON.parse(match[1]) as unknown;
        const walk = (node: unknown) => {
          if (!node || typeof node !== 'object') return;
          const record = node as Record<string, unknown>;
          if (record.lockupViewModel && typeof record.lockupViewModel === 'object') {
            const parsed = parseLockup(record.lockupViewModel as Record<string, unknown>);
            if (parsed && !seen.has(parsed.id)) {
              seen.add(parsed.id);
              collected.push(parsed);
            }
            return;
          }
          for (const key of Object.keys(record)) {
            walk(record[key]);
          }
        };
        walk(data);
      }
    }
  } catch {
    // Fall through to RSS feed fallback
  }

  try {
    const rssRes = await fetch(CHANNEL_RSS_URL, {
      signal: AbortSignal.timeout(4000),
    });
    if (rssRes.ok) {
      const xml = await rssRes.text();
      const rssVideos = parseRssXml(xml);
      for (const rv of rssVideos) {
        if (!seen.has(rv.id)) {
          seen.add(rv.id);
          collected.push(rv);
        }
      }
    }
  } catch {
    // Ignore RSS fetch failure if offline
  }

  return collected;
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  app.get('/api/videos', async (req, res) => {
    const forceRefresh = req.query.refresh === '1';
    const now = Date.now();
    if (!forceRefresh && cachedPayload && now - cachedAt < CACHE_TTL_MS) {
      res.json({ ...cachedPayload, source: 'cache' });
      return;
    }

    if (!inFlightFetch) {
      inFlightFetch = fetchLatestFromYouTube().finally(() => {
        inFlightFetch = null;
      });
    }

    const videos = await inFlightFetch;
    const payload = {
      videos,
      syncedAt: new Date().toISOString(),
    };
    if (videos.length > 0) {
      cachedPayload = payload;
      cachedAt = Date.now();
    }
    res.json({ ...payload, source: 'youtube-live' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`VJS Max server listening on port ${PORT}`);
  });
}

startServer();
