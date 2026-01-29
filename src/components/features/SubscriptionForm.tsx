import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, Calendar, Tag, Repeat, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateSubscriptionData, Subscription } from '@/types';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionData) => Promise<void>;
  subscription?: Subscription | null;
  isLoading?: boolean;
}

const categories = [
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'productivity', label: 'Productivity', emoji: '💼' },
  { value: 'cloud', label: 'Cloud', emoji: '☁️' },
  { value: 'utilities', label: 'Utilities', emoji: '🔧' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const;

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  isLoading = false
}) => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    name: subscription?.name || '',
    provider: subscription?.provider || '',
    icon: subscription?.icon || '',
    amount: subscription?.amount || 0,
    currency: subscription?.currency || defaultCurrency,
    billingCycle: subscription?.billingCycle || 'monthly',
    renewalDate: subscription?.renewalDate 
      ? new Date(subscription.renewalDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    lastUsedAt: subscription?.lastUsedAt
      ? new Date(subscription.lastUsedAt).toISOString().split('T')[0]
      : undefined,
    category: subscription?.category || 'other',
    status: subscription?.status || 'active',
    notes: subscription?.notes || '',
    isAutoRenew: subscription?.isAutoRenew !== undefined ? subscription.isAutoRenew : true,
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        provider: subscription.provider || '',
        icon: subscription.icon || '',
        amount: subscription.amount,
        currency: subscription.currency || defaultCurrency,
        billingCycle: subscription.billingCycle,
        renewalDate: new Date(subscription.renewalDate).toISOString().split('T')[0],
        lastUsedAt: subscription.lastUsedAt
          ? new Date(subscription.lastUsedAt).toISOString().split('T')[0]
          : undefined,
        category: subscription.category,
        status: subscription.status,
        notes: subscription.notes || '',
        isAutoRenew: subscription.isAutoRenew,
      });
    } else {
      setFormData({
        name: '',
        provider: '',
        icon: '',
        amount: 0,
        currency: defaultCurrency,
        billingCycle: 'monthly',
        renewalDate: new Date().toISOString().split('T')[0],
        category: 'other',
        status: 'active',
        notes: '',
        isAutoRenew: true,
      });
    }
  }, [subscription, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Subscription name is required');
      return;
    }

    if (formData.amount < 0) {
      alert('Amount must be greater than or equal to 0');
      return;
    }

    if (!formData.renewalDate) {
      alert('Renewal date is required');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      // Error handling (including toast) is done in the parent component (SubscriptionsView)
      // Just log the error here to avoid duplicate toasts
      console.error('Error submitting subscription:', error);
      // Don't show toast here - parent component already handles it
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#0F131F] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {subscription ? 'Edit Subscription' : 'New Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Subscription Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              placeholder="e.g., Netflix, Spotify"
            />
          </div>

          {/* Provider and Icon Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4" />
                Provider
              </label>
              <input
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                placeholder="e.g., Netflix Inc."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Icon (Emoji/Text)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                placeholder="📺 or N"
              />
            </div>
          </div>

          {/* Amount and Currency Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Amount <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleNumberChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
          </div>

          {/* Billing Cycle and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Repeat className="w-4 h-4" />
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              >
                {billingCycles.map(cycle => (
                  <option key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Renewal Date and Last Used Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                Renewal Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="renewalDate"
                value={formData.renewalDate}
                onChange={handleInputChange}
                required
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Last Used At
              </label>
              <input
                type="date"
                name="lastUsedAt"
                value={formData.lastUsedAt || ''}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
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
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              className="w-full bg-[#0B0F17]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none resize-none"
              placeholder="Additional notes about this subscription..."
            />
            <p className="text-xs text-gray-500 mt-1">{(formData.notes || '').length}/500</p>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center gap-3 p-4 bg-[#0B0F17]/30 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isAutoRenew: !prev.isAutoRenew }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.isAutoRenew ? 'bg-indigo-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isAutoRenew ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <label className="text-sm font-medium text-gray-300">Auto Renew</label>
              <p className="text-xs text-gray-500">Automatically renew this subscription</p>
            </div>
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
              disabled={isLoading || !formData.name.trim() || formData.amount < 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : subscription ? 'Update Subscription' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default SubscriptionForm;
