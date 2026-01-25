import React, { useState, useEffect } from 'react';
import { Film, Tv, BookOpen, Zap, Video, Plus, Loader2, AlertCircle, Edit2, Trash2, Star, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { createWatchItem, getWatchItems, updateWatchItem, updateWatchProgress, deleteWatchItem } from '@/services/watch.service';
import type { WatchItem, CreateWatchItemData, UpdateWatchProgressData } from '@/types';
import WatchItemForm from './WatchItemForm';

const typeLabels: Record<string, string> = {
  movie: 'Movie',
  series: 'Series',
  documentary: 'Documentary',
  anime: 'Anime',
  short: 'Short'
};

const typeIcons: Record<string, any> = {
  movie: Film,
  series: Tv,
  documentary: BookOpen,
  anime: Zap,
  short: Video
};

const statusLabels: Record<string, string> = {
  planned: 'Planned',
  watching: 'Watching',
  watched: 'Watched',
  dropped: 'Dropped'
};

const statusIcons: Record<string, any> = {
  planned: Clock,
  watching: Play,
  watched: CheckCircle,
  dropped: XCircle
};

const statusColors: Record<string, string> = {
  planned: 'bg-gray-500/20 text-gray-400',
  watching: 'bg-blue-500/20 text-blue-400',
  watched: 'bg-green-500/20 text-green-400',
  dropped: 'bg-red-500/20 text-red-400'
};

const WatchView: React.FC = () => {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch items
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      const response = await getWatchItems(filters);
      setItems(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load watch items');
      console.error('Fetch items error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [statusFilter, typeFilter]);

  const handleCreateItem = async (data: CreateWatchItemData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createWatchItem(data);
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to create watch item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (data: CreateWatchItemData) => {
    if (!editingItem) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateWatchItem(editingItem._id, data);
      setIsFormOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update watch item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to drop this item?')) {
      return;
    }

    try {
      await deleteWatchItem(id);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete watch item');
      alert(err.message || 'Failed to delete watch item');
    }
  };

  const handleToggleFavorite = async (item: WatchItem) => {
    try {
      await updateWatchItem(item._id, { isFavorite: !item.isFavorite });
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update favorite');
      alert(err.message || 'Failed to update favorite');
    }
  };

  const handleUpdateProgress = async (item: WatchItem, season?: number, episode?: number) => {
    if (item.type !== 'series') return;

    try {
      const progressData: UpdateWatchProgressData = {};
      if (season !== undefined) progressData.currentSeason = season;
      if (episode !== undefined) progressData.currentEpisode = episode;
      
      await updateWatchProgress(item._id, progressData);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
      alert(err.message || 'Failed to update progress');
    }
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: WatchItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'planned', label: 'Planned' },
    { id: 'watching', label: 'Watching' },
    { id: 'watched', label: 'Watched' },
    { id: 'dropped', label: 'Dropped' },
  ];

  const typeFilters = [
    { id: 'all', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'documentary', label: 'Documentaries' },
    { id: 'anime', label: 'Anime' },
    { id: 'short', label: 'Shorts' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Movies & Series</h2>
          <p className="text-gray-400">Track what you watch.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Filter Pills */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map(f => (
            <button 
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === f.id 
                  ? 'bg-white text-black' 
                  : 'bg-[#151B28] text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {typeFilters.map(f => {
            const Icon = typeIcons[f.id] || Film;
            return (
              <button 
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  typeFilter === f.id 
                    ? 'bg-white text-black' 
                    : 'bg-[#151B28] text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && items.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-rose-500/50 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateForm}>
          <Film className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No watch items yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first item</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => {
            const TypeIcon = typeIcons[item.type] || Film;
            const StatusIcon = statusIcons[item.status] || Clock;
            
            return (
              <div key={item._id} className="modern-card overflow-hidden group">
                {/* Poster */}
                <div 
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: typeof item.poster === 'string' 
                      ? `url(${item.poster})` 
                      : item.poster?.url 
                      ? `url(${item.poster.url})`
                      : 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <TypeIcon className="w-3 h-3" />
                    {typeLabels[item.type] || item.type}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 backdrop-blur px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${statusColors[item.status]}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabels[item.status]}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg backdrop-blur transition-colors ${
                      item.isFavorite
                        ? 'bg-rose-500/80 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Action Buttons (on hover) */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(item);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg transition-colors"
                      title="Drop"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Rating (if watched) */}
                  {item.status === 'watched' && item.rating && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {item.rating}/5
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  
                  {item.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                  )}

                  {/* Series Progress */}
                  {item.type === 'series' && (item.currentSeason || item.currentEpisode) && (
                    <div className="mb-3 text-xs text-gray-400">
                      <span className="font-medium">S{item.currentSeason || '?'}</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium">E{item.currentEpisode || '?'}</span>
                    </div>
                  )}

                  {/* Platforms */}
                  {item.platforms && item.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.platforms.slice(0, 3).map((platform, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400"
                        >
                          {platform}
                        </span>
                      ))}
                      {item.platforms.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                          +{item.platforms.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Mood Tags */}
                  {item.moodTags && item.moodTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.moodTags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-rose-500/10 rounded text-xs text-rose-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Last Watched */}
                  {item.lastWatchedAt && (
                    <p className="text-xs text-gray-500">
                      Last watched: {new Date(item.lastWatchedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Watch Item Form Modal */}
      <WatchItemForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEditItem : handleCreateItem}
        item={editingItem}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default WatchView;
