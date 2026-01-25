import { API_BASE_URL, USER_SUBSCRIPTION_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type { UserSubscription } from '@/types';

/**
 * Get stored auth token
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Make API request with authentication
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data as T;
};

/**
 * Get current user subscription
 */
export const getUserSubscription = async (): Promise<{ success: boolean; message: string; data: UserSubscription }> => {
  return await apiRequest<{ success: boolean; message: string; data: UserSubscription }>(
    USER_SUBSCRIPTION_ENDPOINTS.GET
  );
};

/**
 * Upgrade subscription (placeholder - payment integration later)
 */
export const upgradeSubscription = async (plan: 'PRO' | 'COUPLE' | 'LIFETIME', billingCycle: 'MONTHLY' | 'YEARLY' | 'NONE'): Promise<{ success: boolean; message: string; data: UserSubscription }> => {
  // This will be implemented after Razorpay integration
  throw new Error('Payment integration coming soon');
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (): Promise<{ success: boolean; message: string; data: UserSubscription }> => {
  return await apiRequest<{ success: boolean; message: string; data: UserSubscription }>(
    USER_SUBSCRIPTION_ENDPOINTS.CANCEL,
    {
      method: 'POST',
    }
  );
};
