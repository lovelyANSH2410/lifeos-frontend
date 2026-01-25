import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { createTransaction, getTransactions } from '@/services/transaction.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Transaction, CreateTransactionData } from '@/types';
import TransactionForm from './TransactionForm';

const TransactionsTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (filter !== 'all') {
        filters.type = filter;
      }
      const response = await getTransactions({ ...filters, limit: 50 });
      setTransactions(response.data.transactions);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      console.error('Fetch transactions error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleCreateTransaction = async (data: CreateTransactionData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createTransaction(data);
      setIsFormOpen(false);
      fetchTransactions();
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Food',
      travel: 'Travel',
      shopping: 'Shopping',
      entertainment: 'Entertainment',
      health: 'Health',
      misc: 'Misc'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Transactions</h3>
          <p className="text-gray-400 text-sm">Daily expenses and income</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'expense', label: 'Expenses', icon: TrendingDown },
          { id: 'income', label: 'Income', icon: TrendingUp },
        ].map(f => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                filter === f.id
                  ? 'bg-white text-black'
                  : 'bg-[#151B28] text-gray-400 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {f.label}
            </button>
          );
        })}
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
      ) : transactions.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <DollarSign className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No transactions yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first transaction</span>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(transaction => (
            <div key={transaction._id} className="modern-card p-5 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {transaction.type === 'expense' ? (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  )}
                  <h4 className="text-lg font-bold text-white">{getCategoryLabel(transaction.category)}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === 'expense' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className={transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'}>
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                {transaction.note && (
                  <p className="text-sm text-gray-500 mt-2">{transaction.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTransaction}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TransactionsTab;
