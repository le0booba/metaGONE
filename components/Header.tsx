
import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => (
  <header className="w-full border-b border-slate-700 bg-slate-700/80 backdrop-blur-sm sticky top-0 z-10">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className="text-sm text-slate-300 mt-1">Protect your privacy by removing metadata from your media files.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 font-mono w-full sm:w-auto">
          <a href="https://gekkk.co/" target="_blank" rel="noopener noreferrer" className="min-w-[100px] max-w-full sm:w-auto text-center inline-block px-3 py-1 border border-slate-800 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors mx-4 sm:mx-0">
            gekkk.co
          </a>
          <a href="https://litterbox.catbox.moe/" target="_blank" rel="noopener noreferrer" className="min-w-[100px] max-w-full sm:w-auto text-center inline-block px-3 py-1 border border-slate-800 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors mx-4 sm:mx-0">
            litterbox.catbox.moe
          </a>
          <a href="https://catbox.moe/" target="_blank" rel="noopener noreferrer" className="min-w-[100px] max-w-full sm:w-auto text-center inline-block px-3 py-1 border border-slate-800 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors mx-4 sm:mx-0">
            catbox.moe
          </a>
        </div>
      </div>
    </div>
  </header>
);
