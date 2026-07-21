import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Lock, Sparkles, Flame } from 'lucide-react';
import { ShortVideo } from '../types';

interface HeroBannerProps {
  shorts: ShortVideo[];
  onSelectShort: (short: ShortVideo) => void;
  onOpenPremium: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  shorts,
  onSelectShort,
  onOpenPremium,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (shorts.length || 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [shorts.length]);

  if (!shorts || shorts.length === 0) return null;

  const currentShort = shorts[currentIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#2e2e38] shadow-2xl bg-[#16161a] group">
      {/* Background Image with Ambient Glow */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
        <img
          src={currentShort.thumbnailUrl}
          alt={currentShort.title}
          className="w-full h-full object-cover object-center filter brightness-90 transition-all duration-700 transform group-hover:scale-105"
        />

        {/* Dark & Neon Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e11] via-[#0e0e11]/40 to-transparent" />

        {/* Neon Content Banner Overlay */}
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end md:justify-center items-start">
          <div className="inline-flex items-center gap-2 bg-[#ff3366] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#ff3366]/40 mb-3 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-white" /> NEW!
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md max-w-xl leading-tight">
            TANDY <span className="text-[#ff6699] font-black">SHORTS</span>
          </h2>

          <p className="text-sm sm:text-lg text-gray-200 font-semibold tracking-wide mt-1 uppercase max-w-lg drop-shadow">
            NEW EPISODES AVAILABLE
          </p>

          <p className="text-xs sm:text-sm text-gray-300 max-w-md line-clamp-2 mt-2 hidden sm:block">
            {currentShort.description}
          </p>

          {/* Action Button */}
          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={() => onSelectShort(currentShort)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-[#ff3366]/40 hover:brightness-110 transform active:scale-95 transition"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
              </div>
              <span>WATCH NOW</span>
            </button>

            <button
              onClick={onOpenPremium}
              className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-full bg-[#1e1e26]/80 hover:bg-[#282833] text-amber-300 font-bold text-sm border border-amber-500/40 backdrop-blur-md transition"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Unlock Unlimited</span>
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % shorts.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-4 right-6 flex items-center gap-1.5">
          {shorts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-[#ff3366]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
