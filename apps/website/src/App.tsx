import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <ShieldCheck className="mx-auto h-20 w-20 text-emerald-400 mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Silex Chat
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300">
              A secure, private, and open-source communication platform.
            </p>
          </div>
          <p className="mb-10 text-gray-400">
            Silex Chat is built with end-to-end encryption by default, ensuring that your conversations stay private and secure. No ads, no trackers. Just pure, uninterrupted communication.
          </p>
          <div className="flex flex-col items-center">
            <a
              href="https://app.silex.lucasof.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              Try it out
            </a>
            <p className="mt-4 text-sm text-yellow-500">
              Disclaimer: The application is still in the testing phase. Please <strong><a href='/about'>read more about it here</a></strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;