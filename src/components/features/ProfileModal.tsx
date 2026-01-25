import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, DollarSign, Mail, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenSize } from '@/hooks/useScreenSize';
import BottomSheet from '@/components/common/BottomSheet';
import { updateProfile } from '@/services/auth.service';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currency: user?.currency || 'INR',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        currency: user.currency || 'INR',
      });
      // Set image preview from user profile image
      if (user.profileImage) {
        if (typeof user.profileImage === 'string') {
          setImagePreview(user.profileImage);
        } else if (user.profileImage.url) {
          setImagePreview(user.profileImage.url);
        }
      } else {
        setImagePreview(null);
      }
      setSelectedImage(null);
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (formData.name.trim().length > 50) {
      setError('Name cannot exceed 50 characters');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        name: formData.name.trim(),
        currency: formData.currency,
        profileImage: selectedImage || undefined
      });
      
      // Refresh user data in context
      await refreshUser();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isMobile ? 'p-6' : 'p-6'}`}>
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                disabled={isSaving}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors"
          disabled={isSaving}
        >
          <Camera className="w-4 h-4" />
          {imagePreview ? 'Change Photo' : 'Upload Photo'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          disabled={isSaving}
        />
      </div>

      {/* Email (Read-only) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <Mail className="w-4 h-4" />
          Email
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <User className="w-4 h-4" />
          Full Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          minLength={2}
          maxLength={50}
          className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
          placeholder="Enter your name"
          disabled={isSaving}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50</p>
      </div>

      {/* Currency */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <DollarSign className="w-4 h-4" />
          Default Currency <span className="text-rose-400">*</span>
        </label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          required
          className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
          disabled={isSaving}
        >
          {currencies.map(currency => (
            <option key={currency.value} value={currency.value}>
              {currency.symbol} {currency.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          This currency will be used throughout the application
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !formData.name.trim()}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  if (!isOpen) return null;

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Profile Settings"
        maxHeight="90vh"
      >
        {formContent}
      </BottomSheet>
    );
  }

  // Desktop/Tablet: Use Modal
  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#0F131F] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default ProfileModal;
