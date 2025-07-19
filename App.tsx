
import React from 'react';
import { Header } from './components/Header';
import { MediaProcessor } from './components/MediaProcessor';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 md:p-8">
            <MediaProcessor />
          </div>
        </div>
      </main>
      <div className="text-center pb-4">
        <a href="https://gekkk.co/" target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 border border-slate-700 rounded-md text-slate-500 hover:text-sky-400 hover:border-sky-500 transition-colors">
          gekkk.co
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default App;
