import { motion } from 'motion/react';
import { Bookmark, Home, Search } from 'lucide-react';
import { PageKey } from '../types/ott';

interface BottomNavProps {
  activePage: PageKey;
  watchlistCount: number;
  onSelectNav: (target: Extract<PageKey, 'home' | 'search' | 'watchlist'>) => void;
}

export function BottomNav({
  activePage,
  watchlistCount,
  onSelectNav,
}: BottomNavProps) {
  const items: Array<{
    id: Extract<PageKey, 'home' | 'search' | 'watchlist'>;
    label: string;
    active: boolean;
    badge?: number;
    Icon: typeof Home;
  }> = [
    { id: 'home', label: 'Home', active: activePage === 'home', Icon: Home },
    { id: 'search', label: 'Search', active: activePage === 'search', Icon: Search },
    {
      id: 'watchlist',
      label: 'Watchlist',
      active: activePage === 'watchlist',
      badge: watchlistCount,
      Icon: Bookmark,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-3 inset-x-3 z-40 sm:bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <div className="mx-auto flex h-[54px] w-full max-w-[410px] sm:w-auto sm:min-w-[390px] items-center justify-between gap-1 rounded-full bg-white/85 dark:bg-[#17130B]/88 p-1.5 backdrop-blur-2xl ring-1 ring-amber-900/10 dark:ring-yellow-400/15 shadow-[0_14px_40px_-8px_rgba(26,20,4,0.18)] dark:shadow-[0_18px_46px_-8px_rgba(0,0,0,0.72)]">
        {items.map(({ id, label, active, badge, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectNav(id)}
            aria-current={active ? 'page' : undefined}
            className={`relative flex flex-1 sm:min-w-[116px] h-full items-center justify-center gap-2 rounded-full px-3.5 text-xs font-bold whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              active
                ? 'text-[#1A1404]'
                : 'text-[#5C4D24] hover:text-[#1A1404] dark:text-[#D6C79C] dark:hover:text-yellow-300'
            }`}
          >
            {active && (
              <motion.span
                layoutId="bottom-nav-active-pill"
                transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                className="absolute inset-0 rounded-full bg-yellow-400 shadow-md shadow-yellow-500/30"
              />
            )}

            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                  active ? 'scale-105' : ''
                } ${active && id === 'watchlist' ? 'fill-current' : ''}`}
              />
              <span>{label}</span>
              {typeof badge === 'number' && badge > 0 && (
                <span
                  className={`font-mono tabular-nums text-[11px] leading-none px-1.5 py-0.5 rounded-full ${
                    active
                      ? 'bg-[#1A1404]/15 text-[#1A1404]'
                      : 'bg-amber-100 text-amber-800 dark:bg-yellow-400/15 dark:text-yellow-300'
                  }`}
                >
                  {badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
