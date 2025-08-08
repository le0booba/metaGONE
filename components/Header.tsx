
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import useIsMobile from '../hooks/useIsMobile';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile(640); // Corresponds to Tailwind's 'sm' breakpoint

  useEffect(() => {
    const handleScroll = () => {
      // A threshold of 50px to trigger the animation
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showShrunkHeader = isMobile && isScrolled;

  const baseLinkClasses = "max-w-full sm:w-auto text-center inline-block px-3 py-1 border border-slate-800 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors";

  const conditionalLinkClasses = showShrunkHeader
    ? 'min-w-[80px] truncate'
    : 'min-w-[100px] mx-4 sm:mx-0';

  return (
    <header className="w-full border-b border-slate-700 bg-slate-700/80 backdrop-blur-sm sticky top-0 z-10">
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${showShrunkHeader ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className={`
              text-sm text-slate-300 overflow-hidden transition-all duration-300 ease-in-out
              ${showShrunkHeader ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-1'}
            `}>
              Protect your privacy by removing metadata from your media files.
            </p>
          </div>
          <div className={`
            font-mono transition-all duration-300 ease-in-out
            flex items-center gap-2 sm:gap-3
            ${showShrunkHeader
              ? 'flex-row w-auto' 
              : 'flex-col sm:flex-row w-full sm:w-auto'
            }
          `}>
            <a href="https://gekkk.co/" target="_blank" rel="noopener noreferrer" className={`${baseLinkClasses} ${conditionalLinkClasses}`}>
              gekkk.co
            </a>
            <a href="https://litterbox.catbox.moe/" target="_blank" rel="noopener noreferrer" className={`${baseLinkClasses} ${conditionalLinkClasses}`}>
              litterbox.catbox.moe
            </a>
            <a href="https://catbox.moe/" target="_blank" rel="noopener noreferrer" className={`${baseLinkClasses} ${conditionalLinkClasses}`}>
              catbox.moe
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
