import React from 'react';
import { Character } from '../types';
import { MessageSquare, Flame, Sparkles, Play, Heart } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onToggleFavorite?: (characterId: string) => void;
  isFavorite?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
}) => {
  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative rounded-2xl overflow-hidden bg-[#16161a] border border-[#272730] hover:border-[#ff3366] transition-all duration-300 shadow-xl cursor-pointer flex flex-col h-[340px] sm:h-[380px] transform hover:-translate-y-1.5"
    >
      {/* Background Image */}
      <img
        src={character.avatarUrl}
        alt={character.name}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />

      {/* Dark Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          {character.isNew && (
            <span className="bg-[#ff3366] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
              <ZapIcon className="w-3 h-3 fill-white" /> New
            </span>
          )}

          {character.isSeries && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
              <Play className="w-2.5 h-2.5 fill-white" /> Series
            </span>
          )}

          {character.isLive && (
            <span className="bg-[#ff3366] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
            </span>
          )}
        </div>

        {/* Favorite Heart button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(character.id);
            }}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'text-[#ff3366] fill-[#ff3366]' : 'text-gray-300'
              }`}
            />
          </button>
        )}
      </div>

      {/* Hover Quick Action Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <div className="bg-[#ff3366] text-white p-4 rounded-full shadow-2xl shadow-[#ff3366]/60 transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <MessageSquare className="w-6 h-6 fill-white" />
        </div>
      </div>

      {/* Bottom Text Details */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-[#ff6699] transition-colors">
            {character.name}
          </h3>
          <span className="text-lg font-bold text-gray-300">
            {character.age}
          </span>
        </div>

        <p className="text-xs text-gray-300 font-medium line-clamp-2 leading-relaxed">
          {character.tagline}
        </p>

        {/* Relationship Status pill if active */}
        {character.relationshipLevel && (
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-pink-300 bg-pink-950/60 border border-pink-500/30 px-2 py-0.5 rounded-md w-fit">
            <Flame className="w-3 h-3 text-[#ff3366] fill-[#ff3366]" />
            <span>{character.relationshipLevel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
