import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials, RegisterCredentials } from '@/types';

const Login: React.FC = () => {
  const { login, register, error, clearError, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials | RegisterCredentials>({
    email: '',
    password: '',
    ...(isLoginMode ? {} : { name: '' }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLoginMode) {
        await login(formData as LoginCredentials);
      } else {
        await register(formData as RegisterCredentials);
      }
    } catch (err) {
      // Error is handled by context
      console.error('Auth error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setShowPassword(false); // Reset password visibility when switching modes
    setFormData({
      email: '',
      password: '',
      ...(!isLoginMode ? {} : { name: '' }),
    });
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Neon Purple Orb - Top Right */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px] animate-pulse pointer-events-none" />

      {/* Neon Indigo Orb - Bottom Left */}
      <div className="absolute bottom-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[150px] pointer-events-none" style={{ animation: 'pulse 4s ease-in-out infinite alternate' }} />

      {/* Neon Purple Orb - Center */}
      <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 left-20 w-20 h-20 border border-purple-500/30 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-32 right-32 w-16 h-16 border border-indigo-400/40 rounded-full" style={{ animation: 'bounce 3s ease-in-out infinite' }} />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" style={{ animation: 'ping 2s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 left-32 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" style={{ animation: 'ping 2.5s ease-in-out infinite' }} />

      {/* Neon Lines */}
      <div className="absolute top-0 left-1/4 w-px h-40 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute bottom-0 right-1/3 w-px h-32 bg-gradient-to-t from-transparent via-indigo-500/50 to-transparent" />

      {/* Horizontal Neon Accent Lines */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-l from-transparent via-indigo-400/60 to-transparent" />

      {/* Ring Elements */}
      <div className="absolute top-1/2 left-10 w-40 h-40 border border-purple-500/20 rounded-full" style={{ animation: 'pulse 5s ease-in-out infinite' }} />
      <div className="absolute top-1/2 left-10 w-32 h-32 border border-purple-400/10 rounded-full translate-x-4 translate-y-4" />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all duration-300 group z-20"
      >
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium hidden sm:block">Back to Home</span>
      </Link>

      <div className="w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 mb-4 relative">
            <Sparkles className="w-8 h-8 text-white" />
            {/* Glow ring around logo */}
            <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl -z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LifeOS</h1>
          <p className="text-gray-400">
            {isLoginMode ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0f1a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/5 relative">
          {/* Card glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field (only for registration) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={(formData as RegisterCredentials).name || ''}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading
                ? 'Please wait...'
                : isLoginMode
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {isLoginMode
                ? "Don't have an account? "
                : 'Already have an account? '}
              <span className="font-semibold text-indigo-400">
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Secure authentication powered by LifeOS
        </p>
      </div>
    </div>
  );
};

export default Login;
