
import React from 'react';
import { Camera, Calendar, Smile, BookOpen } from 'lucide-react';

const JournalView: React.FC = () => {
  const entries = [
    { id: '1', date: 'Today, 9:42 AM', title: 'Quiet Morning', snippet: 'The rain sounded beautiful against the window today. I felt a sense of calm I haven\'t felt in weeks.', mood: 'Calm', hasPhoto: true },
    { id: '2', date: 'Yesterday', title: 'Big Presentation', snippet: 'Finally delivered the pitch. I was nervous but prepared. The team seemed impressed.', mood: 'Energetic', hasPhoto: false },
    { id: '3', date: 'Oct 20', title: 'Coffee with Dad', snippet: 'We talked about the old house. It’s strange how memory changes over time.', mood: 'Nostalgic', hasPhoto: true },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Memory Vault</h2>
          <p className="text-gray-400">Your digital diary.</p>
        </div>
        <button className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
           <BookOpen className="w-4 h-4" /> New Entry
        </button>
      </div>

      <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-800">
        {entries.map(entry => (
           <div key={entry.id} className="relative pl-12 group">
              <div className="absolute left-1.5 top-6 w-5 h-5 bg-[#0B0F17] border-2 border-gray-600 rounded-full group-hover:border-indigo-500 group-hover:bg-indigo-900 transition-colors z-10"></div>
              <div className="modern-card p-6 hover:bg-[#1A2235]">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{entry.date}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">{entry.mood}</span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                 <p className="text-gray-400 text-sm leading-relaxed mb-4">"{entry.snippet}"</p>
                 {entry.hasPhoto && (
                    <div className="h-40 w-full rounded-lg bg-gray-800 flex items-center justify-center border border-dashed border-gray-700">
                       <span className="text-xs text-gray-500 flex items-center gap-2"><Camera className="w-4 h-4" /> Photo Attachment</span>
                    </div>
                 )}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default JournalView;
