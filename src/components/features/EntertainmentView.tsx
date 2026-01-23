
import React from 'react';
import { Film, Star, Plus, Filter, PlayCircle } from 'lucide-react';
import { Movie } from '@/types';

const EntertainmentView: React.FC = () => {
  const movies: Movie[] = [
    { id: '1', title: 'Dune: Part Two', type: 'movie', status: 'watchlist', rating: 0, image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
    { id: '2', title: 'The Bear', type: 'series', status: 'watching', rating: 4.8, image: 'https://image.tmdb.org/t/p/w500/n1f17n3f45u7c4b6f123.jpg' },
    { id: '3', title: 'Past Lives', type: 'movie', status: 'watched', rating: 4.5, image: 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg' },
    { id: '4', title: 'Succession', type: 'series', status: 'watched', rating: 5, image: 'https://image.tmdb.org/t/p/w500/7T5xXfFPaeI2n75r9gNph0K3fF3.jpg' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Movies & Series</h2>
          <p className="text-gray-400">What we're watching tonight.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#151B28] border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Continue Watching</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {movies.filter(m => m.status === 'watching').map(movie => (
               <div key={movie.id} className="modern-card p-4 flex gap-4 items-center group cursor-pointer hover:border-indigo-500/30">
                  <div className="relative">
                     <img src={movie.image} className="w-20 h-28 object-cover rounded-lg shadow-lg" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                       <PlayCircle className="w-8 h-8 text-white" />
                     </div>
                  </div>
                  <div className="flex-1">
                     <span className="text-[10px] font-bold text-indigo-400 uppercase border border-indigo-500/20 px-1.5 py-0.5 rounded mb-2 inline-block">S2 E4</span>
                     <h4 className="text-lg font-bold text-white">{movie.title}</h4>
                     <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-500 w-[60%] h-full"></div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Watchlist</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {movies.filter(m => m.status === 'watchlist' || m.status === 'watched').map(movie => (
               <div key={movie.id} className="group relative cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-2">
                     <img src={movie.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {movie.rating > 0 ? movie.rating : '-'}
                     </div>
                     {movie.status === 'watched' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                           <span className="text-xs font-bold text-white border border-white px-2 py-1 rounded-full">WATCHED</span>
                        </div>
                     )}
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                  <p className="text-xs text-gray-500 capitalize">{movie.type}</p>
               </div>
             ))}
             
             {/* Add Button Placeholder */}
             <div className="rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-white/5 transition-all aspect-[2/3] cursor-pointer">
               <Plus className="w-8 h-8 mb-2" />
               <span className="text-xs font-bold">Add</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntertainmentView;
