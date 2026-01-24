import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Calendar, MapPin, DollarSign, FileText, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateTripData, Trip } from '@/types';

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTripData) => Promise<void>;
  trip?: Trip | null;
  isLoading?: boolean;
}

const TripForm: React.FC<TripFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trip,
  isLoading = false
}) => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'USD';

  const [formData, setFormData] = useState<CreateTripData>({
    title: trip?.title || '',
    city: trip?.location?.city || '',
    country: trip?.location?.country || '',
    startDate: trip?.startDate
      ? new Date(trip.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    endDate: trip?.endDate
      ? new Date(trip.endDate).toISOString().split('T')[0]
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: trip?.budget || undefined,
    notes: trip?.notes || '',
    isPinned: trip?.isPinned || false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    trip?.coverImage?.url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (trip && isOpen) {
      setFormData({
        title: trip.title,
        city: trip.location.city,
        country: trip.location.country,
        startDate: new Date(trip.startDate).toISOString().split('T')[0],
        endDate: new Date(trip.endDate).toISOString().split('T')[0],
        budget: trip.budget || undefined,
        notes: trip.notes || '',
        isPinned: trip.isPinned || false,
      });
      setImagePreview(trip.coverImage?.url || null);
      setSelectedImage(null);
    } else if (!trip && isOpen) {
      setFormData({
        title: '',
        city: '',
        country: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: undefined,
        notes: '',
        isPinned: false,
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [trip, isOpen, defaultCurrency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBudgetChange = (field: 'estimated' | 'currency', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value,
        currency: prev.budget?.currency || defaultCurrency
      }
    }));
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
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!formData.city.trim()) {
      alert('City is required');
      return;
    }
    if (!formData.country.trim()) {
      alert('Country is required');
      return;
    }
    if (!formData.startDate) {
      alert('Start date is required');
      return;
    }
    if (!formData.endDate) {
      alert('End date is required');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    const submitData: CreateTripData = {
      ...formData,
      coverImage: selectedImage || undefined,
    };

    await onSubmit(submitData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {trip ? 'Edit Trip' : 'Plan New Trip'}
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
              Trip Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Paris Adventure"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              required
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Paris"
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., France"
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Budget (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.budget?.estimated || ''}
                    onChange={(e) => handleBudgetChange('estimated', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <select
                  value={formData.budget?.currency || defaultCurrency}
                  onChange={(e) => handleBudgetChange('currency', e.target.value)}
                  className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
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
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover preview"
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
                className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all"
              >
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">Click to upload cover image</p>
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes about your trip..."
                rows={4}
                maxLength={2000}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all resize-none"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes?.length || 0} / 2000 characters
            </p>
          </div>

          {/* Pinned Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
              className="w-5 h-5 rounded border-white/20 bg-[#0B0F17] text-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
              disabled={isLoading}
            />
            <label htmlFor="isPinned" className="text-sm text-gray-300 cursor-pointer">
              Pin this trip
            </label>
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
              {isLoading ? 'Saving...' : trip ? 'Update Trip' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default TripForm;