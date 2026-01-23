
import React from 'react';
import { Moon, Sun, Smartphone, Smile, Frown, Meh } from 'lucide-react';

const WellnessView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter">
      <div>
         <h2 className="text-2xl font-bold text-white">Wellness & Balance</h2>
         <p className="text-gray-400">Tracking the metrics that matter.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="modern-card p-6 bg-indigo-900/10 border-indigo-500/20">
            <div className="flex justify-between items-start mb-4">
               <Moon className="w-6 h-6 text-indigo-400" />
               <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">Optimal</span>
            </div>
            <p className="text-3xl font-bold text-white">7h 42m</p>
            <p className="text-xs text-gray-400 mt-1">Avg Sleep</p>
         </div>
         <div className="modern-card p-6">
            <div className="flex justify-between items-start mb-4">
               <Smartphone className="w-6 h-6 text-rose-400" />
               <span className="text-xs font-bold text-rose-300 bg-rose-500/10 px-2 py-1 rounded">+12m</span>
            </div>
            <p className="text-3xl font-bold text-white">3h 15m</p>
            <p className="text-xs text-gray-400 mt-1">Screen Time</p>
         </div>
         <div className="modern-card p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Mood</h3>
            <div className="flex justify-between">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 4 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-gray-800 text-gray-600'}`}>
                        <Smile className="w-4 h-4" />
                     </div>
                     <span className="text-xs font-bold text-gray-500">{day}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="modern-card p-8">
         <h3 className="text-lg font-bold text-white mb-6">Habit Tracker</h3>
         <div className="space-y-6">
            {[
               { name: 'Morning Meditation', streak: 12, done: true },
               { name: 'Read 30 mins', streak: 4, done: false },
               { name: 'No Sugar', streak: 2, done: false },
               { name: 'Evening Walk', streak: 45, done: true },
            ].map((habit, i) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${habit.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-gray-400'}`}>
                        {habit.done && <Sun className="w-3 h-3 text-white" />}
                     </div>
                     <span className={`font-medium ${habit.done ? 'text-gray-400 line-through' : 'text-white'}`}>{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500 font-bold uppercase">{habit.streak} Day Streak</span>
                     <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(d => (
                           <div key={d} className={`w-1.5 h-3 rounded-sm ${d <= 3 ? 'bg-emerald-500' : 'bg-gray-800'}`}></div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default WellnessView;
