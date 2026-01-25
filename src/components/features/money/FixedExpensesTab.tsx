import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Loader2, AlertCircle, Edit2, Trash2, DollarSign } from 'lucide-react';
import { createFixedExpense, getFixedExpenses, updateFixedExpense, deleteFixedExpense } from '@/services/fixedExpense.service';
import { useAuth } from '@/contexts/AuthContext';
import type { FixedExpense, CreateFixedExpenseData } from '@/types';
import FixedExpenseForm from './FixedExpenseForm';

const FixedExpensesTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getFixedExpenses();
      setExpenses(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load fixed expenses');
      console.error('Fetch expenses error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (data: CreateFixedExpenseData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createFixedExpense(data);
      setIsFormOpen(false);
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to create fixed expense');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExpense = async (data: CreateFixedExpenseData) => {
    if (!editingExpense) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateFixedExpense(editingExpense._id, data);
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to update fixed expense');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixed expense?')) {
      return;
    }

    try {
      await deleteFixedExpense(id);
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete fixed expense');
      alert(err.message || 'Failed to delete fixed expense');
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
      rent: 'Rent',
      utilities: 'Utilities',
      internet: 'Internet',
      phone: 'Phone',
      insurance: 'Insurance',
      emi: 'EMI',
      subscription: 'Subscription',
      other: 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Fixed Expenses</h3>
          <p className="text-gray-400 text-sm">Non-negotiable monthly expenses</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expense
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
      ) : expenses.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <Calendar className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No fixed expenses yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first expense</span>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => (
            <div key={expense._id} className="modern-card p-5 flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{expense.name}</h4>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                    {getCategoryLabel(expense.category)}
                  </span>
                  {!expense.isActive && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(expense.amount)} / {expense.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </div>
                  {expense.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due on {expense.dueDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingExpense(expense);
                    setIsFormOpen(true);
                  }}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
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

      <FixedExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleEditExpense : handleCreateExpense}
        expense={editingExpense}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default FixedExpensesTab;
