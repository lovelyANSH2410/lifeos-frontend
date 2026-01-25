import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Loader2, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { createIdea, getIdeas, updateIdea, deleteIdea } from '@/services/idea.service';
import { useScreenSize } from '@/hooks/useScreenSize';
import BottomSheet from '@/components/common/BottomSheet';
import type { Idea, CreateIdeaData } from '@/types';
import IdeaCard from './IdeaCard';
import IdeaForm from './IdeaForm';
import IdeaDetailModal from './IdeaDetailModal';

const IdeaInboxView: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('inbox');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const screenSize = useScreenSize();

  // Fetch ideas
  const fetchIdeas = async (pageNum: number = 1, status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIdeas({
        status: status || 'inbox',
        page: pageNum,
        limit: 20
      });

      if (pageNum === 1) {
        setIdeas(response.data.ideas);
      } else {
        setIdeas(prev => [...prev, ...response.data.ideas]);
      }

      setHasMore(response.data.pagination.page < response.data.pagination.pages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load ideas');
      console.error('Fetch ideas error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(1, statusFilter);
  }, [statusFilter]);

  const handleCreateIdea = async (data: CreateIdeaData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createIdea(data);
      setIsFormOpen(false);
      fetchIdeas(1, statusFilter);
    } catch (err: any) {
      setError(err.message || 'Failed to create idea');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIdea = async (data: CreateIdeaData) => {
    if (!editingIdea) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateIdea(editingIdea._id, data);
      setIsFormOpen(false);
      setEditingIdea(null);
      fetchIdeas(1, statusFilter);
      if (selectedIdea?._id === editingIdea._id) {
        setIsDetailOpen(false);
        setSelectedIdea(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update idea');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idea: Idea) => {
    if (!confirm('Are you sure you want to archive this idea?')) {
      return;
    }

    try {
      await deleteIdea(idea._id);
      fetchIdeas(1, statusFilter);
      if (selectedIdea?._id === idea._id) {
        setIsDetailOpen(false);
        setSelectedIdea(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete idea');
      alert(err.message || 'Failed to delete idea');
    }
  };

  const handleStatusChange = async (idea: Idea, newStatus: Idea['status']) => {
    try {
      await updateIdea(idea._id, { status: newStatus });
      fetchIdeas(1, statusFilter);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      alert(err.message || 'Failed to update status');
    }
  };

  const openCreateForm = () => {
    setEditingIdea(null);
    setIsFormOpen(true);
  };

  const openEditForm = (idea: Idea) => {
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  const openDetail = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8 animate-enter">
      {/* Header - Matching Travel Plans */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Idea Inbox</h2>
          <p className="text-gray-400 text-sm">A place for thoughts you don't want to lose.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Idea
        </button>
      </div>

      {/* Filter Pills - Desktop/Tablet */}
      <div className="hidden sm:flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === ''
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('inbox')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'inbox'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setStatusFilter('saved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'saved'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Saved
        </button>
        <button
          onClick={() => setStatusFilter('explored')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'explored'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Explored
        </button>
        <button
          onClick={() => setStatusFilter('archived')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'archived'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && ideas.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-gray-700 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateForm}>
          <Sparkles className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">Got a random thought?</span>
          <span className="text-sm text-gray-500 mt-2">Save it before it disappears.</span>
        </div>
      ) : (
        <>
          {/* Ideas List - Vertical flow matching Diary */}
          {/* Mobile: Timeline feed, Tablet: 2-column grid */}
          <div className={`grid gap-4 ${
            screenSize === 'mobile' 
              ? 'grid-cols-1' 
              : screenSize === 'tablet' 
              ? 'grid-cols-2' 
              : 'grid-cols-1'
          }`}>
            {ideas.map(idea => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onView={openDetail}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchIdeas(page + 1, statusFilter)}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Mobile: Filter Button */}
      {screenSize === 'mobile' && (
        <button
          onClick={() => setIsFilterOpen(true)}
          className="fixed bottom-32 right-4 w-12 h-12 rounded-full bg-[#151B28] border border-white/10 text-white shadow-lg flex items-center justify-center transition-all z-40"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
        >
          <Filter className="w-5 h-5" />
        </button>
      )}

      {/* Mobile: Filter Bottom Sheet */}
      {screenSize === 'mobile' && (
        <BottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filter Ideas"
        >
          <div className="p-6 space-y-2">
            {['', 'inbox', 'saved', 'explored', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  statusFilter === status
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Idea Form Modal */}
      <IdeaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIdea(null);
        }}
        onSubmit={editingIdea ? handleEditIdea : handleCreateIdea}
        idea={editingIdea}
        isLoading={isSubmitting}
      />

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedIdea(null);
        }}
        idea={selectedIdea}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />

      {/* FAB for Mobile */}
      {screenSize === 'mobile' && (
        <button
          onClick={openCreateForm}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all z-40"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default IdeaInboxView;
