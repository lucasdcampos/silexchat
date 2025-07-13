import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`;

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          Silex Chat
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/about" className={navLinkClasses}>About</NavLink>
          <NavLink to="/blog" className={navLinkClasses}>Blog</NavLink>
          <NavLink to="/developers" className={navLinkClasses}>Developers</NavLink>
        </div>

        <a 
          href="https://app.silex.lucasof.com"
          className="hidden md:inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg transition-colors"
        >
          Open Silex
        </a>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-4">
          <NavLink to="/about" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>About</NavLink>
          <NavLink to="/blog" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/developers" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Developers</NavLink>
          <a 
            href="https://silexchat.vercel.app"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-center font-bold py-2 px-5 rounded-lg transition-colors"
          >
            Open Silex
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;