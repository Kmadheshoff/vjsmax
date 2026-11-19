import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';

interface SafeImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export function SafeImage({ src, fallbackSrc, alt, className = '' }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failedAll, setFailedAll] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailedAll(false);
  }, [src]);

  if (failedAll) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF8E6] via-[#FDEFC8] to-[#FCE4A6] text-amber-700/75 dark:from-[#1E190E] dark:via-[#292212] dark:to-[#332A16] dark:text-yellow-400/80 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="w-8 h-8 mb-1.5" strokeWidth={1.5} />
        <span className="text-xs text-[#4A3C18]/80 dark:text-[#D6C79C]/85 px-3 text-center line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setFailedAll(true);
        }
      }}
    />
  );
}
