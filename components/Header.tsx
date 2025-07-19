
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            metaGONE
            </h1>
            <p className="text-sm text-slate-400">Protect your privacy by removing metadata from your media files.</p>
        </div>
      </div>
    </div>
  </header>
);