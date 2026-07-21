import React, { useState } from 'react';
import { StoryItem, Character } from '../types';
import { Play, Sparkles, MessageSquare, X } from 'lucide-react';

interface AvatarStoriesProps {
  stories: StoryItem[];
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  isLoading?: boolean;
}

export const AvatarStories: React.FC<AvatarStoriesProps> = ({
  stories,
  characters,
  onSelectCharacter,
  isLoading = false,
}) => {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  if (isLoading) {
    return (
      <div className="w-full my-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 animate-pulse">
              <div className="p-0.5 rounded-full bg-[#22222a]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1b1b22] border-2 border-[#22222a]" />
              </div>
              <div className="h-3 w-12 bg-[#22222a] rounded-full mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleOpenStory = (story: StoryItem) => {
    setActiveStory(story);
  };

  const handleStartChatFromStory = (story: StoryItem) => {
    const foundChar = characters.find((c) => c.id === story.characterId);
    if (foundChar) {
      onSelectCharacter(foundChar);
    }
    setActiveStory(null);
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleOpenStory(story)}
            className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            {/* Glowing Ring Container */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#ff3366] via-[#ff6699] to-[#ff3366] shadow-lg shadow-[#ff3366]/20 group-hover:scale-105 group-hover:shadow-[#ff3366]/50 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#121214] bg-black relative">
                <img
                  src={story.avatarUrl}
                  alt={story.characterName}
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-110 transition-transform duration-500"
                />

                {story.isLive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#ff3366] text-white text-[9px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wider shadow">
                    LIVE
                  </div>
                )}
              </div>
            </div>

            {/* Character Name */}
            <span className="text-xs font-semibold text-gray-200 group-hover:text-white max-w-[80px] truncate text-center">
              {story.characterName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#16161a] border border-[#2e2e38] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Story Header */}
            <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#ff3366] overflow-hidden">
                  <img
                    src={activeStory.avatarUrl}
                    alt={activeStory.characterName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">
                    {activeStory.characterName}
                  </h4>
                  <span className="text-xs text-[#ff3366] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ff3366] animate-ping" />
                    Story Preview
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Media */}
            <div className="relative h-96 w-full overflow-hidden bg-black">
              <img
                src={activeStory.storyMediaUrl}
                alt={activeStory.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-medium bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  "{activeStory.caption}"
                </p>
              </div>
            </div>

            {/* Story Actions */}
            <div className="p-4 bg-[#121214] flex items-center justify-between border-t border-[#232328]">
              <button
                onClick={() => handleStartChatFromStory(activeStory)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff3366]/40 hover:brightness-110"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat with {activeStory.characterName}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
