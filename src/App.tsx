/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { AvatarStories } from './components/AvatarStories';
import { CharacterGrid } from './components/CharacterGrid';
import { ChatWindow } from './components/ChatWindow';
import { CreateCharacterModal } from './components/CreateCharacterModal';
import { PremiumModal } from './components/PremiumModal';
import { ShortsViewer } from './components/ShortsViewer';
import { AuthModal } from './components/AuthModal';
import { CollectionView } from './components/CollectionModal';

import { Category, TabType, Character, ShortVideo } from './types';
import { INITIAL_CHARACTERS, AVATAR_STORIES, TANDY_SHORTS } from './data/characters';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Girls');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  const handleSelectCategory = (cat: Category) => {
    if (cat === activeCategory) return;
    setIsGridLoading(true);
    setActiveCategory(cat);
    setTimeout(() => {
      setIsGridLoading(false);
    }, 300);
  };

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tandy_favorites');
      return saved ? JSON.parse(saved) : ['roxy-1', 'sp00kybby-4'];
    } catch (e) {
      return ['roxy-1', 'sp00kybby-4'];
    }
  });

  // Characters with custom characters loaded from localStorage
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const savedCustom = localStorage.getItem('tandy_custom_characters');
      if (savedCustom) {
        const customList: Character[] = JSON.parse(savedCustom);
        if (Array.isArray(customList) && customList.length > 0) {
          return [...customList, ...INITIAL_CHARACTERS];
        }
      }
    } catch (e) {
      console.error('Failed to load custom characters:', e);
    }
    return INITIAL_CHARACTERS;
  });

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shortsModalOpen, setShortsModalOpen] = useState(false);
  const [selectedShort, setSelectedShort] = useState<ShortVideo | null>(null);

  // User auth state in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tandy_user_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('tandy_user_name') || '';
    } catch (e) {
      return '';
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tandy_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Save auth state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tandy_user_logged_in', String(isLoggedIn));
      localStorage.setItem('tandy_user_name', userName);
    } catch (e) {
      console.error('Failed to save user auth state:', e);
    }
  }, [isLoggedIn, userName]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setActiveTab('chat');
  };

  const handleToggleFavorite = (characterId: string) => {
    setFavorites((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  };

  const handleCreateCharacter = (newChar: Character) => {
    setCharacters((prev) => {
      const updated = [newChar, ...prev];
      // Save custom characters to localStorage
      try {
        const customChars = updated.filter((c) => c.isCustom);
        localStorage.setItem('tandy_custom_characters', JSON.stringify(customChars));
      } catch (e) {
        console.error('Failed to save custom character:', e);
      }
      return updated;
    });
    setSelectedCharacter(newChar);
    setActiveTab('chat');
  };

  const handleOpenShort = (short: ShortVideo) => {
    setSelectedShort(short);
    setShortsModalOpen(true);
  };

  const handleNavigate = (tab: TabType) => {
    if (tab === 'create') {
      setCreateModalOpen(true);
      return;
    }
    if (tab === 'premium') {
      setPremiumModalOpen(true);
      return;
    }
    if (tab === 'shorts') {
      if (TANDY_SHORTS.length > 0) {
        handleOpenShort(TANDY_SHORTS[0]);
      }
      return;
    }
    if (tab === 'chat' && !selectedCharacter) {
      // Pick first character if none selected yet
      if (characters.length > 0) {
        setSelectedCharacter(characters[0]);
      }
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-gray-100 flex flex-col font-sans selection:bg-[#ff3366] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onOpenPremium={() => setPremiumModalOpen(true)}
      />

      {/* Main Container Layout */}
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Left Fixed Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenPremium={() => setPremiumModalOpen(true)}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'chat' && selectedCharacter ? (
            <ChatWindow
              character={selectedCharacter}
              onBack={() => setActiveTab('home')}
              onOpenPremium={() => setPremiumModalOpen(true)}
            />
          ) : activeTab === 'collection' || activeTab === 'my-ai' ? (
            <CollectionView
              characters={characters}
              favorites={favorites}
              onSelectCharacter={handleSelectCharacter}
              onOpenCreateModal={() => setCreateModalOpen(true)}
              activeTab={activeTab}
            />
          ) : (
            <>
              {/* Hero Banner Carousel */}
              <HeroBanner
                shorts={TANDY_SHORTS}
                onSelectShort={handleOpenShort}
                onOpenPremium={() => setPremiumModalOpen(true)}
              />

              {/* Circle Avatar Stories Bar */}
              <AvatarStories
                stories={AVATAR_STORIES}
                characters={characters}
                onSelectCharacter={handleSelectCharacter}
                isLoading={isGridLoading}
              />

              {/* Character Grid with Search & Filters */}
              <CharacterGrid
                characters={characters}
                activeCategory={activeCategory}
                onSelectCharacter={handleSelectCharacter}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                shorts={TANDY_SHORTS}
                onSelectShort={handleOpenShort}
                onNavigateToShorts={() => {
                  if (TANDY_SHORTS.length > 0) handleOpenShort(TANDY_SHORTS[0]);
                }}
                isLoading={isGridLoading}
              />
            </>
          )}
        </main>
      </div>

      {/* Modals & Overlay Drawers */}
      <CreateCharacterModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateCharacter={handleCreateCharacter}
      />

      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        onUpgrade={() => {
          setIsLoggedIn(true);
          if (!userName) setUserName('Pro User');
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(name) => {
          setIsLoggedIn(true);
          setUserName(name);
        }}
      />

      {shortsModalOpen && selectedShort && (
        <ShortsViewer
          shorts={TANDY_SHORTS}
          initialShortId={selectedShort.id}
          onClose={() => setShortsModalOpen(false)}
          onSelectCharacter={handleSelectCharacter}
          characters={characters}
        />
      )}
    </div>
  );
}
