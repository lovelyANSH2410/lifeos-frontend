import type { UserSubscription, SubscriptionPlan } from '@/types';

/**
 * Feature display names mapping
 */
export const FEATURE_DISPLAY_NAMES: Record<string, string> = {
  diary: 'Diary Entries',
  ideas: 'Ideas',
  travel: 'Travel Plans',
  watch: 'Watch Items',
  gifting: 'Gift Ideas',
  subscriptions: 'Subscriptions',
  vault: 'Vault Credentials',
  documents: 'Vault Documents'
};

/**
 * Get feature limit based on subscription plan
 * @param subscription - User subscription
 * @param featureName - Feature name
 * @returns Limit (-1 for unlimited, 0 for no access, >0 for specific limit)
 */
export const getFeatureLimit = (
  subscription: UserSubscription | null,
  featureName: string
): number => {
  if (!subscription) {
    // Default to FREE plan limits
    return getFeatureLimitForPlan('FREE', featureName);
  }

  const plan = subscription.plan;
  const isActive = subscription.isActive;

  // If subscription is not active and not FREE, fall back to FREE limits
  if (!isActive && plan !== 'FREE') {
    return getFeatureLimitForPlan('FREE', featureName);
  }

  return getFeatureLimitForPlan(plan, featureName);
};

/**
 * Get feature limit for a specific plan
 */
const getFeatureLimitForPlan = (plan: SubscriptionPlan, featureName: string): number => {
  const limits: Record<string, Record<SubscriptionPlan, number>> = {
    diary: {
      FREE: 10,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    ideas: {
      FREE: 20,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    travel: {
      FREE: 5,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    watch: {
      FREE: 50,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    gifting: {
      FREE: 20,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    subscriptions: {
      FREE: 5,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    vault: {
      FREE: 0,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    },
    documents: {
      FREE: 0,
      PRO: -1,
      COUPLE: -1,
      LIFETIME: -1
    }
  };

  const featureLimits = limits[featureName];
  if (!featureLimits) {
    return -1; // Unknown feature - unlimited
  }

  return featureLimits[plan] ?? 0;
};

/**
 * Check if user can access a feature
 */
export const canAccessFeature = (
  subscription: UserSubscription | null,
  featureName: string
): boolean => {
  const limit = getFeatureLimit(subscription, featureName);
  
  // 0 means no access, -1 means unlimited, >0 means limited access
  return limit !== 0;
};

/**
 * Get feature display name
 */
export const getFeatureDisplayName = (featureName: string): string => {
  return FEATURE_DISPLAY_NAMES[featureName] || featureName;
};
