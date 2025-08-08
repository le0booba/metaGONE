
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import useIsMobile from '../hooks/useIsMobile';
import { CatIcon, ExternalLinkIcon } from './icons';

const navLinks = [
  { href: "https://gekkk.co/", text: "gekkk.co", Icon: ExternalLinkIcon },
  { href: "https://litterbox.catbox.moe/", text: "litterbox.catbox.moe", Icon: CatIcon },
  { href: "https://catbox.moe/", text: "catbox.moe", Icon: CatIcon },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile(640); // Corresponds to Tailwind's 'sm' breakpoint

  useEffect(() => {
    // Add hysteresis to prevent "twitching" when scrolling near the threshold.
    // We define a dead zone (45px-50px) where the state won't change, preventing rapid toggling.
    const shrinkThreshold = 50; // Shrink the header when scrolling down past 50px
    const expandThreshold = 45; // Expand it back when scrolling up past 45px

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Use a functional update to get the previous state without needing it in the dependency array.
      setIsScrolled(prevIsScrolled => {
        if (!prevIsScrolled && currentScrollY > shrinkThreshold) {
          return true; // Scrolled down, so shrink.
        }
        if (prevIsScrolled && currentScrollY < expandThreshold) {
          return false; // Scrolled up, so expand.
        }
        return prevIsScrolled; // Otherwise, keep the current state (in the dead zone).
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showShrunkHeader = isMobile && isScrolled;

  return (
    <header className="w-full border-b border-slate-700 bg-slate-700/80 backdrop-blur-sm sticky top-0 z-10">
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${showShrunkHeader ? 'py-2' : 'py-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className={`
              text-sm text-slate-300 overflow-hidden transition-all duration-300 ease-in-out
              ${showShrunkHeader ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}
            `}>
              Protect your privacy by removing metadata from your media files.
            </p>
          </div>
          {/* 
            The navigation container is given a fixed width on mobile (`w-[205px]`) to prevent its size 
            from changing during the shrink/expand animation. This eliminates the "jerk" caused by 
            the parent's `justify-between` recalculating the layout. On larger screens (`sm:`), 
            it reverts to `w-auto` to accommodate text links in a row.
          */}
          <nav className={`
            font-mono
            flex gap-2
            transition-all duration-300 ease-in-out
            
            sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:justify-start

            w-[205px]
            ${showShrunkHeader
              ? 'flex-row justify-end'
              : 'flex-col items-end'
            }
          `}>
            {navLinks.map(({ href, text, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  border border-slate-800 rounded-md text-sm text-slate-400 
                  hover:text-sky-400 hover:border-sky-500 transition-all 
                  duration-200 ease-in-out flex items-center justify-center
                  ${showShrunkHeader 
                      ? 'p-2 aspect-square' 
                      : 'px-3 py-1'
                  }
                `}
                title={text}
              >
                {showShrunkHeader ? (
                  <>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{text}</span>
                  </>
                ) : (
                  <span className="truncate">{text}</span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
