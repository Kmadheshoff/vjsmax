import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VideoItem } from '../types/ott';
import {
  getYoutubeEmbedUrl,
  getYoutubeThumb,
  HERO_BACKDROP_IMAGE,
  VJ_SIDDHU_LOGO_URL,
} from '../data/catalog';
import { SafeImage } from './SafeImage';

interface HeroAutoSliderProps {
  slides: VideoItem[];
  watchlistIds: string[];
  onWatchFull: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
}

const SLIDE_INTERVAL_MS = 10000;

export function HeroAutoSlider({
  slides,
  watchlistIds,
  onWatchFull,
  onToggleWatchlist,
}: HeroAutoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const currentSlide = slides[activeIndex] ?? slides[0];
  const isSaved = watchlistIds.includes(currentSlide.id);

  useEffect(() => {
    if (!isAutoSliding || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isAutoSliding, slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="VJS Max Featured Billboard"
      className="relative overflow-hidden bg-[#FFFDF7] dark:bg-[#0D0B07]"
    >
      {/* Ambient Warm Golden-Yellow Cinema Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <SafeImage
          src={HERO_BACKDROP_IMAGE}
          alt="VJS Max warm yellow cinema stage"
          className="h-full w-full object-cover opacity-10 dark:opacity-15"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.24),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF7]/85 via-[#FFFDF7]/40 to-[#FFFDF7] dark:from-[#0D0B07]/85 dark:via-[#0D0B07]/45 dark:to-[#0D0B07]" />
      </div>

      {/* TOP: Cinematic Auto-Playing Video Stage */}
      <div className="relative mx-auto max-w-[1600px] pt-14 sm:pt-16 lg:px-8">
        <div className="relative aspect-video max-h-[58vh] lg:max-h-[64vh] w-full overflow-hidden lg:rounded-t-2xl bg-black shadow-[0_28px_72px_-18px_rgba(202,138,4,0.28)]">
          <iframe
            key={`${currentSlide.id}-${isMuted ? 'muted' : 'unmuted'}`}
            src={getYoutubeEmbedUrl(currentSlide.id, isMuted)}
            title={currentSlide.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />

          {/* Sound Toggle Floating Top-Right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (!nextMuted) setIsAutoSliding(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1A1404] backdrop-blur-md shadow-md hover:bg-yellow-400 dark:bg-[#17130B]/90 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          </div>

          {/* Lower Video Atmospheric Golden Smoke Transition Seam */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-28 sm:h-40 bg-gradient-to-t from-[#FFFDF7] via-[#FFFDF7]/75 to-transparent dark:from-[#0D0B07] dark:via-[#0D0B07]/80" />
          <div className="pointer-events-none absolute -bottom-12 -left-16 h-44 w-[65%] rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.62)_0%,rgba(254,249,195,0.45)_45%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(250,204,21,0.28)_0%,rgba(161,98,7,0.18)_45%,transparent_72%)] blur-2xl animate-smoke-a" />
          <div className="pointer-events-none absolute -bottom-10 -right-16 h-44 w-[65%] rounded-full bg-[radial-gradient(circle,rgba(252,211,77,0.55)_0%,rgba(254,243,199,0.5)_45%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.24)_0%,rgba(120,53,15,0.18)_45%,transparent_72%)] blur-2xl animate-smoke-b" />
        </div>
      </div>

      {/* BELOW: Smoke-Veiled Episode Image, Title, Description & Slider Controls */}
      <div className="relative -mt-8 sm:-mt-14 lg:-mt-16 pb-8">
        {/* Drifting Volumetric Golden-Yellow Smoke Plumes behind Info & Description */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 left-[-10%] h-64 w-[58%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(253,224,71,0.48)_0%,rgba(254,249,195,0.32)_48%,transparent_74%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.18)_0%,rgba(161,98,7,0.1)_48%,transparent_74%)] blur-3xl animate-smoke-a" />
          <div className="absolute -top-8 right-[-8%] h-64 w-[58%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.42)_0%,rgba(254,243,199,0.34)_48%,transparent_74%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15)_0%,rgba(120,53,15,0.1)_48%,transparent_74%)] blur-3xl animate-smoke-b" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FFFDF7]/90 via-[#FFFDF7]/45 to-transparent dark:from-[#0D0B07]/90 dark:via-[#0D0B07]/45" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FFFDF7] to-transparent dark:from-[#0D0B07]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
            >
              {/* Episode Poster Image + Title + Description */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onWatchFull(currentSlide)}
                  aria-label={`Open ${currentSlide.title}`}
                  className="relative aspect-video w-48 sm:w-64 lg:w-72 shrink-0 overflow-hidden rounded-xl bg-[#FEF6DC] dark:bg-[#1A150C] shadow-xl shadow-amber-900/15 dark:shadow-black/50 ring-1 ring-amber-200 dark:ring-yellow-400/20 group"
                >
                  <SafeImage
                    src={getYoutubeThumb(currentSlide.id)}
                    fallbackSrc={currentSlide.fallbackImage}
                    alt={currentSlide.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-white">
                    {currentSlide.duration}
                  </span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-yellow-500/80 shrink-0 bg-white p-0.5">
                      <SafeImage
                        src={VJ_SIDDHU_LOGO_URL}
                        fallbackSrc={currentSlide.fallbackImage}
                        alt="VJ Siddhu Max Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-bold tracking-wide text-amber-700 dark:text-yellow-400 truncate">
                      {currentSlide.series}
                    </span>
                    <span className="text-amber-500 text-xs" aria-hidden="true">·</span>
                    <span className="text-xs text-[#5C4D24] dark:text-[#B8A77A] tabular-nums whitespace-nowrap">
                      {currentSlide.views} views · {currentSlide.published}
                    </span>
                  </div>

                  <h1
                    className="mt-2 font-display font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] leading-[1.14] [text-wrap:balance]"
                    style={{ fontSize: 'clamp(1.4rem, 2.3vw, 2.25rem)' }}
                  >
                    {currentSlide.title}
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-[#4A3C18] dark:text-[#D6C79C] line-clamp-2 max-w-3xl">
                    {currentSlide.description}
                  </p>
                </div>
              </div>

              {/* Actions + Slide Controls */}
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center lg:flex-col lg:items-end shrink-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onWatchFull(currentSlide)}
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-lg shadow-yellow-500/25"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(currentSlide.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isSaved
                        ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 dark:bg-yellow-400/20 dark:text-yellow-300 dark:ring-yellow-400/40'
                        : 'bg-white text-[#1A1404] ring-1 ring-amber-200 hover:bg-amber-50 dark:bg-[#1A150C] dark:text-[#FEF9E7] dark:ring-yellow-400/20 dark:hover:bg-[#261F12]'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isSaved ? 'In Watchlist' : 'Watchlist'}</span>
                  </button>
                </div>

                {/* Auto-Slider Progress & Slide Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {slides.map((slide, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          aria-label={`Slide ${idx + 1}: ${slide.series}`}
                          onClick={() => goToSlide(idx)}
                          className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-200 ${
                            isActive
                              ? 'w-9 bg-amber-200 dark:bg-yellow-400/25'
                              : 'w-2 bg-amber-200 hover:bg-amber-400 dark:bg-yellow-400/20 dark:hover:bg-yellow-400/45'
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              key={`${activeIndex}-${isAutoSliding ? 'run' : 'pause'}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isAutoSliding ? 1 : 0.4 }}
                              transition={{
                                duration: isAutoSliding ? SLIDE_INTERVAL_MS / 1000 : 0.2,
                                ease: 'linear',
                              }}
                              style={{ originX: 0 }}
                              className="block h-full w-full bg-gradient-to-r from-yellow-400 to-amber-500"
                            />
                          )}
                        </button>
                      );
                    })}
                    <span className="ml-1 font-mono text-xs tabular-nums text-[#5C4D24] dark:text-[#B8A77A]">
                      {String(activeIndex + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={isAutoSliding ? 'Pause auto slider' : 'Resume auto slider'}
                      onClick={() => setIsAutoSliding((prev) => !prev)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
                    >
                      {isAutoSliding ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={() => goToSlide(activeIndex - 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={() => goToSlide(activeIndex + 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-amber-200 text-[#2E2208] hover:bg-amber-50 dark:bg-[#1A150C] dark:ring-yellow-400/20 dark:text-[#FEF9E7] dark:hover:bg-[#261F12] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
