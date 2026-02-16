import { useState, useEffect } from 'react';
import { getUserSubscription } from '@/services/userSubscription.service';
import { getDiaryEntries } from '@/services/diary.service';
import { getIdeas } from '@/services/idea.service';
import { getTrips } from '@/services/trip.service';
import { getWatchItems } from '@/services/watch.service';
import { getGiftIdeas } from '@/services/gifting.service';
import { getSubscriptions } from '@/services/subscription.service';
import { getVaultItems } from '@/services/vault.service';
import { getVaultDocuments } from '@/services/document.service';
import { getFeatureLimit, getFeatureDisplayName } from '@/services/subscriptionLimit.service';
import type { UserSubscription } from '@/types';

interface UseSubscriptionLimitResult {
  limit: number;
  currentCount: number;
  remaining: number;
  canCreate: boolean;
  isUnlimited: boolean;
  isLoading: boolean;
  error: string | null;
  displayName: string;
}

/**
 * Hook to check subscription limits for a feature
 * @param featureName - Feature name (diary, ideas, travel, watch, gifting, subscriptions, vault, documents)
 * @param enabled - Whether to fetch count (default: true). Set to false to disable automatic fetching.
 * @returns Subscription limit information
 */
export const useSubscriptionLimit = (featureName: string, enabled: boolean = true): UseSubscriptionLimitResult => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch subscription
        const subResponse = await getUserSubscription();
        setSubscription(subResponse.data);

        // Fetch and count items based on feature
        // Use a reasonable limit instead of 1000 to avoid unnecessary data transfer
        let count = 0;
        try {
          switch (featureName) {
            case 'diary':
              // Fetch with a limit that covers the max FREE plan limit (10) + buffer
              const diaryResponse = await getDiaryEntries({ isArchived: false, limit: 50 });
              count = diaryResponse.data?.entries?.length || 0;
              break;
            case 'ideas':
              // Fetch with a limit that covers the max FREE plan limit (20) + buffer
              const allIdeasResponse = await getIdeas({ limit: 50 });
              count = (allIdeasResponse.data?.ideas || []).filter(
                (idea: any) => idea.status !== 'archived'
              ).length;
              break;
            case 'travel':
              // Fetch with a limit that covers the max FREE plan limit (5) + buffer
              const tripsResponse = await getTrips({ limit: 20 });
              count = tripsResponse.data?.trips?.length || 0;
              break;
            case 'watch':
              const watchResponse = await getWatchItems();
              count = watchResponse.data?.items?.length || 0;
              break;
            case 'gifting':
              // Fetch with a limit that covers the max FREE plan limit (20) + buffer
              const giftingResponse = await getGiftIdeas();
              count = (giftingResponse.data?.ideas || []).filter(
                (idea: any) => idea.status !== 'archived'
              ).length;
              break;
            case 'subscriptions':
              const subsResponse = await getSubscriptions();
              // Count only active/paused subscriptions
              count = (subsResponse.data?.subscriptions || []).filter(
                (sub: any) => sub.status === 'active' || sub.status === 'paused'
              ).length;
              break;
            case 'vault':
              const vaultResponse = await getVaultItems();
              count = vaultResponse.data?.length || 0;
              break;
            case 'documents':
              const docsResponse = await getVaultDocuments({ isArchived: false });
              count = docsResponse.data?.length || 0;
              break;
            default:
              count = 0;
          }
        } catch (err: any) {
          console.error(`Error counting ${featureName} items:`, err);
          // Don't fail the whole hook if count fails
          count = 0;
        }

        setCurrentCount(count);
      } catch (err: any) {
        setError(err.message || 'Failed to load subscription limit');
        console.error('Error fetching subscription limit:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [featureName, enabled]);

  // Only calculate limit and canCreate when we have subscription data (or when loading is complete)
  // During loading, subscription might be null, but getFeatureLimit handles that by defaulting to FREE plan
  const limit = getFeatureLimit(subscription, featureName);
  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? -1 : Math.max(0, limit - currentCount);
  
  // canCreate should be true if:
  // - limit is -1 (unlimited), OR
  // - limit > 0 AND remaining > 0 (has remaining slots)
  // canCreate should be false if:
  // - limit is 0 (feature blocked), OR
  // - limit > 0 AND remaining === 0 (limit reached)
  // During loading, default to true to avoid blocking user prematurely
  const canCreate = isLoading 
    ? true  // Default to allowing during load to prevent premature blocking
    : (limit === 0 ? false : (isUnlimited || (limit > 0 && remaining > 0)));
  
  const displayName = getFeatureDisplayName(featureName);

  return {
    limit,
    currentCount,
    remaining,
    canCreate,
    isUnlimited,
    isLoading,
    error,
    displayName
  };
};
