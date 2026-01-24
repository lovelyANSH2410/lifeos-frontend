import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, Key, User, FileText, Tag } from 'lucide-react';
import type { CreateVaultItemData, VaultItem } from '@/types';

interface CredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVaultItemData) => Promise<void>;
  credential?: VaultItem | null;
  isLoading?: boolean;
}

const categories = [
  { value: 'credentials', label: 'Credentials', emoji: '🔑' },
  { value: 'bank', label: 'Bank', emoji: '🏦' },
  { value: 'utility', label: 'Utility', emoji: '🔧' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const;

const CredentialForm: React.FC<CredentialFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  credential,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateVaultItemData>({
    title: credential?.title || '',
    username: credential?.username || '',
    password: '',
    category: credential?.category || 'credentials',
    notes: credential?.notes || '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (credential && isOpen) {
      setFormData({
        title: credential.title,
        username: credential.username || '',
        password: '', // Never pre-fill password
        category: credential.category,
        notes: credential.notes || '',
      });
    } else if (!credential && isOpen) {
      setFormData({
        title: '',
        username: '',
        password: '',
        category: 'credentials',
        notes: '',
      });
    }
  }, [credential, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!formData.password.trim()) {
      alert('Password is required');
      return;
    }

    await onSubmit(formData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {credential ? 'Edit Credential' : 'Add New Credential'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Netflix, Gmail, Bank Account"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
              required
              maxLength={200}
              disabled={isLoading}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Username (Optional)
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="e.g., user@example.com"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
              maxLength={500}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all font-mono"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
              disabled={isLoading}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes..."
              rows={3}
              maxLength={1000}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : credential ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default CredentialForm;
