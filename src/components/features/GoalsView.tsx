
import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Target
} from 'lucide-react';
import { Goal } from '@/types';

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Half Marathon Training',
    category: 'Health',
    progress: 65,
    deadline: 'Oct 15',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Buy running shoes', completed: true },
      { id: 'm2', title: 'Run 5k without stopping', completed: true },
      { id: 'm3', title: 'Weekly 15km total', completed: true },
      { id: 'm4', title: 'Complete 15km single run', completed: false },
    ]
  },
  {
    id: 'g2',
    title: 'Learn Advanced React',
    category: 'Career',
    progress: 30,
    deadline: 'Dec 01',
    status: 'active',
    milestones: [
      { id: 'm5', title: 'Complete Design Patterns course', completed: true },
      { id: 'm6', title: 'Build capstone project', completed: false },
    ]
  }
];

const GoalsView: React.FC = () => {
  const [goals] = useState<Goal[]>(INITIAL_GOALS);

  return (
    <div className="space-y-8 animate-enter pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Life Goals</h2>
          <p className="text-gray-400">Designing the future you.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="modern-card p-6 flex flex-col group relative overflow-hidden">
             {/* Gradient Border Effect */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
             
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold mb-2 bg-gray-800 text-gray-300 border border-white/5`}>
                  {goal.category}
                </span>
                <h3 className="text-xl font-bold text-white">{goal.title}</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-6">
              {goal.milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center gap-3">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium truncate ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-800">
               <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold">{goal.deadline}</span>
                 </div>
                 <span className="text-sm font-bold text-indigo-400">{goal.progress}%</span>
               </div>
               <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${goal.progress}%` }}></div>
               </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-gray-800 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-white/5 transition-all min-h-[300px] group">
           <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Plus className="w-8 h-8" />
           </div>
           <span className="font-bold text-sm uppercase tracking-widest">Create New Goal</span>
        </button>
      </div>
    </div>
  );
};

export default GoalsView;
