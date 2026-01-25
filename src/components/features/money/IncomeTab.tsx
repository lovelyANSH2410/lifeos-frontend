import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Loader2, AlertCircle, Trash2, DollarSign, Calendar } from 'lucide-react';
import { createIncome, getIncomes, deleteIncome } from '@/services/income.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Income, CreateIncomeData } from '@/types';
import IncomeForm from './IncomeForm';

const IncomeTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIncomes();
      setIncomes(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load income');
      console.error('Fetch incomes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleCreateIncome = async (data: CreateIncomeData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createIncome(data);
      setIsFormOpen(false);
      fetchIncomes();
    } catch (err: any) {
      setError(err.message || 'Failed to create income');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income entry?')) {
      return;
    }

    try {
      await deleteIncome(id);
      fetchIncomes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete income');
      alert(err.message || 'Failed to delete income');
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
      salary: 'Salary',
      freelance: 'Freelance',
      bonus: 'Bonus',
      side_income: 'Side Income',
      refund: 'Refund',
      other: 'Other'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Income</h3>
          <p className="text-gray-400 text-sm">Track money coming in</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Income
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
      ) : incomes.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No income entries yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first income</span>
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map(income => (
            <div key={income._id} className="modern-card p-5 flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{income.name}</h4>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                    {getTypeLabel(income.type)}
                  </span>
                  {income.frequency === 'monthly' && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                      Monthly
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(income.amount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(income.receivedAt).toLocaleDateString()}
                  </div>
                </div>
                {income.notes && (
                  <p className="text-sm text-gray-500 mt-2">{income.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(income._id)}
                className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <IncomeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateIncome}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default IncomeTab;
