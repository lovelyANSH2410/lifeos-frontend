import { API_BASE_URL, FUND_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateFundData,
  Fund,
  FundResponse,
  FundsResponse,
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

export const createFund = async (fundData: CreateFundData): Promise<FundResponse> => {
  return await apiRequest<FundResponse>(FUND_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(fundData),
  });
};

export const getFunds = async (filters?: {
  type?: string;
  isLocked?: boolean;
}): Promise<FundsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.isLocked !== undefined) queryParams.append('isLocked', filters.isLocked.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${FUND_ENDPOINTS.GET_ALL}?${queryString}`
    : FUND_ENDPOINTS.GET_ALL;

  return await apiRequest<FundsResponse>(endpoint);
};

export const updateFund = async (id: string, updateData: Partial<CreateFundData>): Promise<FundResponse> => {
  return await apiRequest<FundResponse>(FUND_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

export const addToFund = async (id: string, amount: number, allowLocked = false): Promise<FundResponse> => {
  return await apiRequest<FundResponse>(FUND_ENDPOINTS.ADD(id), {
    method: 'POST',
    body: JSON.stringify({ amount, allowLocked }),
  });
};

export const withdrawFromFund = async (id: string, amount: number, allowLocked = false): Promise<FundResponse> => {
  return await apiRequest<FundResponse>(FUND_ENDPOINTS.WITHDRAW(id), {
    method: 'POST',
    body: JSON.stringify({ amount, allowLocked }),
  });
};
