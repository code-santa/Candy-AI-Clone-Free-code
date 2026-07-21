import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name.trim() || email.split('@')[0] || 'User';
    onLoginSuccess(displayName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#16161a] border border-[#2e2e38] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#202028] text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff3366] to-[#ff6699] flex items-center justify-center mx-auto text-white text-2xl font-black shadow-lg shadow-[#ff3366]/40 mb-3">
            t
          </div>
          <h3 className="text-2xl font-black text-white">
            {isSignUp ? 'Create Free Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {isSignUp
              ? 'Join Tandy AI to save chat histories & custom characters.'
              : 'Log in to continue your AI companion conversations.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1c1c22] border border-[#2c2c38] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#ff3366]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c38] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#ff3366]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1c22] border border-[#2c2c38] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#ff3366]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#ff3366]/40 hover:brightness-110 mt-2"
          >
            {isSignUp ? 'Sign Up Free' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-[#272732]">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-gray-400 hover:text-white font-semibold transition"
          >
            {isSignUp
              ? 'Already have an account? Log In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
