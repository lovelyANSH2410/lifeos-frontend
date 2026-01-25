import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  TrendingUp,
  Plane,
  Wallet,
  DollarSign,
  Loader2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  FileText,
  Film
} from 'lucide-react';
import { Tab } from '@/types';
import { getDashboard } from '@/services/dashboard.service';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardData } from '@/types';

const Dashboard: React.FC<{ setActiveTab: (tab: Tab) => void }> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const defaultCurrency = user?.currency || 'INR';
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickCaptureText, setQuickCaptureText] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboard();
        setDashboardData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: defaultCurrency
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  // Count upcoming payments/subscriptions for money snapshot
  const getUpcomingCount = () => {
    if (!dashboardData) return 0;
    let count = 0;
    if (dashboardData.upcoming.nextPayment) count++;
    if (dashboardData.upcoming.nextSubscription) count++;
    return count;
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'MONEY':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'IDEA':
        return <Lightbulb className="w-4 h-4 text-purple-400" />;
      case 'DIARY':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'TRAVEL':
        return <Plane className="w-4 h-4 text-sky-400" />;
      case 'WATCH':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Get most important upcoming items (max 3)
  const upcomingItems = [
    dashboardData.upcoming.nextPayment && { type: 'payment', data: dashboardData.upcoming.nextPayment },
    dashboardData.upcoming.nextSubscription && { type: 'subscription', data: dashboardData.upcoming.nextSubscription },
    dashboardData.upcoming.nextTrip && { type: 'trip', data: dashboardData.upcoming.nextTrip }
  ].filter(Boolean).slice(0, 3);

  return (
    <div className="space-y-6 animate-enter">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          {dashboardData.greeting.message} 👋
        </h1>
        <p className="text-gray-400 text-lg">Here's a quick look at what matters today</p>
      </div>

      {/* UPCOMING - Horizontal Cards */}
      {upcomingItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingItems.map((item, index) => {
            if (item?.type === 'payment') {
              const payment = item.data as typeof dashboardData.upcoming.nextPayment;
              return (
                <div
                  key={index}
                  onClick={() => setActiveTab(Tab.Money)}
                  className="modern-card p-6 cursor-pointer group hover:bg-[#1A2235] transition-colors rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PAYMENT</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{payment.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">in {payment.dueInDays} days</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(payment.amount)}</p>
                </div>
              );
            }
            
            if (item?.type === 'subscription') {
              const subscription = item.data as typeof dashboardData.upcoming.nextSubscription;
              const renewsText = subscription.renewsInDays === 0 
                ? 'Renews today' 
                : subscription.renewsInDays === 1 
                ? 'Renews tomorrow'
                : `Renews in ${subscription.renewsInDays} days`;
              
              return (
                <div
                  key={index}
                  onClick={() => setActiveTab(Tab.Subscriptions)}
                  className="modern-card p-6 cursor-pointer group hover:bg-[#1A2235] transition-colors rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SUBSCRIPTION</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{subscription.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{renewsText}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(subscription.amount)}</p>
                </div>
              );
            }
            
            if (item?.type === 'trip') {
              const trip = item.data as typeof dashboardData.upcoming.nextTrip;
              return (
                <div
                  key={index}
                  onClick={() => setActiveTab(Tab.Travel)}
                  className="modern-card p-6 cursor-pointer group hover:bg-[#1A2235] transition-colors rounded-2xl relative overflow-hidden"
                >
                  {trip.image && (
                    <div className="absolute inset-0 opacity-10">
                      <img 
                        src={trip.image} 
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Plane className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">TRIP</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{trip.title}</h3>
                    <p className="text-sm text-gray-400">in {trip.startsInDays} days</p>
                  </div>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      )}

      {/* MONEY SNAPSHOT & CONTINUE WATCHING - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Money Snapshot */}
        <div className="modern-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MONEY SNAPSHOT</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {formatCurrency(dashboardData.moneySnapshot.currentBalance)}
            </p>
            {getUpcomingCount() > 0 && (
              <p className="text-sm text-gray-400">
                {getUpcomingCount()} {getUpcomingCount() === 1 ? 'payment' : 'payments'} ahead
              </p>
            )}
          </div>
        </div>

        {/* Continue Watching */}
        {dashboardData.continueWatching && (
          <div
            onClick={() => setActiveTab(Tab.Entertainment)}
            className="modern-card p-6 cursor-pointer group hover:bg-[#1A2235] transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">CONTINUE WATCHING</span>
            </div>
            <div className="flex gap-4">
              {dashboardData.continueWatching.poster && (
                <img 
                  src={typeof dashboardData.continueWatching.poster === 'string' 
                    ? dashboardData.continueWatching.poster 
                    : dashboardData.continueWatching.poster} 
                  alt={dashboardData.continueWatching.title}
                  className="w-16 h-24 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{dashboardData.continueWatching.title}</h3>
                {dashboardData.continueWatching.type === 'series' && dashboardData.continueWatching.season && dashboardData.continueWatching.episode && (
                  <p className="text-sm text-gray-400 mb-2">
                    S{dashboardData.continueWatching.season} E{dashboardData.continueWatching.episode}
                  </p>
                )}
                {dashboardData.continueWatching.platform && (
                  <p className="text-xs text-gray-500 mb-3">{dashboardData.continueWatching.platform}</p>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(Tab.Entertainment);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK CAPTURE & RECENT ACTIVITY - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Capture */}
        {dashboardData.quickCapture.enabled && (
          <div className="lg:col-span-2">
            <div className="modern-card p-6 rounded-2xl h-full">
              <textarea
                value={quickCaptureText}
                onChange={(e) => setQuickCaptureText(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (quickCaptureText.trim()) {
                      setActiveTab(Tab.Ideas);
                      setQuickCaptureText('');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Save as Idea
                </button>
                <button
                  onClick={() => {
                    if (quickCaptureText.trim()) {
                      setActiveTab(Tab.Journal);
                      setQuickCaptureText('');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Save as Diary
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 text-gray-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Save as Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {dashboardData.recentActivity.length > 0 && (
          <div className="lg:col-span-1">
            <div className="modern-card p-6 rounded-2xl h-full flex flex-col">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Activity</h3>
              <div className="space-y-2 flex-1">
                {dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (activity.type === 'TRAVEL') setActiveTab(Tab.Travel);
                      else if (activity.type === 'MONEY') setActiveTab(Tab.Money);
                      else if (activity.type === 'IDEA') setActiveTab(Tab.Ideas);
                      else if (activity.type === 'DIARY') setActiveTab(Tab.Journal);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <span className="text-gray-300 text-xs flex-1 line-clamp-1">{activity.message}</span>
                    <span className="text-gray-500 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {getTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
