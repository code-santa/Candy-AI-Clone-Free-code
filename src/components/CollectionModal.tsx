import React from 'react';
import { Character } from '../types';
import { FolderHeart, Heart, Sparkles, MessageSquare, Plus } from 'lucide-react';

interface CollectionViewProps {
  characters: Character[];
  favorites: string[];
  onSelectCharacter: (char: Character) => void;
  onOpenCreateModal: () => void;
  activeTab: 'collection' | 'my-ai';
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  characters,
  favorites,
  onSelectCharacter,
  onOpenCreateModal,
  activeTab,
}) => {
  const favoriteChars = characters.filter((c) => favorites.includes(c.id));
  const customChars = characters.filter((c) => c.isCustom);

  return (
    <div className="w-full my-6 space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {activeTab === 'collection' ? (
              <>
                <FolderHeart className="w-8 h-8 text-[#ff3366]" /> Your Collection
              </>
            ) : (
              <>
                <Heart className="w-8 h-8 text-[#ff3366]" /> My AI Companions
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {activeTab === 'collection'
              ? 'Manage your saved favorite characters & unlocked media.'
              : 'Your custom created AI characters and active companions.'}
          </p>
        </div>

        {activeTab === 'my-ai' && (
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3366]/40 hover:brightness-110 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Character</span>
          </button>
        )}
      </div>

      {activeTab === 'collection' ? (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Favorite Characters ({favoriteChars.length})</h3>
          {favoriteChars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteChars.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="bg-[#16161a] border border-[#272730] hover:border-[#ff3366] rounded-2xl overflow-hidden p-3 cursor-pointer group transition"
                >
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-2">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <h4 className="text-white font-bold text-base">{char.name}, {char.age}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{char.tagline}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#16161a] border border-[#272730] rounded-2xl p-8 text-center text-gray-400">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">No favorites added yet.</p>
              <p className="text-xs text-gray-500">Click the heart icon on any character card to save them here.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Custom Characters ({customChars.length})</h3>
          {customChars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customChars.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="bg-[#16161a] border border-[#272730] hover:border-[#ff3366] rounded-2xl p-4 cursor-pointer group flex items-center gap-4 transition"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#ff3366]">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base">{char.name}, {char.age}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">{char.tagline}</p>
                    <span className="text-[10px] text-pink-400 font-bold uppercase mt-1 inline-block">
                      Custom AI • Active
                    </span>
                  </div>
                  <button className="p-2.5 rounded-full bg-[#ff3366] text-white">
                    <MessageSquare className="w-4 h-4 fill-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#16161a] border border-[#272730] rounded-2xl p-8 text-center text-gray-400">
              <Sparkles className="w-12 h-12 text-[#ff3366] mx-auto mb-2" />
              <p className="text-sm font-semibold">You haven't created any custom characters yet.</p>
              <button
                onClick={onOpenCreateModal}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#ff3366] text-white font-bold text-xs uppercase tracking-wider"
              >
                Create Your First Character
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
