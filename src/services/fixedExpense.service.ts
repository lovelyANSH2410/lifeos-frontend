import { API_BASE_URL, FIXED_EXPENSE_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateFixedExpenseData,
  FixedExpense,
  FixedExpenseResponse,
  FixedExpensesResponse,
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

export const createFixedExpense = async (expenseData: CreateFixedExpenseData): Promise<FixedExpenseResponse> => {
  return await apiRequest<FixedExpenseResponse>(FIXED_EXPENSE_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
};

export const getFixedExpenses = async (filters?: {
  category?: string;
  billingCycle?: string;
  isActive?: boolean;
}): Promise<FixedExpensesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.billingCycle) queryParams.append('billingCycle', filters.billingCycle);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${FIXED_EXPENSE_ENDPOINTS.GET_ALL}?${queryString}`
    : FIXED_EXPENSE_ENDPOINTS.GET_ALL;

  return await apiRequest<FixedExpensesResponse>(endpoint);
};

export const updateFixedExpense = async (id: string, updateData: Partial<CreateFixedExpenseData>): Promise<FixedExpenseResponse> => {
  return await apiRequest<FixedExpenseResponse>(FIXED_EXPENSE_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

export const deleteFixedExpense = async (id: string): Promise<FixedExpenseResponse> => {
  return await apiRequest<FixedExpenseResponse>(FIXED_EXPENSE_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
