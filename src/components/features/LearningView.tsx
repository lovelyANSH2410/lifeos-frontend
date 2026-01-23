
import React from 'react';
import { BookOpen, Award, Clock, PlayCircle } from 'lucide-react';

const LearningView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-enter">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">Learning Hub</h2>
            <p className="text-gray-400">Courses and certifications.</p>
          </div>
          <div className="flex gap-4">
             <div className="text-center">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-gray-500">Hours this week</p>
             </div>
             <div className="text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-gray-500">Active Courses</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Course */}
          <div className="modern-card p-6 md:col-span-2 bg-gradient-to-br from-[#151B28] to-[#1c2436] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen className="w-64 h-64 text-indigo-500" />
             </div>
             <div className="relative z-10">
               <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">In Progress</span>
               <h3 className="text-2xl font-bold text-white mb-2">Advanced System Design</h3>
               <p className="text-gray-400 text-sm mb-6 max-w-md">Mastering scalability, distributed systems, and microservices architecture patterns.</p>
               
               <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                     <span>Module 4 of 12</span>
                     <span>35% Complete</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 h-full w-[35%]"></div>
                  </div>
               </div>

               <button className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Continue Learning
               </button>
             </div>
          </div>

          {/* Up Next List */}
          <div className="modern-card p-6">
             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Up Next</h4>
             <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-700">
                   <h5 className="font-bold text-white text-sm">UI/UX Principles</h5>
                   <p className="text-xs text-gray-500 mt-1">2.5 hours left</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-700">
                   <h5 className="font-bold text-white text-sm">Rust for Beginners</h5>
                   <p className="text-xs text-gray-500 mt-1">Not started</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default LearningView;
