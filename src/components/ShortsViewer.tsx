import React, { useState } from 'react';
import { ShortVideo, Character } from '../types';
import { Play, Pause, Heart, MessageSquare, Share2, X, ChevronUp, ChevronDown } from 'lucide-react';

interface ShortsViewerProps {
  shorts: ShortVideo[];
  initialShortId?: string;
  onClose: () => void;
  onSelectCharacter: (char: Character) => void;
  characters: Character[];
}

export const ShortsViewer: React.FC<ShortsViewerProps> = ({
  shorts,
  initialShortId,
  onClose,
  onSelectCharacter,
  characters,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const foundIdx = shorts.findIndex((s) => s.id === initialShortId);
    return foundIdx >= 0 ? foundIdx : 0;
  });

  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!shorts || shorts.length === 0) return null;

  const currentShort = shorts[currentIndex];
  const matchedChar = characters.find(
    (c) => c.name.toLowerCase() === currentShort.characterName.toLowerCase()
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shorts.length);
    setIsLiked(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
    setIsLiked(false);
  };

  const handleStartChat = () => {
    if (matchedChar) {
      onSelectCharacter(matchedChar);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-md h-full sm:h-[800px] bg-[#121214] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentShort.thumbnailUrl}
            alt={currentShort.title}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff3366] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
              Tandy Shorts
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Play/Pause Overlay */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          )}
        </div>

        {/* Right Side Action Column */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black backdrop-blur-md"
            aria-label="Previous Video"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:scale-110 transition">
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'text-[#ff3366] fill-[#ff3366]' : 'text-white'
                }`}
              />
            </div>
            <span className="text-xs font-bold">{currentShort.likes}</span>
          </button>

          <button
            onClick={handleStartChat}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-[#ff3366] backdrop-blur-md flex items-center justify-center shadow-lg shadow-[#ff3366]/50 hover:scale-110 transition">
              <MessageSquare className="w-6 h-6 fill-white" />
            </div>
            <span className="text-xs font-bold">Chat</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:scale-110 transition">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Share</span>
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black backdrop-blur-md"
            aria-label="Next Video"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Details Overlay */}
        <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#ff3366] overflow-hidden">
              <img
                src={currentShort.characterAvatar}
                alt={currentShort.characterName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-extrabold text-base">
                {currentShort.characterName}
              </h3>
              <p className="text-xs text-pink-400 font-semibold">
                {currentShort.views} Views
              </p>
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-100">{currentShort.title}</h4>
          <p className="text-xs text-gray-300 line-clamp-2 mt-1">
            {currentShort.description}
          </p>

          <button
            onClick={handleStartChat}
            className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3366]/40 hover:brightness-110 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Start Chatting with {currentShort.characterName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
