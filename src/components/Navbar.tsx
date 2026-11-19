import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { PageKey } from '../types/ott';
import { VJ_SIDDHU_LOGO_URL } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  activePage: PageKey;
  onSelectNav: (target: PageKey) => void;
}

export function Navbar({
  activePage,
  onSelectNav,
}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 24) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        // Scrolling content up (moving down page) -> close navbar
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 6) {
        // Scrolling content down (moving back up) -> show navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure navbar resets visible whenever switching pages
  useEffect(() => {
    setIsVisible(true);
    lastScrollY.current = 0;
  }, [activePage]);

  const navItems: Array<{
    id: Extract<PageKey, 'home' | 'vlogs' | 'mottamaadi' | 'virundhu' | 'top10'>;
    label: string;
  }> = [
    { id: 'home', label: 'Home' },
    { id: 'vlogs', label: 'Vlogs' },
    { id: 'mottamaadi', label: 'Mottamaadi' },
    { id: 'virundhu', label: 'Virundhu' },
    { id: 'top10', label: 'Top 10' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-transparent transition-all duration-200 ease-out will-change-transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-8 px-4 py-3 sm:px-8">
        {/* Zone 1: VJS Max with Uploaded VJ Siddhu Max Logo */}
        <button
          type="button"
          onClick={() => onSelectNav('home')}
          className="group inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-[#1A1404] dark:text-[#FEF9E7] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          <span className="h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-full ring-2 ring-yellow-400 bg-white p-1 shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <SafeImage
              src={VJ_SIDDHU_LOGO_URL}
              fallbackSrc="/pwa-192x192.png"
              alt="VJ Siddhu Max Logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span>
            VJS <span className="text-amber-600 dark:text-yellow-400">Max</span>
          </span>
        </button>

        {/* Zone 2: Modern single-line page navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm ${
                  isActive
                    ? 'text-amber-700 dark:text-yellow-400 font-bold'
                    : 'text-[#4A3C18] dark:text-[#E5D7AE] hover:text-[#1A1404] dark:hover:text-yellow-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="top-nav-underline"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                  />
                ) : (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] scale-x-0 rounded-full bg-yellow-400/70 transition-transform duration-200 group-hover:scale-x-100" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Search Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectNav('search')}
            aria-label="Open search page"
            aria-current={activePage === 'search' ? 'page' : undefined}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              activePage === 'search'
                ? 'bg-yellow-400 text-[#1A1404] shadow-md shadow-yellow-500/25'
                : 'bg-white/90 text-[#1A1404] ring-1 ring-amber-200/90 hover:bg-yellow-400 dark:bg-[#1A150C]/85 dark:text-[#FEF9E7] dark:ring-yellow-400/25 dark:hover:bg-yellow-400 dark:hover:text-[#1A1404]'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </header>
  );
}
