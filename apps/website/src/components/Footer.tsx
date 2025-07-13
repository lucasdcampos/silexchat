import { Link } from 'react-router-dom';
import { Code, FileLock, FileText } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 p-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p className="mb-4 sm:mb-0">&copy; {currentYear} <a className="text-emerald-400" href='/'>Silex Chat</a>. All Rights Reserved.</p>
        <div className="flex items-center space-x-6">
            <Link
            to="/blog"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            aria-label="Blog"
            >
                Blog
            </Link>
          <a
            href="/developers"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            aria-label="API Documentation"
          >
            <FileText size={16} /> API Docs
          </a>
          <a
            href="https://github.com/lucasdcampos/silexchat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            aria-label="View Source Code"
          >
            <Code size={16} /> Source Code
          </a>
          <Link
            to="/terms"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            aria-label="Terms and Privacy"
          >
            <FileLock size={16} /> Terms/Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;