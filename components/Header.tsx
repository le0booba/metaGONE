
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import useIsMobile from '../hooks/useIsMobile';
import { CatIcon, ExternalLinkIcon, UploadCloudIcon } from './icons';

const navLinks = [
  { href: "https://gekkk.co/", text: "gekkk.co", Icon: ExternalLinkIcon },
  { href: "https://litterbox.catbox.moe/", text: "litterbox.catbox.moe", Icon: UploadCloudIcon },
  { href: "https://catbox.moe/", text: "catbox.moe", Icon: CatIcon },
];

export const Header: React.FC = () => {
  const [isShrunkForNav, setIsShrunkForNav] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile(640); // Corresponds to Tailwind's 'sm' breakpoint

  useEffect(() => {
    const scrollThresholdStart = 0;
    const scrollThresholdEnd = 50; // Animate over the first 50px of scrolling

    const handleScroll = () => {
      if (!isMobile) {
        if(headerRef.current) {
          headerRef.current.style.removeProperty('--scroll-progress');
        }
        setIsShrunkForNav(false);
        return;
      }

      const scrollY = window.scrollY;
      let progress = 0;
      if (scrollY >= scrollThresholdEnd) {
        progress = 1;
      } else if (scrollY > scrollThresholdStart) {
        progress = (scrollY - scrollThresholdStart) / (scrollThresholdEnd - scrollThresholdStart);
      }
      
      if (headerRef.current) {
        headerRef.current.style.setProperty('--scroll-progress', progress.toString());
      }
      
      // We still use a threshold to switch the nav items to prevent visual glitches during transition
      setIsShrunkForNav(scrollY > scrollThresholdEnd / 2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const showShrunkHeader = isMobile && isShrunkForNav;

  return (
    <header ref={headerRef} className="header-container w-full border-b border-slate-700 bg-slate-700/80 backdrop-blur-sm sticky top-0 z-10">
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 header-dynamic-padding sm:py-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className="text-sm text-slate-300 overflow-hidden header-description sm:opacity-100 sm:mt-1 sm:max-h-20">
              Protect your privacy by removing metadata from your media files.
            </p>
          </div>
          {/* 
            The navigation container is given a fixed width on mobile (`w-[170px]`) to prevent its size 
            from changing during the shrink/expand animation. This eliminates the "jerk" caused by 
            the parent's `justify-between` recalculating the layout. On larger screens (`sm:`), 
            it reverts to `w-auto` to accommodate text links in a row.
          */}
          <nav className={`
            font-mono
            flex gap-2
            transition-all duration-300 ease-in-out
            
            sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:justify-start

            w-[170px]
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
                  border border-slate-800 rounded-md text-xs text-slate-400 
                  hover:text-sky-400 hover:border-sky-500 transition-all 
                  duration-200 ease-in-out flex items-center justify-center
                  ${showShrunkHeader 
                      ? 'p-1 aspect-square' 
                      : 'px-2 py-0.5'
                  }
                `}
                title={text}
              >
                {showShrunkHeader ? (
                  <>
                    <Icon className="h-3 w-3" aria-hidden="true" />
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
