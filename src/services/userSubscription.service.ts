import { API_BASE_URL, USER_SUBSCRIPTION_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type { UserSubscription } from '@/types';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, get text
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (!response.ok) {
    // Handle different error response formats
    const errorMessage = data?.message || 
                        data?.error?.message || 
                        data?.error || 
                        `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
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
 * Create payment order for subscription upgrade
 */
export const createPaymentOrder = async (
  plan: 'PRO' | 'COUPLE' | 'LIFETIME',
  billingCycle: 'MONTHLY' | 'YEARLY' | 'NONE'
): Promise<{ success: boolean; message: string; data: { orderId: string; amount: number; currency: string; key: string } }> => {
  return await apiRequest<{ success: boolean; message: string; data: { orderId: string; amount: number; currency: string; key: string } }>(
    USER_SUBSCRIPTION_ENDPOINTS.PAYMENT_CREATE,
    {
      method: 'POST',
      body: JSON.stringify({ plan, billingCycle }),
    }
  );
};

/**
 * Verify payment and upgrade subscription
 */
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string,
  plan: 'PRO' | 'COUPLE' | 'LIFETIME',
  billingCycle: 'MONTHLY' | 'YEARLY' | 'NONE'
): Promise<{ success: boolean; message: string; data: { subscription: UserSubscription; paymentId: string; orderId: string } }> => {
  return await apiRequest<{ success: boolean; message: string; data: { subscription: UserSubscription; paymentId: string; orderId: string } }>(
    USER_SUBSCRIPTION_ENDPOINTS.PAYMENT_VERIFY,
    {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, signature, plan, billingCycle }),
    }
  );
};

/**
 * Open Razorpay checkout
 */
export const openRazorpayCheckout = (
  orderData: { orderId: string; amount: number; currency: string; key: string },
  options: {
    name: string;
    description: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
    onSuccess: (paymentId: string, signature: string) => void;
    onError: (error: string) => void;
  }
): void => {
  if (!window.Razorpay) {
    options.onError('Razorpay SDK not loaded. Please refresh the page.');
    return;
  }

  const razorpay = new window.Razorpay({
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: options.name,
    description: options.description,
    order_id: orderData.orderId,
    prefill: options.prefill || {},
    handler: function (response: any) {
      options.onSuccess(response.razorpay_payment_id, response.razorpay_signature);
    },
    modal: {
      ondismiss: function () {
        options.onError('Payment cancelled by user');
      },
    },
    theme: {
      color: '#6366f1',
    },
  });

  razorpay.open();
};

/**
 * Upgrade subscription (deprecated - use payment flow instead)
 */
export const upgradeSubscription = async (plan: 'PRO' | 'COUPLE' | 'LIFETIME', billingCycle: 'MONTHLY' | 'YEARLY' | 'NONE'): Promise<{ success: boolean; message: string; data: UserSubscription }> => {
  // This endpoint is kept for backward compatibility but should use payment flow
  throw new Error('Please use the payment flow to upgrade your subscription');
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
