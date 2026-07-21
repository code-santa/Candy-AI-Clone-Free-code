import React from 'react';
import {
  Home,
  Compass,
  MessageSquare,
  FolderHeart,
  Wand2,
  Heart,
  Crown,
  Globe,
  MessageCircle,
  HelpCircle,
  Mail,
  X,
  Clapperboard,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  unreadChatCount?: number;
  onOpenPremium: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  isOpen,
  onClose,
  unreadChatCount = 0,
  onOpenPremium,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'discover' as TabType, label: 'Discover', icon: Compass },
    {
      id: 'chat' as TabType,
      label: 'Chat',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    { id: 'shorts' as TabType, label: 'Shorts', icon: Clapperboard, badgeText: 'NEW' },
    { id: 'collection' as TabType, label: 'Collection', icon: FolderHeart },
    { id: 'create' as TabType, label: 'Create Character', icon: Wand2 },
    { id: 'my-ai' as TabType, label: 'My AI', icon: Heart },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-[#121214] border-r border-[#232328] z-40 transition-transform duration-300 ease-in-out flex flex-col justify-between p-3 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          {/* Mobile close header */}
          <div className="flex items-center justify-between p-2 lg:hidden border-b border-[#232328] mb-2">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Nav Buttons */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#212128] text-white border-l-4 border-[#ff3366] shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-[#ff3366]' : 'text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="bg-[#ff3366] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}

                {item.badgeText && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badgeText}
                  </span>
                )}
              </button>
            );
          })}

          {/* Premium Special Tab */}
          <button
            onClick={() => {
              onOpenPremium();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-300 hover:text-amber-200 bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/30 hover:border-amber-500/60 transition mt-2 group"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Premium</span>
            </div>
            <span className="bg-[#ff3366] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
              -70%
            </span>
          </button>
        </div>

        {/* Footer Navigation Links */}
        <div className="pt-4 mt-6 border-t border-[#212128] space-y-1">
          <button className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1e] transition">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span>English</span>
            </div>
            <span className="text-sm">🇺🇸</span>
          </button>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1e] transition"
          >
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span>Discord</span>
          </a>

          <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1e] transition">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Help Center</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1e] transition">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>Contact Us</span>
          </button>

          <div className="pt-3 px-2 text-[10px] text-gray-600 text-center">
            © 2026 Tandy AI Inc. All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
};
