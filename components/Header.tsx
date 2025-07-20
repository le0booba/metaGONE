import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => (
  <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
            <Logo className="h-8 w-auto text-slate-100"/>
            <p className="text-sm text-slate-400 mt-1">Protect your privacy by removing metadata from your media files.</p>
        </div>
        <div>
          <a href="https://gekkk.co/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 border border-slate-700 rounded-md text-slate-500 hover:text-sky-400 hover:border-sky-500 transition-colors">
            gekkk.co
          </a>
        </div>
      </div>
    </div>
  </header>
);
