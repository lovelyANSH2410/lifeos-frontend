
import React from 'react';
import { Plane, MapPin, Calendar, Briefcase } from 'lucide-react';

const TravelView: React.FC = () => {
  const trips = [
    { id: '1', dest: 'Kyoto, Japan', dates: 'Nov 12 - Nov 26', status: 'Upcoming', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', dest: 'New York City', dates: 'Sept 04 - Sept 08', status: 'Past', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Travel Plans</h2>
         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">
            Plan Trip
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {trips.map(trip => (
            <div key={trip.id} className="modern-card overflow-hidden group">
               <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${trip.image})` }}>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all"></div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                     {trip.status}
                  </div>
               </div>
               <div className="p-6">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                     <MapPin className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-widest">{trip.dest}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{trip.dest.split(',')[0]}</h3>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                     <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.dates}</span>
                     </div>
                     <button className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">View Details</button>
                  </div>
               </div>
            </div>
         ))}
         
         <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-gray-700 hover:bg-white/5 transition-all cursor-pointer">
            <Plane className="w-8 h-8 mb-4 opacity-50" />
            <span className="font-bold">Dreaming of somewhere?</span>
         </div>
      </div>
    </div>
  );
};

export default TravelView;
