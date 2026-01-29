import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Calendar, Type, FileText, Smile } from 'lucide-react';
import type { CreateDiaryEntryData, DiaryEntry } from '@/types';
import { useSubscriptionLimit } from '@/hooks/useSubscriptionLimit';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, isSubscriptionLimitError } from '@/utils/error.util';
import UpgradePrompt from '@/components/common/UpgradePrompt';
import { Tab } from '@/types';

interface DiaryEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDiaryEntryData) => Promise<void>;
  entry?: DiaryEntry | null;
  isLoading?: boolean;
  onNavigateToPlans?: () => void; // Callback to navigate to subscription plans
}

const moods = [
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '📸' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'stressed', label: 'Stressed', emoji: '😰' },
] as const;

const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
  isLoading = false,
  onNavigateToPlans
}) => {
  // Only fetch limit data when form is open
  const { limit, currentCount, canCreate, isLoading: limitLoading, displayName } = useSubscriptionLimit('diary', isOpen);
  const { showError, showUpgrade } = useToast();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    mood: entry?.mood || 'neutral',
    entryDate: entry?.entryDate 
      ? new Date(entry.entryDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    isPinned: entry?.isPinned || false,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset upgrade prompt when form closes
  useEffect(() => {
    if (!isOpen) {
      setShowUpgradePrompt(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return file.type.startsWith('image/');
    });

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Wait for limit check to complete before validating
    if (limitLoading) {
      // Still loading limit data, wait for it to complete
      // Don't block submission during loading to avoid UX issues
      console.log('Limit check still loading, proceeding with submission...');
    }
    
    // Check limit before submission (only for new entries)
    // Only check if limit check is complete and user can't create more
    if (!entry && !limitLoading && limit > 0 && !canCreate) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }

    if (formData.content.length > 5000) {
      alert('Content cannot exceed 5000 characters');
      return;
    }

    try {
      await onSubmit({
        title: formData.title.trim() || undefined,
        content: formData.content.trim(),
        mood: formData.mood,
        entryDate: formData.entryDate,
        isPinned: formData.isPinned,
        images: selectedImages.length > 0 ? selectedImages : undefined
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        mood: 'neutral',
        entryDate: new Date().toISOString().split('T')[0],
        isPinned: false,
      });
      setSelectedImages([]);
      setImagePreviews([]);
      onClose();
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      
      // Check if error is about subscription limit
      if (isSubscriptionLimitError(error)) {
        showUpgrade(errorMessage);
        setShowUpgradePrompt(true);
      } else {
        showError(errorMessage);
        console.error('Error submitting entry:', error);
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#0F131F] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">New Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Type className="w-4 h-4" />
              Title (Optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={120}
              className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              placeholder="Give your memory a title..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/120</p>
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Your Memory <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={8}
              maxLength={5000}
              className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none resize-none"
              placeholder="Write about your day, thoughts, feelings..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/5000</p>
          </div>

          {/* Mood and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mood */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Smile className="w-4 h-4" />
                Mood
              </label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              >
                {moods.map(mood => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <ImageIcon className="w-4 h-4" />
              Images (Optional, max 5)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 rounded-xl py-8 px-4 hover:border-indigo-500/50 transition-colors flex flex-col items-center gap-2 text-gray-400"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Click to upload images</span>
              <span className="text-xs">Max 5 images, 5MB each</span>
            </button>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pinned */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-white/10 bg-[#0B0F17]/50 text-indigo-500 focus:ring-indigo-500"
            />
            <label className="text-sm text-gray-300">Pin this entry</label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.content.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {createPortal(modalContent, document.body)}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        featureName={displayName}
        currentCount={currentCount}
        limit={limit}
        onUpgrade={onNavigateToPlans}
      />
    </>
  );
};

export default DiaryEntryForm;
