import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, AlertCircle, CheckCircle, Users, Calendar, Loader2 } from 'lucide-react';
import { getMonthlyOverview } from '@/services/moneyOverview.service';
import { useAuth } from '@/contexts/AuthContext';
import type { MoneyOverview } from '@/types';

const MoneyOverviewTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [overview, setOverview] = useState<MoneyOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMonthlyOverview(selectedMonth);
      setOverview(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load overview');
      console.error('Fetch overview error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [selectedMonth]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: defaultCurrency
    });
  };

  const getEmergencyFundColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/20';
      case 'okay':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
        <Wallet className="w-8 h-8 mb-4 opacity-50" />
        <span className="font-bold">No data available</span>
        <span className="text-sm text-gray-500 mt-2">Start adding income and expenses</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Month:
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(overview.totalIncome)}</p>
        </div>

        {/* Fixed Expenses */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Fixed Expenses</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(overview.fixedExpensesTotal)}</p>
        </div>

        {/* Savings Total */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <PiggyBank className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Total Savings</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(overview.savingsTotal)}</p>
        </div>

        {/* Safe to Spend */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Safe to Spend</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(overview.safeToSpend)}</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Spent So Far */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-orange-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Spent So Far</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(overview.spentSoFar)}</p>
        </div>

        {/* Emergency Fund Status */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Emergency Fund</span>
          </div>
          <p className="text-xl font-bold text-white mb-2">{formatCurrency(overview.emergencyFundAmount)}</p>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getEmergencyFundColor(overview.emergencyFundStatus)}`}>
            {overview.emergencyFundStatus.charAt(0).toUpperCase() + overview.emergencyFundStatus.slice(1)}
          </span>
        </div>

        {/* Net Position */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Net Position</span>
          </div>
          <p className={`text-xl font-bold ${overview.totalIncome - overview.fixedExpensesTotal - overview.spentSoFar >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(overview.totalIncome - overview.fixedExpensesTotal - overview.spentSoFar)}
          </p>
        </div>
      </div>

      {/* Debts Summary */}
      {(overview.debts.owed > 0 || overview.debts.receivable > 0) && (
        <div className="modern-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Debts Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">You Owe</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(overview.debts.owed)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">You're Owed</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(overview.debts.receivable)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyOverviewTab;
