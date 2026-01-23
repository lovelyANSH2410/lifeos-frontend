
import React from 'react';
import { Wallet, TrendingDown, ArrowUpRight, ShoppingBag, PiggyBank, Users } from 'lucide-react';
import { MoneyItem } from '@/types';

const MoneyView: React.FC = () => {
  const wishlist: MoneyItem[] = [
    { id: '1', title: 'Espresso Machine', amount: 450, type: 'wishlist', status: 'pending' },
    { id: '2', title: 'Dyson Vacuum', amount: 300, type: 'wishlist', status: 'pending' },
  ];

  const borrowings: MoneyItem[] = [
    { id: '3', title: 'Lent to Mark', amount: 50, type: 'borrowing', status: 'pending' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Money Management</h2>
           <p className="text-gray-400">Budget, Wishlist, and Tracking.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="modern-card p-6 bg-gradient-to-br from-[#151B28] to-[#1c1825]">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
             <Wallet className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Total Balance</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">$12,450.00</p>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
             <div className="bg-indigo-500 w-[70%] h-full"></div>
          </div>
        </div>
        
        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
             <ShoppingBag className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Wishlist Total</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">$750.00</p>
          <p className="text-xs text-gray-500">2 Items pending</p>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
             <Users className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Borrowings</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">$50.00</p>
          <p className="text-xs text-gray-500">You are owed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Wishlist Section */}
         <div className="modern-card p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-rose-400" /> Monthly Wishlist
            </h3>
            <div className="space-y-4">
               {wishlist.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F17] border border-white/5">
                     <span className="text-sm font-bold text-white">{item.title}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">${item.amount}</span>
                        <button className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded">Buy</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Borrowings Section */}
         <div className="modern-card p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Users className="w-5 h-5 text-emerald-400" /> Borrowings & Lendings
            </h3>
            <div className="space-y-4">
               {borrowings.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F17] border border-white/5">
                     <span className="text-sm font-bold text-white">{item.title}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-400">+${item.amount}</span>
                        <button className="text-[10px] bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600">Settle</button>
                     </div>
                  </div>
               ))}
               <div className="text-center p-4 border border-dashed border-gray-800 rounded-xl text-xs text-gray-500">
                  No debts found. Good job!
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MoneyView;
