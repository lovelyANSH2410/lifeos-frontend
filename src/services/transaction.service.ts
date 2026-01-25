import { API_BASE_URL, TRANSACTION_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateTransactionData,
  Transaction,
  TransactionResponse,
  TransactionsResponse,
  MonthlyTransactionsResponse,
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

export const createTransaction = async (transactionData: CreateTransactionData): Promise<TransactionResponse> => {
  return await apiRequest<TransactionResponse>(TRANSACTION_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

export const getTransactions = async (filters?: {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}): Promise<TransactionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${TRANSACTION_ENDPOINTS.GET_ALL}?${queryString}`
    : TRANSACTION_ENDPOINTS.GET_ALL;

  return await apiRequest<TransactionsResponse>(endpoint);
};

export const getMonthlyTransactions = async (month: string): Promise<MonthlyTransactionsResponse> => {
  return await apiRequest<MonthlyTransactionsResponse>(
    `${TRANSACTION_ENDPOINTS.GET_MONTHLY}?month=${month}`
  );
};
