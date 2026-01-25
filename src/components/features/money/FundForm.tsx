import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, Lock } from 'lucide-react';
import type { Fund, CreateFundData } from '@/types';

interface FundFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFundData) => Promise<void>;
  fund?: Fund | null;
  isLoading?: boolean;
}

const types = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'savings', label: 'Savings' },
  { value: 'goal', label: 'Goal' },
] as const;

const FundForm: React.FC<FundFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fund,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateFundData>({
    name: '',
    type: 'savings',
    targetAmount: undefined,
    currentAmount: 0,
    priority: 3,
    isLocked: false,
  });

  useEffect(() => {
    if (fund && isOpen) {
      setFormData({
        name: fund.name,
        type: fund.type,
        targetAmount: fund.targetAmount,
        currentAmount: fund.currentAmount,
        priority: fund.priority,
        isLocked: fund.isLocked,
      });
    } else if (!fund && isOpen) {
      setFormData({
        name: '',
        type: 'savings',
        targetAmount: undefined,
        currentAmount: 0,
        priority: 3,
        isLocked: false,
      });
    }
  }, [fund, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    await onSubmit(formData);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {fund ? 'Edit Fund' : 'Add Fund'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Emergency Fund, Vacation Savings"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              required
              disabled={isLoading}
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Target Amount (Optional)
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {!fund && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Initial Amount
              </label>
              <input
                type="number"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority (1-5)
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              min="1"
              max="5"
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLocked"
              checked={formData.isLocked}
              onChange={handleInputChange}
              className="w-4 h-4 rounded bg-[#0B0F17] border-white/10 text-blue-500 focus:ring-blue-500/50"
              disabled={isLoading}
            />
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Lock Fund
            </label>
          </div>

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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : fund ? 'Update' : 'Create Fund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FundForm;
