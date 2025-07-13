import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Terminal, GitFork, FileText, Construction } from 'lucide-react';

const DevelopersPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Developer Hub
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Build, host, and contribute to the Silex ecosystem.
            </p>
          </header>

          <div className="space-y-12 text-lg text-gray-300">
            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <Terminal size={28} />
                Self-Hosting & Build Instructions
              </h2>
              <p>
                One of the core principles of Silex is control. You can host your own server instance for free. You can find the complete build and self-hosting instructions in our GitHub Readme.
              </p>
              <a 
                href="https://github.com/lucasdcampos/silexchat/blob/master/README.md"
                className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                Go to Instructions &rarr;
              </a>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <GitFork size={28} />
                Build Your Own Version
              </h2>
              <p>
                Silex is open source. You are encouraged to fork the project, explore the codebase, and build your own version. To get started, you will need to clone the project repository from GitHub.
              </p>
              <a 
                href="https://github.com/lucasdcampos/silexchat"
                className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                Clone the Repository &rarr;
              </a>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <FileText size={28} />
                API Documentation
              </h2>
              <div className="bg-gray-800/50 p-6 rounded-lg flex items-center gap-4 border border-gray-700/50">
                <Construction size={40} className="text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl text-gray-100">Coming Soon</h3>
                  <p className="text-gray-400">
                    Our official API documentation is not yet available. We are working hard to release it and will update this page as soon as it's ready.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DevelopersPage;
