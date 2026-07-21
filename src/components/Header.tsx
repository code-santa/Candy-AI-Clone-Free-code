import React from 'react';
import { Menu, Sparkles, User, Search, Flame } from 'lucide-react';
import { Category, TabType } from '../types';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onOpenPremium: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onNavigate,
  onOpenAuth,
  onToggleSidebar,
  isLoggedIn,
  userName,
  onOpenPremium,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214] border-b border-[#232328] text-white px-4 h-16 flex items-center justify-between shadow-md">
      {/* Left side: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-[#1f1f24] text-gray-300 hover:text-white transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3366] to-[#ff6699] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#ff3366]/30 group-hover:scale-105 transition-transform">
            t
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
            tandy<span className="text-[#ff3366]">.ai</span>
          </span>
        </div>
      </div>

      {/* Middle: Category Switcher (Girls, Anime, Guys) */}
      <div className="hidden md:flex items-center gap-1 bg-[#18181c] p-1 rounded-full border border-[#27272e]">
        <button
          onClick={() => {
            onSelectCategory('Girls');
            onNavigate('home');
          }}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'Girls'
              ? 'bg-[#ff3366] text-white shadow-md shadow-[#ff3366]/40'
              : 'text-gray-400 hover:text-white hover:bg-[#232329]'
          }`}
        >
          <span className="text-base">♀</span> Girls
        </button>

        <button
          onClick={() => {
            onSelectCategory('Anime');
            onNavigate('home');
          }}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'Anime'
              ? 'bg-[#ff3366] text-white shadow-md shadow-[#ff3366]/40'
              : 'text-gray-400 hover:text-white hover:bg-[#232329]'
          }`}
        >
          <span className="text-base">🌀</span> Anime
        </button>

        <button
          onClick={() => {
            onSelectCategory('Guys');
            onNavigate('home');
          }}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'Guys'
              ? 'bg-[#ff3366] text-white shadow-md shadow-[#ff3366]/40'
              : 'text-gray-400 hover:text-white hover:bg-[#232329]'
          }`}
        >
          <span className="text-base">♂</span> Guys
        </button>
      </div>

      {/* Right side: Auth buttons / Premium */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPremium}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:brightness-110 transition"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>PRO -70%</span>
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2 bg-[#1d1d23] border border-[#2e2e38] rounded-full px-3 py-1 text-sm font-medium text-gray-200">
            <User className="w-4 h-4 text-[#ff3366]" />
            <span>{userName || 'User'}</span>
          </div>
        ) : (
          <>
            <button
              onClick={onOpenAuth}
              className="bg-[#ff3366] hover:bg-[#e62e5c] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full transition shadow-md shadow-[#ff3366]/30 whitespace-nowrap"
            >
              Create Free Account
            </button>
            <button
              onClick={onOpenAuth}
              className="hidden sm:block border border-[#3f3f4e] hover:border-white text-gray-300 hover:text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </header>
  );
};
