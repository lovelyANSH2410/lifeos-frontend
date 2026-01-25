import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader2, AlertCircle, Trash2, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { createDebt, getDebts, settleDebt, deleteDebt } from '@/services/debt.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Debt, CreateDebtData } from '@/types';
import DebtForm from './DebtForm';

const DebtsTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lent' | 'borrowed' | 'pending' | 'settled'>('all');

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (filter === 'lent' || filter === 'borrowed') {
        filters.type = filter;
      } else if (filter === 'pending' || filter === 'settled') {
        filters.status = filter;
      }
      const response = await getDebts(filters);
      setDebts(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load debts');
      console.error('Fetch debts error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [filter]);

  const handleCreateDebt = async (data: CreateDebtData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createDebt(data);
      setIsFormOpen(false);
      fetchDebts();
    } catch (err: any) {
      setError(err.message || 'Failed to create debt');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettle = async (id: string) => {
    if (!confirm('Mark this debt as settled?')) {
      return;
    }

    try {
      await settleDebt(id);
      fetchDebts();
    } catch (err: any) {
      setError(err.message || 'Failed to settle debt');
      alert(err.message || 'Failed to settle debt');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this debt?')) {
      return;
    }

    try {
      await deleteDebt(id);
      fetchDebts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete debt');
      alert(err.message || 'Failed to delete debt');
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: defaultCurrency
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Debts & Lendings</h3>
          <p className="text-gray-400 text-sm">Track money you owe and are owed</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Debt
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'lent', label: 'Lent' },
          { id: 'borrowed', label: 'Borrowed' },
          { id: 'pending', label: 'Pending' },
          { id: 'settled', label: 'Settled' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === f.id
                ? 'bg-white text-black'
                : 'bg-[#151B28] text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
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
      ) : debts.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <Users className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No debts yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first debt</span>
        </div>
      ) : (
        <div className="space-y-3">
          {debts.map(debt => (
            <div key={debt._id} className="modern-card p-5 flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{debt.personName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    debt.type === 'lent' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {debt.type === 'lent' ? 'You Lent' : 'You Borrowed'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    debt.status === 'settled' 
                      ? 'bg-gray-500/20 text-gray-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {debt.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className={debt.type === 'lent' ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(debt.amount)}
                    </span>
                  </div>
                  {debt.dueDate && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(debt.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {debt.note && (
                  <p className="text-sm text-gray-500 mt-2">{debt.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {debt.status === 'pending' && (
                  <button
                    onClick={() => handleSettle(debt._id)}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                    title="Settle"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(debt._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DebtForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateDebt}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DebtsTab;
