import React, { useState, useMemo } from 'react';
import { Character, FilterTag, Category, ShortVideo } from '../types';
import { CharacterCard } from './CharacterCard';
import { Search, Flame, Clapperboard, Play, Sparkles } from 'lucide-react';

interface CharacterGridProps {
  characters: Character[];
  activeCategory: Category;
  onSelectCharacter: (character: Character) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  shorts: ShortVideo[];
  onSelectShort: (short: ShortVideo) => void;
  onNavigateToShorts: () => void;
}

const FILTER_TAGS: FilterTag[] = [
  'All',
  'Caucasian',
  'Latina',
  'Asian',
  '18-21',
  'Blonde',
  'Brunette',
  'Redhead',
  'Anime',
  'Goth',
  'Fantasy',
  'Shorts',
];

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  activeCategory,
  onSelectCharacter,
  favorites,
  onToggleFavorite,
  shorts,
  onSelectShort,
  onNavigateToShorts,
}) => {
  const [selectedTag, setSelectedTag] = useState<FilterTag>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      // Category check
      if (char.gender !== activeCategory) return false;

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = char.name.toLowerCase().includes(q);
        const matchesTagline = char.tagline.toLowerCase().includes(q);
        const matchesTraits = char.personality.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesTraits) return false;
      }

      // Tag filter
      if (selectedTag !== 'All' && selectedTag !== 'Shorts') {
        if (!char.tags.includes(selectedTag)) return false;
      }

      return true;
    });
  }, [characters, activeCategory, searchQuery, selectedTag]);

  return (
    <div className="w-full my-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-[#ff3366]">Tandy AI</span> Characters
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Explore interactive AI companions ready to chat, roleplay, and connect with you.
          </p>
        </div>
      </div>

      {/* Search Bar + Filter Tags Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative min-w-[240px] md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18181c] border border-[#272730] focus:border-[#ff3366] text-white text-sm rounded-full pl-10 pr-4 py-2.5 outline-none transition placeholder-gray-500"
          />
        </div>

        {/* Horizontal Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {FILTER_TAGS.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  if (tag === 'Shorts') {
                    onNavigateToShorts();
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#ff3366] text-white border-[#ff3366] shadow-lg shadow-[#ff3366]/30'
                    : 'bg-[#18181c] text-gray-300 border-[#272730] hover:border-gray-500 hover:text-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredCharacters.map((char, index) => (
          <React.Fragment key={char.id}>
            <CharacterCard
              character={char}
              onSelect={onSelectCharacter}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(char.id)}
            />

            {/* Insert Tandy Shorts Promotional Card after 3rd item */}
            {index === 2 && shorts.length > 0 && (
              <div
                onClick={() => onSelectShort(shorts[0])}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-[#121214] border-2 border-pink-500/50 hover:border-[#ff3366] transition-all duration-300 cursor-pointer shadow-2xl flex flex-col justify-between p-5 group h-[340px] sm:h-[380px] transform hover:-translate-y-1.5"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center filter brightness-50 opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-[#ff3366] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                    <Clapperboard className="w-3 h-3 fill-white" /> SHORTS
                  </span>
                  <span className="text-xs text-pink-300 font-bold bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/40">
                    EXCLUSIVE
                  </span>
                </div>

                <div className="relative z-10 text-center my-auto">
                  <div className="w-14 h-14 rounded-full bg-[#ff3366] text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#ff3366]/80 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white text-white ml-1" />
                  </div>
                  <h4 className="text-xl font-black text-white mt-3 uppercase tracking-wider">
                    Watch <span className="text-[#ff6699]">Shorts</span>
                  </h4>
                  <p className="text-xs text-gray-300 font-medium mt-1">
                    Interactive video episodes & exclusive character reels
                  </p>
                </div>

                <div className="relative z-10">
                  <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#ff3366]/40 hover:brightness-110">
                    Watch Candy Shorts
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-16 bg-[#16161a] rounded-2xl border border-[#272730] p-8">
          <div className="w-16 h-16 rounded-full bg-[#ff3366]/10 text-[#ff3366] flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Characters Found</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or filter tags to find matching AI companions.
          </p>
          <button
            onClick={() => {
              setSelectedTag('All');
              setSearchQuery('');
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#ff3366] text-white font-bold text-xs uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
