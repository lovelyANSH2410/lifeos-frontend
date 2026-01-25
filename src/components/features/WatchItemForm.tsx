import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Film, Tv, BookOpen, Zap, Video, Star, XCircle } from 'lucide-react';
import type { CreateWatchItemData, WatchItem } from '@/types';

interface WatchItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWatchItemData) => Promise<void>;
  item?: WatchItem | null;
  isLoading?: boolean;
}

const types = [
  { value: 'movie', label: 'Movie', icon: Film },
  { value: 'series', label: 'Series', icon: Tv },
  { value: 'documentary', label: 'Documentary', icon: BookOpen },
  { value: 'anime', label: 'Anime', icon: Zap },
  { value: 'short', label: 'Short', icon: Video },
] as const;

const statuses = [
  { value: 'planned', label: 'Planned' },
  { value: 'watching', label: 'Watching' },
  { value: 'watched', label: 'Watched' },
  { value: 'dropped', label: 'Dropped' },
] as const;

const platforms = ['Netflix', 'Hotstar', 'Prime', 'YouTube', 'Disney+', 'HBO', 'Apple TV+', 'Other'];

const WatchItemForm: React.FC<WatchItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<CreateWatchItemData, 'poster'>>({
    title: item?.title || '',
    description: item?.description || '',
    type: item?.type || 'movie',
    status: item?.status || 'planned',
    platforms: item?.platforms || [],
    isFavorite: item?.isFavorite || false,
    rating: item?.rating,
    moodTags: item?.moodTags || [],
    notes: item?.notes || '',
    currentSeason: item?.currentSeason,
    currentEpisode: item?.currentEpisode,
  });
  
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterInputMode, setPosterInputMode] = useState<'upload' | 'url'>('upload');
  const [moodTagsInput, setMoodTagsInput] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(formData.platforms || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        title: item.title,
        description: item.description || '',
        type: item.type,
        status: item.status,
        platforms: item.platforms || [],
        isFavorite: item.isFavorite,
        rating: item.rating,
        moodTags: item.moodTags || [],
        notes: item.notes || '',
        currentSeason: item.currentSeason,
        currentEpisode: item.currentEpisode,
      });
      setSelectedPlatforms(item.platforms || []);
      setMoodTagsInput(item.moodTags?.join(', ') || '');
      // Handle poster: could be Cloudinary object or URL string
      if (item.poster) {
        if (typeof item.poster === 'string') {
          setPosterPreview(item.poster);
          setPosterUrl(item.poster);
          setPosterInputMode('url');
        } else {
          setPosterPreview(item.poster.url);
          setPosterInputMode('upload');
        }
      } else {
        setPosterPreview(null);
        setPosterInputMode('upload');
      }
      setSelectedPoster(null);
      setPosterUrl('');
    } else if (!item && isOpen) {
      setFormData({
        title: '',
        description: '',
        type: 'movie',
        status: 'planned',
        platforms: [],
        isFavorite: false,
        rating: undefined,
        moodTags: [],
        notes: '',
        currentSeason: undefined,
        currentEpisode: undefined,
      });
      setSelectedPlatforms([]);
      setMoodTagsInput('');
      setPosterPreview(null);
      setSelectedPoster(null);
      setPosterUrl('');
      setPosterInputMode('upload');
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMoodTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMoodTagsInput(value);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPoster(file);
      setPosterUrl(''); // Clear URL when file is selected
      setPosterInputMode('upload');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPosterUrl(url);
    setSelectedPoster(null); // Clear file when URL is entered
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Validate and preview URL
    if (url.trim()) {
      try {
        new URL(url);
        setPosterPreview(url);
      } catch {
        // Invalid URL, clear preview
        if (!url.trim()) {
          setPosterPreview(null);
        }
      }
    } else {
      setPosterPreview(null);
    }
  };

  const handleRemovePoster = () => {
    setSelectedPoster(null);
    setPosterUrl('');
    setPosterPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    // Validate rating
    if (formData.rating !== undefined && formData.rating !== null) {
      if (formData.status !== 'watched') {
        alert('Rating can only be set when status is "watched"');
        return;
      }
    }

    // Validate progress fields for series
    if (formData.type === 'series') {
      // Progress fields are optional, but if provided, they should be valid
    } else {
      // Clear progress fields if not a series
      formData.currentSeason = undefined;
      formData.currentEpisode = undefined;
    }

    // Parse moodTags
    const moodTags = moodTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const submitData: CreateWatchItemData = {
      ...formData,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      moodTags: moodTags.length > 0 ? moodTags : undefined,
      poster: selectedPoster || undefined,
      posterUrl: posterUrl.trim() || undefined,
    };

    await onSubmit(submitData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {item ? 'Edit Watch Item' : 'Add Watch Item'}
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
              placeholder="e.g., Inception"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      formData.type === type.value
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                    disabled={isLoading}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              required
              disabled={isLoading}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a brief description..."
              rows={3}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platforms (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                  disabled={isLoading}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Series Progress (only for series) */}
          {formData.type === 'series' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Season (Optional)
                </label>
                <input
                  type="number"
                  name="currentSeason"
                  value={formData.currentSeason || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    currentSeason: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  min="1"
                  placeholder="1"
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Episode (Optional)
                </label>
                <input
                  type="number"
                  name="currentEpisode"
                  value={formData.currentEpisode || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    currentEpisode: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  min="1"
                  placeholder="1"
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Rating (only when status is watched) */}
          {formData.status === 'watched' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rating (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      rating: prev.rating === rating ? undefined : rating 
                    }))}
                    className={`w-12 h-12 rounded-lg font-bold transition-all ${
                      formData.rating === rating
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    disabled={isLoading}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mood Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mood Tags (Optional)
            </label>
            <input
              type="text"
              value={moodTagsInput}
              onChange={handleMoodTagsChange}
              placeholder="comfort, intense, light, inspiring"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add your thoughts..."
              rows={3}
              maxLength={1000}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Poster */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poster (Optional)
            </label>
            
            {/* Toggle between Upload and URL */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setPosterInputMode('upload');
                  setPosterUrl('');
                  if (!selectedPoster) {
                    setPosterPreview(null);
                  }
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  posterInputMode === 'upload'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
                disabled={isLoading}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setPosterInputMode('url');
                  setSelectedPoster(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  if (!posterUrl) {
                    setPosterPreview(null);
                  }
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  posterInputMode === 'url'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
                disabled={isLoading}
              >
                Paste URL
              </button>
            </div>

            {posterPreview ? (
              <div className="relative mb-3">
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="w-full h-64 object-cover rounded-xl border border-white/10"
                />
                <button
                  type="button"
                  onClick={handleRemovePoster}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <XCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                {posterInputMode === 'upload' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/50 hover:bg-white/5 transition-all"
                  >
                    <Upload className="w-6 h-6 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload poster</p>
                    <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={handlePosterUrlChange}
                    placeholder="https://example.com/poster.jpg"
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
                    disabled={isLoading}
                  />
                )}
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePosterSelect}
              className="hidden"
              disabled={isLoading || posterInputMode === 'url'}
            />
          </div>

          {/* Favorite */}
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
              {isLoading ? 'Saving...' : item ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WatchItemForm;
