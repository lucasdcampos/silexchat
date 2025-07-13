import React from 'react';
import Footer from '../components/Footer';
import BlogPost from '../components/BlogPost';
import Header from '../components/Header';

const BlogPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
        <Header />
      <main className="flex-grow container mx-auto px-6 py-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Silex Chat Blog
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Updates, announcements, and thoughts on privacy and security.
            </p>
          </header>

          <div className="space-y-12">

            <BlogPost title="The First Version of Silex Chat is Coming Soon" date="July 15, 2025">
              <p>
                We are putting the final touches on the first official version of Silex Chat and are excited to announce that it will be released very soon. This initial release will focus on providing a stable and secure core messaging experience.
              </p>
              <p className="mt-4">
                This is just the beginning of our journey. We are committed to continuously improving Silex Chat and will be rolling out frequent updates with new features, performance enhancements, and security improvements. Stay tuned for the official launch!
              </p>
            </BlogPost>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;