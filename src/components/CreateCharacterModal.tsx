import React, { useState } from 'react';
import { Character, Category } from '../types';
import { Wand2, Sparkles, X, Image as ImageIcon, Check } from 'lucide-react';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharacter: (newChar: Character) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
];

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  onClose,
  onCreateCharacter,
}) => {
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(21);
  const [gender, setGender] = useState<Category>('Girls');
  const [style, setStyle] = useState<'Realistic' | 'Anime'>('Realistic');
  const [personality, setPersonality] = useState('Sweet, caring, adventurous');
  const [tagline, setTagline] = useState('');
  const [backstory, setBackstory] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-character-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || 'Sweet gamer companion',
          style,
          gender,
          personality,
        }),
      });

      const data = await res.json();
      if (data.success && data.character) {
        const c = data.character;
        setName(c.name || 'Nova');
        if (c.age) setAge(c.age);
        if (c.tagline) setTagline(c.tagline);
        if (c.backstory) setBackstory(c.backstory);
        if (c.greetingMessage) setGreetingMessage(c.greetingMessage);
        if (c.personality) setPersonality(c.personality);
      }
    } catch (err) {
      console.error('AI Generate Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChar: Character = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      age,
      gender,
      style,
      ethnicity: 'Custom',
      tags: ['All'],
      avatarUrl,
      tagline: tagline || `Meet ${name}, your custom AI character on Tandy AI.`,
      backstory: backstory || `${name} is happy to be chatting with you!`,
      personality: personality || 'Friendly and engaging',
      greetingMessage:
        greetingMessage || `Hey there! I am ${name}. I'm so excited to get to know you!`,
      isCustom: true,
      relationshipLevel: 'Friend',
    };

    onCreateCharacter(newChar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#16161a] border border-[#2e2e38] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#272732]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff3366] to-[#ff6699] flex items-center justify-center text-white shadow-lg">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Create AI Character
              </h2>
              <p className="text-xs text-gray-400">
                Design your dream companion with custom personality & backstory.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#202028] text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Quick Generator Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-[#121214] border border-pink-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ff3366]" /> AI Assistant Generator
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. Sassy cyberpunk netrunner who loves coffee..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-[#121216] border border-[#2a2a36] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
            />

            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Auto-Fill'}</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Age
              </label>
              <input
                type="number"
                min={18}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Category
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Category)}
                className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
              >
                <option value="Girls">Girls</option>
                <option value="Anime">Anime</option>
                <option value="Guys">Guys</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Art Style
              </label>
              <select
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value as 'Realistic' | 'Anime')
                }
                className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
              >
                <option value="Realistic">Realistic</option>
                <option value="Anime">Anime</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Personality Traits
            </label>
            <input
              type="text"
              placeholder="e.g. Playful, witty, adventurous, romantic"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Tagline (Teaser sentence)
            </label>
            <input
              type="text"
              placeholder="e.g. Your secret neighbor who invites you over for late night tea."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              First Greeting Message
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Hey! I was hoping you'd come talk to me today..."
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              className="w-full bg-[#18181c] border border-[#292934] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#ff3366]"
            />
          </div>

          {/* Select Avatar Image */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-2">
              Select Avatar Photo
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {PRESET_AVATARS.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setAvatarUrl(url)}
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition ${
                    avatarUrl === url
                      ? 'border-[#ff3366] scale-105 shadow-lg'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Preset Avatar"
                    className="w-full h-full object-cover"
                  />
                  {avatarUrl === url && (
                    <div className="absolute inset-0 bg-[#ff3366]/40 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#272732]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#3f3f4e] text-gray-300 font-bold text-xs uppercase"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#ff3366]/40 hover:brightness-110"
            >
              Create & Chat Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
