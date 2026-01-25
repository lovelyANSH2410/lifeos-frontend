import React, { useState, useEffect } from 'react';
import { Heart, Gift, MapPin, ExternalLink, Plus, Coffee, Home, Loader2, AlertCircle, Edit2, Trash2, Star, Sparkles } from 'lucide-react';
import { createGiftIdea, getGiftIdeas, updateGiftIdea, deleteGiftIdea } from '@/services/gifting.service';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenSize } from '@/hooks/useScreenSize';
import type { GiftIdea, CreateGiftIdeaData } from '@/types';
import GiftIdeaForm from './GiftIdeaForm';

const typeLabels: Record<string, string> = {
  cafe: 'Cafe',
  stay: 'Stay',
  gift: 'Gift',
  activity: 'Activity',
  experience: 'Experience',
  other: 'Other'
};

const typeIcons: Record<string, any> = {
  cafe: Coffee,
  stay: Home,
  gift: Gift,
  activity: Heart,
  experience: Sparkles,
  other: Gift
};

const DateNightView: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'USD';
  
  const [ideas, setIdeas] = useState<GiftIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<GiftIdea | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const screenSize = useScreenSize();

  // Fetch ideas
  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (filter !== 'all') {
        filters.type = filter;
      }
      const response = await getGiftIdeas(filters);
      setIdeas(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load ideas');
      console.error('Fetch ideas error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filter]);

  const handleCreateIdea = async (data: CreateGiftIdeaData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createGiftIdea(data);
      setIsFormOpen(false);
      fetchIdeas();
    } catch (err: any) {
      setError(err.message || 'Failed to create idea');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIdea = async (data: CreateGiftIdeaData) => {
    if (!editingIdea) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateGiftIdea(editingIdea._id, data);
      setIsFormOpen(false);
      setEditingIdea(null);
      fetchIdeas();
    } catch (err: any) {
      setError(err.message || 'Failed to update idea');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this idea?')) {
      return;
    }

    try {
      await deleteGiftIdea(id);
      fetchIdeas();
    } catch (err: any) {
      setError(err.message || 'Failed to delete idea');
      alert(err.message || 'Failed to delete idea');
    }
  };

  const handleToggleFavorite = async (idea: GiftIdea) => {
    try {
      await updateGiftIdea(idea._id, { isFavorite: !idea.isFavorite });
      fetchIdeas();
    } catch (err: any) {
      setError(err.message || 'Failed to update favorite');
      alert(err.message || 'Failed to update favorite');
    }
  };

  const openCreateForm = () => {
    setEditingIdea(null);
    setIsFormOpen(true);
  };

  const openEditForm = (idea: GiftIdea) => {
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  const getPriceDisplay = (price?: { amount: number; currency: string }) => {
    if (!price) return null;
    return price.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: price.currency || defaultCurrency
    });
  };

  const getLocationDisplay = (location?: { name?: string; city?: string; country?: string }) => {
    if (!location) return null;
    const parts = [location.name, location.city, location.country].filter(Boolean);
    return parts.join(', ') || null;
  };

  const filterOptions = [
    { id: 'all', label: 'All', icon: null },
    { id: 'cafe', label: 'Cafes', icon: Coffee },
    { id: 'stay', label: 'Stays', icon: Home },
    { id: 'gift', label: 'Gifts', icon: Gift },
    { id: 'activity', label: 'Activities', icon: Heart },
    { id: 'experience', label: 'Experiences', icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gifting & Dates</h2>
          <p className="text-gray-400">Never run out of ideas.</p>
        </div>
        {/* Desktop/Tablet: Show button in header */}
        <button
          onClick={openCreateForm}
          className="hidden sm:flex bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Idea
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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map(f => {
          const Icon = f.icon;
          return (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                filter === f.id 
                  ? 'bg-white text-black' 
                  : 'bg-[#151B28] text-gray-400 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />} {f.label}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && ideas.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-rose-500/50 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateForm}>
          <Heart className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No ideas yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first idea</span>
        </div>
      ) : (
        <div className={`grid gap-4 sm:gap-6 ${
          screenSize === 'mobile' 
            ? 'grid-cols-2' 
            : screenSize === 'tablet' 
            ? 'grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {ideas.map(idea => {
            const TypeIcon = typeIcons[idea.type] || Gift;
            const mainImage = idea.images && idea.images.length > 0 ? idea.images[0].url : null;
            
            return (
              <div key={idea._id} className="modern-card overflow-hidden group">
                {/* Image */}
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: mainImage 
                      ? `url(${mainImage})`
                      : 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <TypeIcon className="w-3 h-3" />
                    {typeLabels[idea.type] || idea.type}
                  </div>

                  {/* Price Badge */}
                  {idea.price && (
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white">
                      {getPriceDisplay(idea.price)}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(idea);
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg backdrop-blur transition-colors ${
                      idea.isFavorite
                        ? 'bg-rose-500/80 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    title={idea.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${idea.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Action Buttons (on hover) */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(idea);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(idea._id);
                      }}
                      className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{idea.title}</h3>
                  
                  {idea.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{idea.description}</p>
                  )}

                  {getLocationDisplay(idea.location) && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                      <MapPin className="w-3 h-3" />
                      {getLocationDisplay(idea.location)}
                    </div>
                  )}

                  {idea.link && (
                    <a
                      href={idea.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-rose-400 text-xs font-bold hover:underline mb-3"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Online
                    </a>
                  )}

                  {/* Tags */}
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                          +{idea.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      idea.status === 'idea' ? 'bg-gray-500/20 text-gray-400' :
                      idea.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                      idea.status === 'used' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gift Idea Form Modal */}
      <GiftIdeaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIdea(null);
        }}
        onSubmit={editingIdea ? handleEditIdea : handleCreateIdea}
        idea={editingIdea}
        isLoading={isSubmitting}
      />

      {/* FAB for Mobile */}
      {screenSize === 'mobile' && (
        <button
          onClick={openCreateForm}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center transition-all z-40"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default DateNightView;
