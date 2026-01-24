import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileText, Calendar, Tag, XCircle } from 'lucide-react';
import type { CreateVaultDocumentData, VaultDocument } from '@/types';

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVaultDocumentData) => Promise<void>;
  document?: VaultDocument | null;
  isLoading?: boolean;
}

const categories = [
  { value: 'identity', label: 'Identity', emoji: '🆔' },
  { value: 'insurance', label: 'Insurance', emoji: '🛡️' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'medical', label: 'Medical', emoji: '🏥' },
  { value: 'property', label: 'Property', emoji: '🏠' },
  { value: 'education', label: 'Education', emoji: '🎓' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const;

const DocumentForm: React.FC<DocumentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  document: vaultDocument,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<CreateVaultDocumentData, 'file'>>({
    title: vaultDocument?.title || '',
    category: vaultDocument?.category || 'other',
    issuedDate: vaultDocument?.issuedDate 
      ? new Date(vaultDocument.issuedDate).toISOString().split('T')[0]
      : undefined,
    expiryDate: vaultDocument?.expiryDate
      ? new Date(vaultDocument.expiryDate).toISOString().split('T')[0]
      : undefined,
    notes: vaultDocument?.notes || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vaultDocument && isOpen) {
      setFormData({
        title: vaultDocument.title,
        category: vaultDocument.category,
        issuedDate: vaultDocument.issuedDate
          ? new Date(vaultDocument.issuedDate).toISOString().split('T')[0]
          : undefined,
        expiryDate: vaultDocument.expiryDate
          ? new Date(vaultDocument.expiryDate).toISOString().split('T')[0]
          : undefined,
        notes: vaultDocument.notes || '',
      });
      setSelectedFile(null);
      setFilePreview(null);
    } else if (!vaultDocument && isOpen) {
      setFormData({
        title: '',
        category: 'other',
        issuedDate: undefined,
        expiryDate: undefined,
        notes: '',
      });
      setSelectedFile(null);
      setFilePreview(null);
    }
  }, [vaultDocument, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('File type not allowed. Allowed types: PDF, JPG, JPEG, PNG, WEBP');
        return;
      }

      setSelectedFile(file);
      
      // Preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    if (selectedFile.type === 'application/pdf') {
      return <FileText className="w-12 h-12 text-rose-400" />;
    }
    return <FileText className="w-12 h-12 text-indigo-400" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!selectedFile && !vaultDocument) {
      alert('File is required');
      return;
    }

    if (formData.expiryDate && formData.issuedDate) {
      if (new Date(formData.expiryDate) < new Date(formData.issuedDate)) {
        alert('Expiry date must be after issued date');
        return;
      }
    }

    const submitData: CreateVaultDocumentData = {
      ...formData,
      file: selectedFile || new File([], 'placeholder'), // This won't be used if document exists
    };

    await onSubmit(submitData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {vaultDocument ? 'Edit Document' : 'Upload Document'}
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
              placeholder="e.g., Passport, Insurance Policy, Driver's License"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
              required
              maxLength={150}
              disabled={isLoading}
            />
          </div>

          {/* File Upload */}
          {!vaultDocument && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document File *
              </label>
              {selectedFile ? (
                <div className="relative">
                  <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg mb-4"
                      />
                    ) : (
                      <div className="mb-4">
                        {getFileIcon()}
                      </div>
                    )}
                    <p className="text-sm text-white font-medium mb-1">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors mt-4"
                      disabled={isLoading}
                    >
                      <XCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/5 transition-all"
                >
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-400">Click to upload document</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          )}

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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Issued Date
              </label>
              <input
                type="date"
                name="issuedDate"
                value={formData.issuedDate || ''}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate || ''}
                onChange={handleInputChange}
                min={formData.issuedDate || undefined}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                disabled={isLoading}
              />
            </div>
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
              {isLoading ? 'Uploading...' : vaultDocument ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default DocumentForm;
