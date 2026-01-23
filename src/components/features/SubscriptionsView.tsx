
import React from 'react';
import { Repeat, AlertCircle, CheckCircle } from 'lucide-react';

const SubscriptionsView: React.FC = () => {
  const subs = [
    { id: '1', name: 'Netflix', price: 15.99, due: 'Tomorrow', icon: 'N', color: 'bg-red-600' },
    { id: '2', name: 'Spotify', price: 12.99, due: 'Oct 28', icon: 'S', color: 'bg-green-500' },
    { id: '3', name: 'Adobe Creative Cloud', price: 54.99, due: 'Nov 01', icon: 'A', color: 'bg-blue-600' },
    { id: '4', name: 'AWS', price: 32.50, due: 'Nov 05', icon: '☁️', color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Subscriptions Manager</h2>
          <p className="text-gray-400">Recurring expenses audit.</p>
        </div>
        <div className="text-right">
           <p className="text-sm text-gray-400 uppercase tracking-widest">Monthly Total</p>
           <p className="text-3xl font-bold text-white">$116.47</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subs.map(sub => (
          <div key={sub.id} className="modern-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${sub.color}`}>
                 {sub.icon}
               </div>
               <div>
                 <h3 className="font-bold text-white text-lg">{sub.name}</h3>
                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Renews {sub.due}</p>
               </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">${sub.price}</p>
              <div className="flex justify-end mt-1">
                 <button className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors">
                   Manage
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-start">
         <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
         <div>
           <h4 className="text-sm font-bold text-indigo-300">Optimization Tip</h4>
           <p className="text-xs text-indigo-200/60 mt-1">You haven't opened the "Adobe Creative Cloud" app in 25 days. Consider pausing this subscription to save $54.99.</p>
         </div>
      </div>
    </div>
  );
};

export default SubscriptionsView;
