import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Type, FileText, Tag, Link as LinkIcon, MapPin, DollarSign, XCircle, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateGiftIdeaData, GiftIdea } from '@/types';

interface GiftIdeaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGiftIdeaData) => Promise<void>;
  idea?: GiftIdea | null;
  isLoading?: boolean;
}

const types = [
  { value: 'cafe', label: 'Cafe', emoji: '☕' },
  { value: 'stay', label: 'Stay', emoji: '🏠' },
  { value: 'gift', label: 'Gift', emoji: '🎁' },
  { value: 'activity', label: 'Activity', emoji: '🎨' },
  { value: 'experience', label: 'Experience', emoji: '✨' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const;

const statuses = [
  { value: 'idea', label: 'Idea' },
  { value: 'planned', label: 'Planned' },
  { value: 'used', label: 'Used' },
] as const;

const GiftIdeaForm: React.FC<GiftIdeaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  idea,
  isLoading = false
}) => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'USD';
  
  const [formData, setFormData] = useState<Omit<CreateGiftIdeaData, 'images'>>({
    title: idea?.title || '',
    description: idea?.description || '',
    type: idea?.type || 'cafe',
    location: idea?.location || undefined,
    price: idea?.price || undefined,
    link: idea?.link || '',
    tags: idea?.tags || [],
    status: idea?.status || 'idea',
    isFavorite: idea?.isFavorite || false,
    source: idea?.source || '',
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (idea && isOpen) {
      setFormData({
        title: idea.title,
        description: idea.description || '',
        type: idea.type,
        location: idea.location,
        price: idea.price,
        link: idea.link || '',
        tags: idea.tags || [],
        status: idea.status,
        isFavorite: idea.isFavorite,
        source: idea.source || '',
      });
      setTagsInput(idea.tags?.join(', ') || '');
      setImagePreviews(idea.images?.map(img => img.url) || []);
      setSelectedImages([]);
    } else if (!idea && isOpen) {
      setFormData({
        title: '',
        description: '',
        type: 'cafe',
        location: undefined,
        price: undefined,
        link: '',
        tags: [],
        status: 'idea',
        isFavorite: false,
        source: '',
      });
      setTagsInput('');
      setImagePreviews([]);
      setSelectedImages([]);
    }
  }, [idea, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field: 'name' | 'city' | 'country', value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handlePriceChange = (field: 'amount' | 'currency', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      price: {
        ...prev.price || { amount: 0, currency: defaultCurrency },
        [field]: value
      }
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    const newFiles = files.slice(0, 3 - selectedImages.length);
    setSelectedImages(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    // Parse tags
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const submitData: CreateGiftIdeaData = {
      ...formData,
      tags: tags.length > 0 ? tags : undefined,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    };

    await onSubmit(submitData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {idea ? 'Edit Idea' : 'Add New Idea'}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Romantic Dinner at Sky Restaurant"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              required
              maxLength={200}
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    formData.type === type.value
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                  disabled={isLoading}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this idea..."
              rows={4}
              maxLength={1000}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.location?.name || ''}
                onChange={(e) => handleLocationChange('name', e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="City"
                value={formData.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.location?.country || ''}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Amount"
                value={formData.price?.amount || ''}
                onChange={(e) => handlePriceChange('amount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              />
              <select
                value={formData.price?.currency || defaultCurrency}
                onChange={(e) => handlePriceChange('currency', e.target.value)}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (Optional, max 5)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="tag1, tag2, tag3"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas (max 5)
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images (Optional, max 3)
            </label>
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      <XCircle className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {imagePreviews.length < 3 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/50 hover:bg-white/5 transition-all"
              >
                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">Max 3 images, 5MB each</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {/* Status and Favorite */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                disabled={isLoading}
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Favorite
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                  formData.isFavorite
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
                disabled={isLoading}
              >
                {formData.isFavorite ? '⭐ Favorited' : '☆ Not Favorited'}
              </button>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source (Optional)
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="Where did you find this idea?"
              maxLength={200}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              disabled={isLoading}
            />
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : idea ? 'Update' : 'Add Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GiftIdeaForm;
