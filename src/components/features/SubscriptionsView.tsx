import React, { useState, useEffect } from 'react';
import { Repeat, AlertCircle, CheckCircle, Plus, Edit2, Trash2, Loader2, TrendingUp, Calendar } from 'lucide-react';
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionSummary,
  updateSubscription,
  deleteSubscription
} from '@/services/subscription.service';
import type { Subscription, CreateSubscriptionData, SubscriptionSummary } from '@/types';
import SubscriptionForm from './SubscriptionForm';
import { useAuth } from '@/contexts/AuthContext';

const categoryColors: Record<string, string> = {
  entertainment: 'bg-red-600',
  productivity: 'bg-blue-600',
  cloud: 'bg-orange-500',
  utilities: 'bg-yellow-500',
  education: 'bg-purple-600',
  other: 'bg-gray-600',
};

const categoryEmojis: Record<string, string> = {
  entertainment: '🎬',
  productivity: '💼',
  cloud: '☁️',
  utilities: '🔧',
  education: '📚',
  other: '📦',
};

const SubscriptionsView: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');

  // Get user's default currency
  const defaultCurrency = user?.currency || 'INR';

  // Fetch subscriptions and summary
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subscriptionsRes, summaryRes] = await Promise.all([
        getSubscriptions(filter === 'all' ? {} : { status: filter }),
        getSubscriptionSummary()
      ]);

      setSubscriptions(subscriptionsRes.data);
      setSummary(summaryRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Handle form submission
  const handleSubmit = async (data: CreateSubscriptionData) => {
    try {
      setIsSubmitting(true);
      if (editingSubscription) {
        await updateSubscription(editingSubscription._id, data);
      } else {
        await createSubscription(data);
      }
      await fetchData();
      setIsFormOpen(false);
      setEditingSubscription(null);
    } catch (err: any) {
      throw err; // Let form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await deleteSubscription(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
      console.error('Error deleting subscription:', err);
    }
  };

  // Handle edit
  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get monthly cost
  const getMonthlyCost = (subscription: Subscription) => {
    if (subscription.billingCycle === 'yearly') {
      return subscription.amount / 12;
    }
    return subscription.amount;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Subscriptions Manager</h2>
          <p className="text-gray-400">Recurring expenses audit.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Monthly Total</p>
            {summary ? (
              <p className="text-3xl font-bold text-white">
                {summary.monthlyTotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: defaultCurrency
                })}
              </p>
            ) : (
              <p className="text-3xl font-bold text-white">
                {Number(0).toLocaleString('en-US', {
                  style: 'currency',
                  currency: defaultCurrency
                })}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingSubscription(null);
              setIsFormOpen(true);
            }}
            className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'paused', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-indigo-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-20">
          <Repeat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No subscriptions yet</p>
          <p className="text-gray-500 text-sm">Start tracking your recurring expenses</p>
        </div>
      ) : (
        <>
          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map(sub => (
              <div key={sub._id} className="modern-card p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${categoryColors[sub.category] || categoryColors.other}`}>
                    {sub.icon || categoryEmojis[sub.category] || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">{sub.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Renews {formatDate(sub.renewalDate)}
                      </p>
                      {sub.status === 'active' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                      {sub.status === 'paused' && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                          Paused
                        </span>
                      )}
                      {sub.status === 'cancelled' && (
                        <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-white">
                    {getMonthlyCost(sub).toLocaleString('en-US', {
                      style: 'currency',
                      currency: defaultCurrency
                    })}
                    <span className="text-xs text-gray-500 ml-1">
                      /{sub.billingCycle === 'yearly' ? 'mo' : 'mo'}
                    </span>
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="p-1.5 hover:bg-indigo-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400 hover:text-indigo-400" />
                    </button>
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Cancel"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          {summary && summary.upcomingRenewals.length > 0 && (
            <div className="modern-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Upcoming Renewals (Next 7 Days)</h3>
              </div>
              <div className="space-y-3">
                {summary.upcomingRenewals.map(renewal => {
                  const sub = subscriptions.find(s => s._id === renewal._id);
                  return (
                    <div key={renewal._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{renewal.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(renewal.renewalDate)}
                        </p>
                      </div>
                      <p className="text-white font-bold">
                        {renewal.amount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: defaultCurrency
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optimization Tips */}
          {summary && summary.optimizationTips.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0" />
                <h4 className="text-sm font-bold text-indigo-300">Optimization Tips</h4>
              </div>
              {summary.optimizationTips.map((tip, index) => (
                <div key={index} className="pl-7">
                  <p className="text-xs text-indigo-200/80">
                    <span className="font-semibold">{tip.subscriptionName}:</span> {tip.suggestion}
                  </p>
                  <p className="text-xs text-indigo-200/60 mt-1">
                    Potential savings: {tip.potentialSavings.toLocaleString('en-US', {
                      style: 'currency',
                      currency: defaultCurrency
                    })}/month
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Subscription Form Modal */}
      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubscription(null);
        }}
        onSubmit={handleSubmit}
        subscription={editingSubscription}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SubscriptionsView;
