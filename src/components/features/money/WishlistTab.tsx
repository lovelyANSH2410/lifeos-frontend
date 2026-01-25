import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Loader2, AlertCircle, Edit2, Trash2, DollarSign, Calendar, Star } from 'lucide-react';
import { createWishlistItem, getWishlistItems, updateWishlistItem, deleteWishlistItem } from '@/services/wishlist.service';
import { useAuth } from '@/contexts/AuthContext';
import type { WishlistItem, CreateWishlistItemData } from '@/types';
import WishlistForm from './WishlistForm';

const WishlistTab: React.FC = () => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'bought' | 'removed'>('all');

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (filter !== 'all') {
        filters.status = filter;
      }
      const response = await getWishlistItems(filters);
      setItems(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
      console.error('Fetch wishlist error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const handleCreateItem = async (data: CreateWishlistItemData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createWishlistItem(data);
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to create wishlist item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (data: CreateWishlistItemData) => {
    if (!editingItem) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await updateWishlistItem(editingItem._id, data);
      setIsFormOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update wishlist item');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wishlist item?')) {
      return;
    }

    try {
      await deleteWishlistItem(id);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete wishlist item');
      alert(err.message || 'Failed to delete wishlist item');
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: defaultCurrency
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bought':
        return 'bg-green-500/20 text-green-400';
      case 'removed':
        return 'bg-gray-500/20 text-gray-400';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Wishlist</h3>
          <p className="text-gray-400 text-sm">Planned spending and goals</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'bought', label: 'Bought' },
          { id: 'removed', label: 'Removed' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === f.id
                ? 'bg-white text-black'
                : 'bg-[#151B28] text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600">
          <ShoppingBag className="w-8 h-8 mb-4 opacity-50" />
          <span className="font-bold">No wishlist items yet</span>
          <span className="text-sm text-gray-500 mt-2">Click to add your first item</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="modern-card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-white flex-1">{item.name}</h4>
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsFormOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <p className="text-xl font-bold text-white">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority} priority
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {item.plannedMonth && (
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  Planned: {item.plannedMonth}
                </div>
              )}

              <div className="flex gap-2">
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleEditItem({ ...item, status: 'bought' })}
                    className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Mark Bought
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <WishlistForm
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

export default WishlistTab;
