
import React from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={onLogoClick}>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase italic leading-none transition-transform active:scale-95">
              HADI<span className="text-blue-600">KIT</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-xl mx-12">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Find your favorite kit..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-[#111] border border-white/5 rounded-2xl py-3 px-6 pl-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-sm text-white placeholder-gray-600"
              />
              <svg className="absolute left-4 top-3.5 h-4 w-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
             <button className="hidden sm:block bg-white text-black px-6 py-3 rounded-2xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
              Account
            </button>
            <button className="p-2 text-gray-400 hover:text-white md:hidden transition-colors">
               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;