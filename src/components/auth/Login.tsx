import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LifeOS</h1>
          <p className="text-gray-400">
            {isLoginMode ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F131F] border border-white/10 rounded-2xl p-8 shadow-2xl">
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
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
