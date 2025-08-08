
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
            font-mono
            grid items-center gap-2
            transition-all duration-300 ease-in-out
            sm:flex sm:flex-row sm:gap-3
            ${showShrunkHeader
              ? 'grid-cols-3'
              : 'grid-cols-1 w-full sm:w-auto'
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
                      ? 'p-2' 
                      : 'px-3 py-1 min-w-[100px] mx-4 sm:mx-0'
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
          </div>
        </div>
      </div>
    </header>
  );
};
