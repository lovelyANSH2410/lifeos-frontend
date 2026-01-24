import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Trash2, Edit2, Loader2, AlertCircle, Plus, BookOpen } from 'lucide-react';
import { createTrip, getTrips, getTripSummary, updateTrip, deleteTrip } from '@/services/trip.service';
import { createDiaryEntry } from '@/services/diary.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Trip, CreateTripData, TripSummary, CreateDiaryEntryData } from '@/types';
import TripForm from './TripForm';

const statusLabels: Record<string, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ongoing: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const TravelView: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'USD';
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch trips
  const fetchTrips = async (pageNum: number = 1, status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTrips({
        status: status || undefined,
        page: pageNum,
        limit: 20
      });

      if (pageNum === 1) {
        setTrips(response.data.trips);
      } else {
        setTrips(prev => [...prev, ...response.data.trips]);
      }

      setHasMore(response.data.pagination.page < response.data.pagination.pages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load trips');
      console.error('Fetch trips error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await getTripSummary();
      setSummary(response.data);
    } catch (err: any) {
      console.error('Fetch summary error:', err);
    }
  };

  useEffect(() => {
    fetchTrips(1, statusFilter);
    fetchSummary();
  }, [statusFilter]);

  const handleCreateTrip = async (data: CreateTripData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createTrip(data);
      setIsFormOpen(false);
      fetchTrips(1, statusFilter);
      fetchSummary();
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTrip = async (data: CreateTripData) => {
    if (!editingTrip) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateTrip(editingTrip._id, data);
      setIsFormOpen(false);
      setEditingTrip(null);
      fetchTrips(1, statusFilter);
      fetchSummary();
    } catch (err: any) {
      setError(err.message || 'Failed to update trip');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) {
      return;
    }

    try {
      await deleteTrip(tripId);
      fetchTrips(1, statusFilter);
      fetchSummary();
    } catch (err: any) {
      setError(err.message || 'Failed to delete trip');
      alert(err.message || 'Failed to delete trip');
    }
  };

  /**
   * Convert trip cover image URL to File object
   */
  const urlToFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error('Failed to convert image URL to File:', error);
      return null;
    }
  };

  /**
   * Convert completed trip to diary entry
   */
  const handleAddToDiary = async (trip: Trip) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Build diary entry content
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      };

      let content = `Trip to ${trip.location.city}, ${trip.location.country}\n\n`;
      content += `Dates: ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}\n\n`;
      
      if (trip.budget?.estimated) {
        content += `Budget: ${trip.budget.estimated.toLocaleString('en-US', {
          style: 'currency',
          currency: trip.budget.currency || defaultCurrency
        })}\n\n`;
      }

      if (trip.notes) {
        content += `Notes:\n${trip.notes}\n\n`;
      }

      content += `What an amazing journey! ✈️`;

      // Prepare diary entry data
      const diaryData: CreateDiaryEntryData = {
        title: `Trip to ${trip.location.city}`,
        content: content.trim(),
        mood: 'grateful', // Default mood for completed trips
        entryDate: trip.endDate, // Use trip end date
        isPinned: trip.isPinned,
        images: []
      };

      // Try to fetch and convert cover image if available
      if (trip.coverImage?.url) {
        try {
          const imageFile = await urlToFile(
            trip.coverImage.url,
            `trip-${trip._id}-cover.jpg`
          );
          if (imageFile) {
            diaryData.images = [imageFile];
          }
        } catch (error) {
          console.error('Failed to fetch trip cover image:', error);
          // Continue without image if fetch fails
        }
      }

      // Create diary entry
      await createDiaryEntry(diaryData);

      // Show success message
      alert('Trip added to diary successfully! 🎉');

      // Optionally refresh trips to show updated state
      fetchTrips(1, statusFilter);
    } catch (err: any) {
      setError(err.message || 'Failed to add trip to diary');
      alert(err.message || 'Failed to add trip to diary');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateForm = () => {
    setEditingTrip(null);
    setIsFormOpen(true);
  };

  const openEditForm = (trip: Trip) => {
    setEditingTrip(trip);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Travel Plans</h2>
          {summary && (
            <div className="flex gap-4 text-sm text-gray-400">
              <span>{summary.upcomingCount} Upcoming</span>
              <span>•</span>
              <span>{summary.completedCount} Completed</span>
              {summary.nextTrip && (
                <>
                  <span>•</span>
                  <span className="text-indigo-400">
                    Next: {summary.nextTrip.location.city}, {summary.nextTrip.location.country}
                    {summary.nextTrip.daysToGo !== undefined && ` (${summary.nextTrip.daysToGo} days)`}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={openCreateForm}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Plan Trip
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
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
          onClick={() => setStatusFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'upcoming'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setStatusFilter('ongoing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'ongoing'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setStatusFilter('past')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'past'
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Past
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
      {isLoading && trips.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : trips.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-gray-700 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateForm}>
          <Plane className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">Dreaming of somewhere?</span>
          <span className="text-sm text-gray-500 mt-2">Click to plan your first trip</span>
        </div>
      ) : (
        <>
          {/* Trips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trips.map(trip => (
              <div key={trip._id} className="modern-card overflow-hidden group">
                {/* Cover Image */}
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: trip.coverImage?.url 
                      ? `url(${trip.coverImage.url})`
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border ${statusColors[trip.status] || statusColors.upcoming}`}>
                    {statusLabels[trip.status] || trip.status}
                  </div>

                  {/* Days to Go for Upcoming */}
                  {trip.status === 'upcoming' && trip.daysToGo !== undefined && (
                    <div className="absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/80 text-white border border-indigo-400/30">
                      {trip.daysToGo} {trip.daysToGo === 1 ? 'day' : 'days'} to go
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {trip.status === 'completed' && (
                      <button
                        onClick={() => handleAddToDiary(trip)}
                        disabled={isSubmitting}
                        className="p-2 bg-indigo-500/80 hover:bg-indigo-500 backdrop-blur-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add to Diary"
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(trip)}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg transition-colors"
                      title="Edit Trip"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {trip.location.city}, {trip.location.country}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">{trip.title}</h3>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>

                  {/* Budget */}
                  {trip.budget?.estimated && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="text-lg font-bold text-white">
                        {trip.budget.estimated.toLocaleString('en-US', {
                          style: 'currency',
                          currency: trip.budget.currency || defaultCurrency
                        })}
                      </p>
                    </div>
                  )}

                  {/* Notes Preview */}
                  {trip.notes && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {trip.notes}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      {trip.isPinned && (
                        <span className="text-xs text-indigo-400 font-medium">📌 Pinned</span>
                      )}
                    </div>
                    {trip.status === 'completed' && (
                      <button
                        onClick={() => handleAddToDiary(trip)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/20"
                      >
                        <BookOpen className="w-4 h-4" />
                        {isSubmitting ? 'Adding...' : 'Add to Diary'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchTrips(page + 1, statusFilter)}
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

      {/* Trip Form Modal */}
      <TripForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={editingTrip ? handleEditTrip : handleCreateTrip}
        trip={editingTrip}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TravelView;
