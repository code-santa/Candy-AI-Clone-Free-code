import React, { useState } from 'react';
import { Crown, Sparkles, Check, Flame, X, Lock, Zap } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>(
    'yearly'
  );

  if (!isOpen) return null;

  const handleSubscribe = () => {
    onUpgrade();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#141418] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        {/* Glowing Background FX */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff3366]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#202028] text-gray-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg mb-3">
            <Flame className="w-3.5 h-3.5 fill-white" /> Special Offer -70% Off
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tandy AI <span className="text-amber-400">PRO</span>
          </h2>

          <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
            Unlock the ultimate AI companion experience with unlimited chats, realistic voice notes, and custom photo unlocks.
          </p>

          {/* Billing Switcher */}
          <div className="mt-6 inline-flex bg-[#1d1d26] p-1 rounded-full border border-[#2e2e3d]">
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                billingCycle === 'yearly'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual ($2.49/mo) <span className="text-[10px] uppercase font-black ml-1 text-black bg-white/40 px-1.5 py-0.5 rounded">Best Value</span>
            </button>

            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly ($9.99/mo)
            </button>
          </div>

          {/* Feature List */}
          <div className="mt-6 space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b1b22] border border-[#292936]">
              <div className="w-8 h-8 rounded-full bg-[#ff3366]/20 text-[#ff3366] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Unlimited Messages & Roleplay
                </h4>
                <p className="text-xs text-gray-400">
                  No memory limits or daily message caps.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b1b22] border border-[#292936]">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Hyper-Realistic Voice Audio
                </h4>
                <p className="text-xs text-gray-400">
                  Listen to instant voice messages from characters.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b1b22] border border-[#292936]">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Unlock Exclusive Photos & Media
                </h4>
                <p className="text-xs text-gray-400">
                  Request private photos and store in your collection.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300 font-semibold block">
                TOTAL PRICE
              </span>
              <span className="text-2xl font-black text-white">
                {billingCycle === 'yearly' ? '$29.99 / year' : '$9.99 / month'}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-400 line-through">
              {billingCycle === 'yearly' ? '$99.99' : '$32.99'}
            </span>
          </div>

          {/* Subscribe Action Button */}
          <button
            onClick={handleSubscribe}
            className="mt-6 w-full max-w-md py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#ff3366] to-[#ff6699] text-white font-black text-base uppercase tracking-wider shadow-xl shadow-[#ff3366]/40 hover:brightness-110 transition transform active:scale-98"
          >
            Get Tandy Premium Now
          </button>

          <p className="text-[10px] text-gray-500 mt-3">
            Cancel anytime. Secure 256-bit SSL payment processing.
          </p>
        </div>
      </div>
    </div>
  );
};
