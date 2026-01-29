import React, { useState, useEffect } from 'react';
import { Repeat, AlertCircle, CheckCircle, Plus, Edit2, Trash2, Loader2, TrendingUp, Calendar } from 'lucide-react';
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionSummary,
  updateSubscription,
  deleteSubscription
} from '@/services/subscription.service';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, isSubscriptionLimitError } from '@/utils/error.util';
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
  const { showError, showUpgrade } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
  const screenSize = useScreenSize();

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
      const errorMessage = extractErrorMessage(err);
      
      // Show toast for subscription limit errors
      if (isSubscriptionLimitError(err)) {
        showUpgrade(errorMessage);
      } else {
        showError(errorMessage);
      }
      
      throw err; // Also throw to let form handle the error
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
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-enter">
      {/* Header - Mobile optimized */}
      <div className={`${screenSize === 'mobile' ? 'space-y-4' : 'flex justify-between items-end'}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Subscriptions Manager</h2>
            {/* Mobile: Small add button beside title */}
            <button
              onClick={() => {
                setEditingSubscription(null);
                setIsFormOpen(true);
              }}
              className="sm:hidden w-8 h-8 rounded-lg bg-white hover:bg-gray-200 text-black flex items-center justify-center transition-all shadow-md flex-shrink-0 ml-3"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Recurring expenses audit.</p>
        </div>
        {/* Monthly Total - Hidden on mobile, shown on tablet+ */}
        <div className={`${screenSize === 'mobile' ? 'hidden' : 'flex'} items-center gap-4`}>
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
          {/* Desktop/Tablet: Show button in header */}
          <button
            onClick={() => {
              setEditingSubscription(null);
              setIsFormOpen(true);
            }}
            className="hidden sm:flex bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Mobile: Monthly Total Card */}
      {screenSize === 'mobile' && summary && (
        <div className="modern-card p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-1">Monthly Total</p>
          <p className="text-xl sm:text-2xl font-bold text-white">
            {summary.monthlyTotal.toLocaleString('en-US', {
              style: 'currency',
              currency: defaultCurrency
            })}
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      {screenSize === 'mobile' ? (
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2">
          <div className="flex gap-2 pl-1" style={{ width: 'max-content' }}>
            {(['all', 'active', 'paused', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap snap-start ${
                  filter === status
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ) : (
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
      )}

      {/* Error State */}
      {error && (
        <div className={`flex items-center gap-2 ${screenSize === 'mobile' ? 'p-3' : 'p-4'} bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400`}>
          <AlertCircle className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
          <span className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-20">
          <Repeat className={`${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} text-gray-600 mx-auto mb-4`} />
          <p className={`text-gray-400 ${screenSize === 'mobile' ? 'text-base' : 'text-lg'} mb-2`}>No subscriptions yet</p>
          <p className={`text-gray-500 ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>Start tracking your recurring expenses</p>
        </div>
      ) : (
        <>
          {/* Subscriptions Grid */}
          <div className={`grid gap-4 ${
            screenSize === 'mobile' 
              ? 'grid-cols-1' 
              : screenSize === 'tablet' 
              ? 'grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {subscriptions.map(sub => (
              <div key={sub._id} className={`modern-card ${screenSize === 'mobile' ? 'p-4' : 'p-5'} flex items-center justify-between group`}>
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`${screenSize === 'mobile' ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'} rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ${categoryColors[sub.category] || categoryColors.other}`}>
                    {sub.icon || categoryEmojis[sub.category] || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-white ${screenSize === 'mobile' ? 'text-base' : 'text-lg'} truncate`}>{sub.name}</h3>
                    <div className={`flex items-center ${screenSize === 'mobile' ? 'flex-col items-start' : 'gap-2'} gap-1 mt-1`}>
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
                <div className={`text-right ${screenSize === 'mobile' ? 'ml-2' : 'ml-4'} flex-shrink-0`}>
                  <p className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white`}>
                    {getMonthlyCost(sub).toLocaleString('en-US', {
                      style: 'currency',
                      currency: defaultCurrency
                    })}
                    <span className="text-xs text-gray-500 ml-1">
                      /{sub.billingCycle === 'yearly' ? 'mo' : 'mo'}
                    </span>
                  </p>
                  <div className={`flex justify-end gap-2 mt-2 ${screenSize === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button
                      onClick={() => handleEdit(sub)}
                      className="p-1.5 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className={`${screenSize === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400 hover:text-indigo-400`} />
                    </button>
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <Trash2 className={`${screenSize === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400 hover:text-rose-400`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          {summary && summary.upcomingRenewals.length > 0 && (
            <div className={`modern-card ${screenSize === 'mobile' ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-indigo-400`} />
                <h3 className={`${screenSize === 'mobile' ? 'text-base' : 'text-lg'} font-bold text-white`}>Upcoming Renewals (Next 7 Days)</h3>
              </div>
              <div className="space-y-3">
                {summary.upcomingRenewals.map(renewal => {
                  const sub = subscriptions.find(s => s._id === renewal._id);
                  return (
                    <div key={renewal._id} className={`flex items-center justify-between ${screenSize === 'mobile' ? 'p-2.5' : 'p-3'} bg-white/5 rounded-lg`}>
                      <div>
                        <p className={`text-white ${screenSize === 'mobile' ? 'text-sm' : ''} font-medium`}>{renewal.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(renewal.renewalDate)}
                        </p>
                      </div>
                      <p className={`text-white ${screenSize === 'mobile' ? 'text-sm' : ''} font-bold`}>
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
            <div className={`${screenSize === 'mobile' ? 'p-3' : 'p-4'} rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-indigo-400 shrink-0`} />
                <h4 className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} font-bold text-indigo-300`}>Optimization Tips</h4>
              </div>
              {summary.optimizationTips.map((tip, index) => (
                <div key={index} className={`${screenSize === 'mobile' ? 'pl-5' : 'pl-7'}`}>
                  <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-indigo-200/80`}>
                    <span className="font-semibold">{tip.subscriptionName}:</span> {tip.suggestion}
                  </p>
                  <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-indigo-200/60 mt-1`}>
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
