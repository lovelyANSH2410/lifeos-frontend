import { API_BASE_URL, DEBT_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateDebtData,
  Debt,
  DebtResponse,
  DebtsResponse,
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

export const createDebt = async (debtData: CreateDebtData): Promise<DebtResponse> => {
  return await apiRequest<DebtResponse>(DEBT_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(debtData),
  });
};

export const getDebts = async (filters?: {
  type?: string;
  status?: string;
}): Promise<DebtsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${DEBT_ENDPOINTS.GET_ALL}?${queryString}`
    : DEBT_ENDPOINTS.GET_ALL;

  return await apiRequest<DebtsResponse>(endpoint);
};

export const settleDebt = async (id: string): Promise<DebtResponse> => {
  return await apiRequest<DebtResponse>(DEBT_ENDPOINTS.SETTLE(id), {
    method: 'PATCH',
  });
};

export const deleteDebt = async (id: string): Promise<DebtResponse> => {
  return await apiRequest<DebtResponse>(DEBT_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
