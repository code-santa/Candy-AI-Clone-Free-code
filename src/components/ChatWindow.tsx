import React, { useState, useEffect, useRef } from 'react';
import { Character, Message } from '../types';
import {
  Send,
  Image as ImageIcon,
  Mic,
  ArrowLeft,
  Volume2,
  VolumeX,
  Flame,
  Info,
  Sparkles,
  Heart,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface ChatWindowProps {
  character: Character;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  character,
  onBack,
  onOpenPremium,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      characterId: character.id,
      sender: 'character',
      text: character.greetingMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      emotion: 'happy',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Tell me more about yourself!',
    'What are you up to today?',
    'You look amazing in your photo! 🔥',
  ]);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [relationshipScore, setRelationshipScore] = useState(45); // 0 to 100
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech synthesis for character voice
  const speakText = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (playingAudioId === msgId) {
        setPlayingAudioId(null);
        return;
      }

      // Clean asterisks for speech
      const cleanText = text.replace(/\*.*?\*/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Select female or male pitch based on gender
      if (character.gender === 'Guys') {
        utterance.pitch = 0.9;
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 1.25;
        utterance.rate = 1.05;
      }

      utterance.onstart = () => setPlayingAudioId(msgId);
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      characterId: character.id,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          history: historyPayload,
          message: text.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        const charReply = data.data;

        const charMsg: Message = {
          id: `char-${Date.now()}`,
          characterId: character.id,
          sender: 'character',
          text: charReply.text || "I'm so glad we're chatting!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          emotion: charReply.emotion || 'flirty',
          isVoice: voiceEnabled,
          voiceDuration: '0:08',
        };

        setMessages((prev) => [...prev, charMsg]);

        // Auto speak if voice is enabled
        if (voiceEnabled) {
          speakText(charMsg.text, charMsg.id);
        }

        // Update quick replies if returned
        if (charReply.quickReplies && charReply.quickReplies.length > 0) {
          setQuickReplies(charReply.quickReplies);
        }

        // Increase relationship score slightly
        setRelationshipScore((prev) => Math.min(100, prev + 5));
      } else {
        throw new Error(data.error || 'Invalid API response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback friendly message
      const fallbackMsg: Message = {
        id: `char-err-${Date.now()}`,
        characterId: character.id,
        sender: 'character',
        text: `*smiles at you* I loved hearing that from you! Tell me more about what you're thinking.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        emotion: 'playful',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRequestPhoto = () => {
    if (character.unlockedPhotos && character.unlockedPhotos.length > 0) {
      const photoUrl = character.unlockedPhotos[0];
      const photoMsg: Message = {
        id: `char-photo-${Date.now()}`,
        characterId: character.id,
        sender: 'character',
        text: `*smiles shyly and sends you a photo* Here is a special picture I took just for you! 📸`,
        mediaUrl: photoUrl,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, photoMsg]);
    } else {
      // Prompt premium for photo unlock
      onOpenPremium();
    }
  };

  // Helper to render text with italicized action thoughts (*action*)
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span
            key={index}
            className="italic text-[#ff6699] font-medium block my-0.5"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getRelationshipTitle = (score: number) => {
    if (score < 30) return 'Acquaintance';
    if (score < 60) return 'Friend';
    if (score < 85) return 'Flame';
    return 'Soulmate';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-[#0e0e11] overflow-hidden relative">
      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col h-full bg-[#121214] relative">
        {/* Top Chat Header */}
        <div className="h-16 px-4 bg-[#16161a] border-b border-[#232328] flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-[#232328] text-gray-300 hover:text-white transition"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-[#ff3366] overflow-hidden">
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#16161a] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-extrabold text-base">
                  {character.name}, {character.age}
                </h3>
                <span className="bg-[#ff3366]/20 border border-[#ff3366]/50 text-[#ff6699] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-[#ff3366]" />
                  {getRelationshipTitle(relationshipScore)}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                {isTyping ? 'Typing a response...' : 'Online now'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-full transition ${
                voiceEnabled
                  ? 'bg-[#ff3366]/20 text-[#ff6699] border border-[#ff3366]/40'
                  : 'bg-[#1f1f26] text-gray-400 hover:text-white'
              }`}
              title={voiceEnabled ? 'Voice Enabled' : 'Voice Muted'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setShowDetailsDrawer(!showDetailsDrawer)}
              className="p-2 rounded-full bg-[#1f1f26] hover:bg-[#282833] text-gray-300 hover:text-white transition"
              title="Character Details"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Relationship Progress Banner */}
        <div className="bg-[#18181d] px-4 py-1.5 border-b border-[#232328] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#ff3366] fill-[#ff3366]" />
            <span>
              Relationship:{' '}
              <strong className="text-white">
                {getRelationshipTitle(relationshipScore)}
              </strong>
            </span>
          </div>
          <div className="w-36 h-2 bg-[#282833] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] transition-all duration-500"
              style={{ width: `${relationshipScore}%` }}
            />
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full border border-[#ff3366] overflow-hidden flex-shrink-0 mt-1">
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      isUser
                        ? 'bg-[#ff3366] text-white rounded-br-none'
                        : 'bg-[#1e1e24] border border-[#2d2d38] text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Photo Attachment if present */}
                    {msg.mediaUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-xs shadow-md">
                        <img
                          src={msg.mediaUrl}
                          alt="Character Attachment"
                          className="w-full h-auto object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Voice audio controls if character message */}
                    {!isUser && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className="px-2.5 py-1 rounded-full bg-[#2a2a35] hover:bg-[#353545] text-xs text-pink-300 font-bold flex items-center gap-1.5 transition"
                        >
                          {playingAudioId === msg.id ? (
                            <>
                              <Pause className="w-3 h-3 fill-pink-300" />
                              <span>Playing Voice...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-pink-300" />
                              <span>Play Voice Note</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] text-gray-500 block ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 mr-auto max-w-[75%]">
              <div className="w-8 h-8 rounded-full border border-[#ff3366] overflow-hidden flex-shrink-0">
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#1e1e24] border border-[#2d2d38] p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff3366] animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-[#ff3366] animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[#ff3366] animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Replies */}
        {quickReplies.length > 0 && !isTyping && (
          <div className="px-4 py-2 bg-[#141418] border-t border-[#232328] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex-shrink-0">
              Suggestions:
            </span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply)}
                className="px-3 py-1.5 rounded-full bg-[#1e1e26] hover:bg-[#ff3366] text-gray-300 hover:text-white text-xs font-medium border border-[#2e2e3a] hover:border-[#ff3366] whitespace-nowrap transition-all flex-shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input Controls Bar */}
        <div className="p-3 bg-[#16161a] border-t border-[#232328] flex items-center gap-2">
          <button
            onClick={handleRequestPhoto}
            className="p-2.5 rounded-full bg-[#202028] hover:bg-[#2a2a36] text-gray-300 hover:text-white transition border border-[#2e2e3d]"
            title="Request Photo"
          >
            <ImageIcon className="w-5 h-5 text-pink-400" />
          </button>

          <input
            type="text"
            placeholder={`Message ${character.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 bg-[#1d1d24] border border-[#2c2c38] focus:border-[#ff3366] text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder-gray-500 transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff3366]/40 hover:brightness-110 transition transform active:scale-95"
            aria-label="Send Message"
          >
            <Send className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>

      {/* Character Info Drawer Side Panel */}
      {showDetailsDrawer && (
        <div className="w-80 bg-[#141418] border-l border-[#232328] p-5 overflow-y-auto hidden md:block">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-2 border-[#ff3366] overflow-hidden shadow-xl mb-3">
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-black text-white">{character.name}</h3>
            <span className="text-xs text-gray-400 font-semibold mt-0.5">
              Age {character.age} • {character.ethnicity}
            </span>

            <div className="mt-4 w-full p-3 bg-[#1a1a20] rounded-2xl border border-[#272730] text-left">
              <h4 className="text-xs font-bold text-[#ff6699] uppercase tracking-wider mb-1">
                Personality Traits
              </h4>
              <p className="text-xs text-gray-300 font-medium">
                {character.personality}
              </p>
            </div>

            <div className="mt-3 w-full p-3 bg-[#1a1a20] rounded-2xl border border-[#272730] text-left">
              <h4 className="text-xs font-bold text-[#ff6699] uppercase tracking-wider mb-1">
                Backstory
              </h4>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                {character.backstory}
              </p>
            </div>

            <button
              onClick={onOpenPremium}
              className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
