import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Users, ShoppingBag, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import MoneyOverviewTab from './money/MoneyOverviewTab';
import IncomeTab from './money/IncomeTab';
import FixedExpensesTab from './money/FixedExpensesTab';
import TransactionsTab from './money/TransactionsTab';
import FundsTab from './money/FundsTab';
import DebtsTab from './money/DebtsTab';
import WishlistTab from './money/WishlistTab';

type MoneyTab = 'overview' | 'income' | 'fixed' | 'transactions' | 'funds' | 'debts' | 'wishlist';

const MoneyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MoneyTab>('overview');

  const tabs = [
    { id: 'overview' as MoneyTab, label: 'Overview', icon: Wallet },
    { id: 'income' as MoneyTab, label: 'Income', icon: TrendingUp },
    { id: 'fixed' as MoneyTab, label: 'Fixed Expenses', icon: Calendar },
    { id: 'transactions' as MoneyTab, label: 'Transactions', icon: DollarSign },
    { id: 'funds' as MoneyTab, label: 'Funds', icon: PiggyBank },
    { id: 'debts' as MoneyTab, label: 'Debts', icon: Users },
    { id: 'wishlist' as MoneyTab, label: 'Wishlist', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Money Management</h2>
          <p className="text-gray-400">Track your finances, one transaction at a time.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-[#151B28] text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <MoneyOverviewTab />}
        {activeTab === 'income' && <IncomeTab />}
        {activeTab === 'fixed' && <FixedExpensesTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'funds' && <FundsTab />}
        {activeTab === 'debts' && <DebtsTab />}
        {activeTab === 'wishlist' && <WishlistTab />}
      </div>
    </div>
  );
};

export default MoneyView;
