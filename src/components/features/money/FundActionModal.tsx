import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, Lock } from 'lucide-react';
import type { Fund } from '@/types';

interface FundActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, allowLocked: boolean) => Promise<void>;
  fund: Fund | null;
  actionType: 'add' | 'withdraw';
  isLoading?: boolean;
}

const FundActionModal: React.FC<FundActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fund,
  actionType,
  isLoading = false
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [allowLocked, setAllowLocked] = useState(false);

  if (!isOpen || !fund) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (actionType === 'withdraw' && amount > fund.currentAmount) {
      alert('Insufficient funds');
      return;
    }

    if (fund.isLocked && !allowLocked) {
      alert('This fund is locked. Check the box to proceed.');
      return;
    }

    await onSubmit(amount, allowLocked);
    setAmount(0);
    setAllowLocked(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {actionType === 'add' ? 'Add Money' : 'Withdraw Money'}
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
            <p className="text-sm text-gray-400 mb-2">Fund: <span className="text-white font-medium">{fund.name}</span></p>
            <p className="text-sm text-gray-400">Current: <span className="text-white font-medium">{fund.currentAmount.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              max={actionType === 'withdraw' ? fund.currentAmount : undefined}
              className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {fund.isLocked && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <Lock className="w-4 h-4 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm text-yellow-400 font-medium">Fund is locked</p>
                <p className="text-xs text-gray-400">Check below to proceed</p>
              </div>
              <input
                type="checkbox"
                checked={allowLocked}
                onChange={(e) => setAllowLocked(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B0F17] border-white/10 text-yellow-500 focus:ring-yellow-500/50"
                disabled={isLoading}
              />
            </div>
          )}

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
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                actionType === 'add'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/20'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-red-500/20'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : actionType === 'add' ? 'Add Money' : 'Withdraw Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FundActionModal;
