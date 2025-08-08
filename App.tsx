import React from 'react';
import { Header } from './components/Header';
import { MediaProcessor } from './components/MediaProcessor';
import { Footer } from './components/Footer';

/**
 * The main application component.
 * It sets up the overall layout of the application, including the header,
 * the main content area with the MediaProcessor, and the footer.
 */
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MediaProcessor />
      </main>
      <Footer />
    </div>
  );
}

export default App;
