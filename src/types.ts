export type Category = 'Girls' | 'Anime' | 'Guys';

export type FilterTag =
  | 'All'
  | 'Caucasian'
  | 'Latina'
  | 'Asian'
  | '18-21'
  | 'Blonde'
  | 'Brunette'
  | 'Redhead'
  | 'Anime'
  | 'Goth'
  | 'Fantasy'
  | 'Shorts';

export type TabType =
  | 'home'
  | 'discover'
  | 'chat'
  | 'collection'
  | 'create'
  | 'my-ai'
  | 'premium'
  | 'shorts';

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: Category;
  style: 'Realistic' | 'Anime';
  ethnicity: string;
  tags: FilterTag[];
  avatarUrl: string;
  bannerUrl?: string;
  tagline: string;
  backstory: string;
  personality: string;
  greetingMessage: string;
  isNew?: boolean;
  isLive?: boolean;
  isSeries?: boolean;
  isCustom?: boolean;
  relationshipLevel?: 'Acquaintance' | 'Friend' | 'Flame' | 'Soulmate';
  unlockedPhotos?: string[];
  unreadCount?: number;
}

export interface Message {
  id: string;
  characterId: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
  mediaUrl?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  emotion?: string;
}

export interface StoryItem {
  id: string;
  characterId: string;
  characterName: string;
  avatarUrl: string;
  storyMediaUrl: string;
  caption: string;
  isLive?: boolean;
}

export interface ShortVideo {
  id: string;
  title: string;
  characterName: string;
  characterAvatar: string;
  thumbnailUrl: string;
  videoUrl?: string;
  views: string;
  likes: string;
  duration: string;
  description: string;
}

export interface UserProfile {
  name: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  diamonds: number;
  unlockedMedia: string[];
}
