import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Type, FileText, Tag, Link as LinkIcon, Image as ImageIcon, XCircle } from 'lucide-react';
import type { CreateIdeaData, Idea } from '@/types';

interface IdeaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIdeaData) => Promise<void>;
  idea?: Idea | null;
  isLoading?: boolean;
}

const types = [
  { value: 'curiosity', label: 'Curiosity', emoji: '🤔' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'idea', label: 'Idea', emoji: '💡' },
  { value: 'inspiration', label: 'Inspiration', emoji: '✨' },
  { value: 'news', label: 'News', emoji: '📰' },
  { value: 'question', label: 'Question', emoji: '❓' },
  { value: 'random', label: 'Random', emoji: '🎲' },
] as const;

const sources = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'random', label: 'Random' },
] as const;

const IdeaForm: React.FC<IdeaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  idea,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<CreateIdeaData, 'image'>>({
    title: idea?.title || '',
    content: idea?.content || '',
    type: idea?.type,
    source: idea?.source,
    link: idea?.link || '',
    tags: idea?.tags || [],
    status: idea?.status || 'inbox',
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    idea?.image?.url || null
  );
  const [tagsInput, setTagsInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (idea && isOpen) {
      setFormData({
        title: idea.title || '',
        content: idea.content,
        type: idea.type,
        source: idea.source,
        link: idea.link || '',
        tags: idea.tags || [],
        status: idea.status || 'inbox',
      });
      setTagsInput(idea.tags?.join(', ') || '');
      setImagePreview(idea.image?.url || null);
      setSelectedImage(null);
    } else if (!idea && isOpen) {
      setFormData({
        title: '',
        content: '',
        type: undefined,
        source: undefined,
        link: '',
        tags: [],
        status: 'inbox',
      });
      setTagsInput('');
      setImagePreview(null);
      setSelectedImage(null);
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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Store raw input value to allow typing commas
    setTagsInput(value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
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
    
    // Validation
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }

    if (formData.content.trim().length > 5000) {
      alert('Content cannot exceed 5000 characters');
      return;
    }

    if (formData.title && formData.title.trim().length > 150) {
      alert('Title cannot exceed 150 characters');
      return;
    }

    // Parse tags from input string
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const submitData: CreateIdeaData = {
      ...formData,
      tags,
      image: selectedImage || undefined,
    };

    await onSubmit(submitData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {idea ? 'Edit Idea' : 'New Idea'}
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
          {/* Title (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Title (Optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give it a title..."
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              maxLength={150}
              disabled={isLoading}
            />
          </div>

          {/* Content (Required) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              rows={6}
              required
              maxLength={5000}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} / 5000 characters
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: prev.type === type.value ? undefined : type.value as any }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    formData.type === type.value
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                  disabled={isLoading}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source and Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source (Optional)
              </label>
              <select
                name="source"
                value={formData.source || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value || undefined as any }))}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                disabled={isLoading}
              >
                <option value="">Select source...</option>
                {sources.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
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
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="tag1, tag2, tag3"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-white/10"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all"
              >
                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : idea ? 'Update' : 'Save to Inbox'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default IdeaForm;
