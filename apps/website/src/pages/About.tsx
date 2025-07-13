import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, Server, AlertTriangle, GitBranch } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              About Silex Chat
            </h1>
            <p className="text-lg text-gray-400 mt-2">Our story, our mission, and where we're headed.</p>
          </header>

        <section className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-6 mt-16">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
                <AlertTriangle size={28} />
                Current Status & Disclaimer
              </h2>
              <div className="space-y-4 text-yellow-200">
                <p>
                  Silex Chat is in the very early stages of development. It is currently a proof-of-concept and should be treated as a <strong>testing ground only</strong>.
                </p>
                <p>
                  Crucial features, especially around end-to-end encryption and other security measures, are still missing or incomplete. For this reason, it is <strong>not ready for production use</strong>.
                </p>
                <p>
                  <strong>Please be aware:</strong> All data currently on the platform, including messages and user accounts, will be permanently deleted from the database when the first stable version is launched.
                </p>
              </div>
            </section>

            <br />

          <div className="space-y-12 text-lg text-gray-300">
            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <Users size={28} />
                Our Mission
              </h2>
              <p>
                Silex Chat was born from a simple idea: communication should be private, secure, and under your control. We are a project run by a very small team aiming to create a communication platform where users can freely host their own server instances, modify the code, and own their data.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <Server size={28} />
                The Origin Story
              </h2>
              <p>
                The idea for Silex wasn't born in a boardroom. It started after a friend of the developers was banned from a major chat platform for a completely stupid reason. Frustrated with centralized control and arbitrary rules, we decided to build our own space—a place where we could set the rules and ensure our group's conversations would never be silenced. What started as a personal project has grown into a mission to provide that same freedom to everyone.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-100 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-3">
                <GitBranch size={28} />
                What about other solutions?
              </h2>
              <p>
                You might ask: "With so many great communication tools already available, why create another one from scratch?" The answer is simple: we wanted to build our own platform, our way. That's the beauty of the open-source world—there will always be multiple solutions, each with its own philosophy and vision.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;