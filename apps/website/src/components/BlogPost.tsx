import React from 'react';

interface BlogPostProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  return (
    <article className="bg-gray-800/50 rounded-lg p-6 md:p-8 shadow-lg border border-gray-700/50">
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-400 mb-6">{date}</p>
      <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 max-w-none">
        {children}
      </div>
    </article>
  );
};

export default BlogPost;