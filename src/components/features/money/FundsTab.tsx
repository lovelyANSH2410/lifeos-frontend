import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Loader2, AlertCircle, Edit2, Trash2, DollarSign, Lock, Unlock, TrendingUp, TrendingDown } from 'lucide-react';
import { createFund, getFunds, updateFund, addToFund, withdrawFromFund } from '@/services/fund.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Fund, CreateFundData } from '@/types';
import FundForm from './FundForm';
import FundActionModal from './FundActionModal';

const FundsTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add');

  const fetchFunds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getFunds();
      setFunds(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load funds');
      console.error('Fetch funds error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleCreateFund = async (data: CreateFundData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createFund(data);
      setIsFormOpen(false);
      fetchFunds();
    } catch (err: any) {
      setError(err.message || 'Failed to create fund');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFund = async (data: CreateFundData) => {
    if (!editingFund) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateFund(editingFund._id, data);
      setIsFormOpen(false);
      setEditingFund(null);
      fetchFunds();
    } catch (err: any) {
      setError(err.message || 'Failed to update fund');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLock = async (fund: Fund) => {
    try {
      await updateFund(fund._id, { isLocked: !fund.isLocked });
      fetchFunds();
    } catch (err: any) {
      setError(err.message || 'Failed to update fund');
      alert(err.message || 'Failed to update fund');
    }
  };

  const handleFundAction = async (amount: number, allowLocked: boolean) => {
    if (!selectedFund) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      if (actionType === 'add') {
        await addToFund(selectedFund._id, amount, allowLocked);
      } else {
        await withdrawFromFund(selectedFund._id, amount, allowLocked);
      }
      setIsActionModalOpen(false);
      setSelectedFund(null);
      fetchFunds();
    } catch (err: any) {
      setError(err.message || `Failed to ${actionType} money`);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: defaultCurrency
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      emergency: 'Emergency',
      savings: 'Savings',
      goal: 'Goal'
    };
    return labels[type] || type;
  };

  const getProgressPercentage = (fund: Fund) => {
    if (!fund.targetAmount || fund.targetAmount === 0) return 0;
    return Math.min((fund.currentAmount / fund.targetAmount) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Funds & Savings</h3>
          <p className="text-gray-400 text-sm">Manage your savings and goals</p>
        </div>
        <button
          onClick={() => {
            setEditingFund(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Fund
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      ) : funds.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <PiggyBank className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No funds yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to create your first fund</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funds.map(fund => (
            <div key={fund._id} className="modern-card p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{fund.name}</h4>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium mt-1 inline-block">
                    {getTypeLabel(fund.type)}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleLock(fund)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={fund.isLocked ? 'Unlock' : 'Lock'}
                >
                  {fund.isLocked ? (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-2xl font-bold text-white">{formatCurrency(fund.currentAmount)}</p>
                  {fund.targetAmount && (
                    <p className="text-sm text-gray-400">/ {formatCurrency(fund.targetAmount)}</p>
                  )}
                </div>
                {fund.targetAmount && (
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${getProgressPercentage(fund)}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFund(fund);
                    setActionType('add');
                    setIsActionModalOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => {
                    setSelectedFund(fund);
                    setActionType('withdraw');
                    setIsActionModalOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  disabled={fund.currentAmount === 0}
                >
                  <TrendingDown className="w-4 h-4" />
                  Withdraw
                </button>
                <button
                  onClick={() => {
                    setEditingFund(fund);
                    setIsFormOpen(true);
                  }}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FundForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFund(null);
        }}
        onSubmit={editingFund ? handleEditFund : handleCreateFund}
        fund={editingFund}
        isLoading={isSubmitting}
      />

      <FundActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedFund(null);
        }}
        onSubmit={handleFundAction}
        fund={selectedFund}
        actionType={actionType}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default FundsTab;
