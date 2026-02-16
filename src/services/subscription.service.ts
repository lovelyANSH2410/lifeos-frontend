import { API_BASE_URL, SUBSCRIPTION_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateSubscriptionData,
  Subscription,
  SubscriptionResponse,
  SubscriptionsResponse,
  SubscriptionSummaryResponse,
  ApiError
} from '@/types';

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
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, get text
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (!response.ok) {
    // Preserve the full error object for better error handling
    const error: ApiError = data;
    const errorObj = new Error(error.message || 'An error occurred');
    (errorObj as any).response = data; // Attach full response for error extraction
    throw errorObj;
  }

  return data as T;
};

/**
 * Create a new subscription
 */
export const createSubscription = async (subscriptionData: CreateSubscriptionData): Promise<SubscriptionResponse> => {
  return await apiRequest<SubscriptionResponse>(SUBSCRIPTION_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  });
};

/**
 * Get subscriptions with filters
 */
export const getSubscriptions = async (filters?: {
  status?: string;
  category?: string;
  upcoming?: boolean;
}): Promise<SubscriptionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.upcoming !== undefined) {
      queryParams.append('upcoming', filters.upcoming.toString());
    }
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${SUBSCRIPTION_ENDPOINTS.GET_ALL}?${queryString}`
    : SUBSCRIPTION_ENDPOINTS.GET_ALL;

  return await apiRequest<SubscriptionsResponse>(endpoint);
};

/**
 * Get subscription summary
 */
export const getSubscriptionSummary = async (): Promise<SubscriptionSummaryResponse> => {
  return await apiRequest<SubscriptionSummaryResponse>(SUBSCRIPTION_ENDPOINTS.SUMMARY);
};

/**
 * Get a single subscription by ID
 */
export const getSubscriptionById = async (id: string): Promise<SubscriptionResponse> => {
  return await apiRequest<SubscriptionResponse>(SUBSCRIPTION_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Update a subscription
 */
export const updateSubscription = async (id: string, updateData: Partial<CreateSubscriptionData>): Promise<SubscriptionResponse> => {
  return await apiRequest<SubscriptionResponse>(SUBSCRIPTION_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete (cancel) a subscription
 */
export const deleteSubscription = async (id: string): Promise<SubscriptionResponse> => {
  return await apiRequest<SubscriptionResponse>(SUBSCRIPTION_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
