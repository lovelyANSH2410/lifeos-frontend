import { API_BASE_URL, MONEY_OVERVIEW_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  MoneyOverview,
  MoneyOverviewResponse,
  ApiError
} from '@/types';

const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

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
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || 'An error occurred');
  }

  return data as T;
};

export const getMonthlyOverview = async (month: string): Promise<MoneyOverviewResponse> => {
  return await apiRequest<MoneyOverviewResponse>(
    `${MONEY_OVERVIEW_ENDPOINTS.GET_MONTHLY}?month=${month}`
  );
};
