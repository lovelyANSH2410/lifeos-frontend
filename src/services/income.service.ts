import { API_BASE_URL, INCOME_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateIncomeData,
  Income,
  IncomeResponse,
  IncomesResponse,
  MonthlyIncomeSummaryResponse,
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

/**
 * Create a new income entry
 */
export const createIncome = async (incomeData: CreateIncomeData): Promise<IncomeResponse> => {
  return await apiRequest<IncomeResponse>(INCOME_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(incomeData),
  });
};

/**
 * Get income entries with optional filters
 */
export const getIncomes = async (filters?: {
  type?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}): Promise<IncomesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.frequency) queryParams.append('frequency', filters.frequency);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${INCOME_ENDPOINTS.GET_ALL}?${queryString}`
    : INCOME_ENDPOINTS.GET_ALL;

  return await apiRequest<IncomesResponse>(endpoint);
};

/**
 * Get monthly income summary
 */
export const getMonthlyIncomeSummary = async (month: string): Promise<MonthlyIncomeSummaryResponse> => {
  return await apiRequest<MonthlyIncomeSummaryResponse>(
    `${INCOME_ENDPOINTS.GET_MONTHLY_SUMMARY}?month=${month}`
  );
};

/**
 * Delete an income entry
 */
export const deleteIncome = async (id: string): Promise<IncomeResponse> => {
  return await apiRequest<IncomeResponse>(INCOME_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
