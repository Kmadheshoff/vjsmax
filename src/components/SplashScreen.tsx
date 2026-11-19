import { useEffect } from 'react';
import { motion } from 'motion/react';
import { VJ_SIDDHU_LOGO_URL } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_DURATION_MS = 3600;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = window.setTimeout(
      onComplete,
      prefersReduced ? 1000 : SPLASH_DURATION_MS
    );
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#FFFDF4] text-[#1A1404] dark:bg-[#0D0B07] dark:text-[#FEF9E7]"
      aria-label="VJS Max loading splash screen"
    >
      {/* Ambient Warm Golden-Yellow Cinema Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.92, 0.72], scale: [0.7, 1.18, 1.05] }}
        transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.34)_0%,rgba(253,224,71,0.22)_45%,transparent_75%)] blur-2xl"
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Official VJ Siddhu Vlogs Circular Logo */}
        <motion.div
          initial={{ scale: 0.42, opacity: 0, rotate: -14 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 p-[3px] shadow-2xl shadow-yellow-500/30"
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-[#17130B] p-[3px]">
            <SafeImage
              src={VJ_SIDDHU_LOGO_URL}
              fallbackSrc="/src/assets/images/hero_purple_backdrop_1795023079425.jpg"
              alt="VJ Siddhu Vlogs Official Logo"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </motion.div>

        {/* VJS Max Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 18, letterSpacing: '0.26em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7]"
        >
          VJS <span className="text-amber-600 dark:text-yellow-400">Max</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2.5 text-xs sm:text-sm font-medium tracking-wide text-[#5C4D24] dark:text-[#C7B88E]"
        >
          Fan-Made OTT · VJ Siddhu Vlogs · 340+ Episodes Streaming Now
        </motion.p>
      </div>
    </motion.div>
  );
}
