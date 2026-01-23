
import React, { useState } from 'react';
import { Heart, Gift, MapPin, ExternalLink, Plus, Coffee, Home } from 'lucide-react';
import { DateIdea } from '@/types';

const DateNightView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'cafe' | 'airbnb' | 'gift'>('all');

  const ideas: DateIdea[] = [
    { id: '1', title: 'Pottery Workshop', category: 'activity', priceRange: 'medium', location: 'Downtown Arts', image: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', title: 'Cozy Cabin Weekend', category: 'airbnb', priceRange: 'high', location: 'Lake Arrowhead', link: 'airbnb.com', image: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '3', title: 'Espresso Machine', category: 'gift', priceRange: 'high', image: 'https://images.unsplash.com/photo-1570530868352-27357593c76a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '4', title: 'Sunday Brunch', category: 'cafe', priceRange: 'medium', location: 'The Toast', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];

  const filteredIdeas = filter === 'all' ? ideas : ideas.filter(i => i.category === filter);

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gifting & Dates</h2>
          <p className="text-gray-400">Never run out of ideas.</p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Idea
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
         {[
           { id: 'all', label: 'All', icon: null },
           { id: 'cafe', label: 'Cafes', icon: Coffee },
           { id: 'airbnb', label: 'Stays', icon: Home },
           { id: 'gift', label: 'Gifts', icon: Gift },
         ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filter === f.id ? 'bg-white text-black' : 'bg-[#151B28] text-gray-400 hover:text-white'}`}
            >
              {f.icon && <f.icon className="w-3 h-3" />} {f.label}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredIdeas.map(idea => (
            <div key={idea.id} className="modern-card overflow-hidden group">
               <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${idea.image})` }}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                     {idea.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white">
                     {idea.priceRange === 'low' ? '$' : idea.priceRange === 'medium' ? '$$' : '$$$'}
                  </div>
               </div>
               <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{idea.title}</h3>
                  {idea.location && (
                     <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                        <MapPin className="w-3 h-3" /> {idea.location}
                     </div>
                  )}
                  {idea.link && (
                     <a href="#" className="flex items-center gap-1.5 text-rose-400 text-xs font-bold hover:underline">
                        <ExternalLink className="w-3 h-3" /> View Online
                     </a>
                  )}
                  {idea.category === 'gift' && (
                     <div className="mt-2 w-full bg-rose-500/10 text-rose-400 py-1.5 rounded text-center text-xs font-bold border border-rose-500/20">
                        Add to Wishlist
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default DateNightView;
