import React, { useState, useEffect } from 'react';
import { Camera, Calendar, BookOpen, Trash2, Loader2, AlertCircle, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { createDiaryEntry, getDiaryEntries, archiveDiaryEntry } from '@/services/diary.service';
import type { DiaryEntry, CreateDiaryEntryData } from '@/types';
import DiaryEntryForm from './DiaryEntryForm';

const moodEmojis: Record<string, string> = {
  calm: '😌',
  happy: '😊',
  energetic: '⚡',
  sad: '😢',
  nostalgic: '📸',
  stressed: '😰',
  grateful: '🙏',
  neutral: '😐'
};

const moodLabels: Record<string, string> = {
  calm: 'Calm',
  happy: 'Happy',
  energetic: 'Energetic',
  sad: 'Sad',
  nostalgic: 'Nostalgic',
  stressed: 'Stressed',
  grateful: 'Grateful',
  neutral: 'Neutral'
};

const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  // Fetch entries
  const fetchEntries = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDiaryEntries({
        page: pageNum,
        limit: 20,
        isArchived: false
      });

      if (pageNum === 1) {
        setEntries(response.data.entries);
      } else {
        setEntries(prev => [...prev, ...response.data.entries]);
      }

      setHasMore(response.data.pagination.page < response.data.pagination.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to load diary entries');
      console.error('Error fetching entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(1);
  }, []);

  // Handle form submission
  const handleSubmit = async (data: CreateDiaryEntryData) => {
    try {
      setIsSubmitting(true);
      await createDiaryEntry(data);
      // Refresh entries
      await fetchEntries(1);
      setPage(1);
    } catch (err: any) {
      throw err; // Let form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this entry? It will be moved to archived entries.')) {
      return;
    }

    try {
      await archiveDiaryEntry(id);
      setEntries(prev => prev.filter(entry => entry._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to archive entry');
      console.error('Error archiving entry:', err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  };

  // Get content snippet
  const getSnippet = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Toggle entry expansion
  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  // Check if entry is expanded
  const isExpanded = (entryId: string) => {
    return expandedEntries.has(entryId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Memory Vault</h2>
          <p className="text-gray-400">Your digital diary.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No entries yet</p>
          <p className="text-gray-500 text-sm">Start documenting your memories</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-800">
            {entries.map(entry => (
              <div key={entry._id} className="relative pl-12 group">
                <div className="absolute left-1.5 top-6 w-5 h-5 bg-[#0B0F17] border-2 border-gray-600 rounded-full group-hover:border-indigo-500 group-hover:bg-indigo-900 transition-colors z-10"></div>
                <div className="modern-card p-6 hover:bg-[#1A2235]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      {formatDate(entry.entryDate)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg flex items-center gap-1">
                        {moodEmojis[entry.mood]} {moodLabels[entry.mood]}
                      </span>
                      {entry.isPinned && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg">
                          📌 Pinned
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Archive entry"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
                      </button>
                    </div>
                  </div>
                  
                  {entry.title && (
                    <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      "{isExpanded(entry._id) ? entry.content : getSnippet(entry.content)}"
                    </p>
                    {entry.content.length > 150 && (
                      <button
                        onClick={() => toggleExpand(entry._id)}
                        className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        {isExpanded(entry._id) ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Read more
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Images */}
                  {entry.images && entry.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {entry.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative group/image">
                          <img
                            src={image.url}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-white/10"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ))}
                      {entry.images.length > 4 && (
                        <div className="relative bg-gray-800 rounded-lg border border-white/10 flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            +{entry.images.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show photo indicator if no images but has photo placeholder */}
                  {(!entry.images || entry.images.length === 0) && (
                    <div className="h-40 w-full rounded-lg bg-gray-800 flex items-center justify-center border border-dashed border-gray-700">
                      <span className="text-xs text-gray-500 flex items-center gap-2">
                        <Camera className="w-4 h-4" /> No photos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchEntries(nextPage);
                }}
                className="px-6 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {isLoading && entries.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
            </div>
          )}
        </>
      )}

      {/* Entry Form Modal */}
      <DiaryEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default JournalView;
