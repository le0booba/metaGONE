import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => (
  <header className="w-full border-b border-slate-800 bg-black/20 sticky top-0 z-10">
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className="text-sm text-slate-400 mt-1">Protect your privacy by removing metadata from your media files.</p>
        </div>
        <div className="flex items-center space-x-3">
          <a href="https://gekkk.co/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 border border-slate-700 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors">
            gekkk.co
          </a>
          <a href="https://litterbox.catbox.moe/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 border border-slate-700 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors">
            litterbox
          </a>
          <a href="https://catbox.moe/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 border border-slate-700 rounded-md text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors">
            catbox
          </a>
        </div>
      </div>
    </div>
  </header>
);
