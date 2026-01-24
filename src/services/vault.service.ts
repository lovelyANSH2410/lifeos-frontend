import { API_BASE_URL, VAULT_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateVaultItemData,
  VaultItem,
  VaultItemResponse,
  VaultItemsResponse,
  RevealPasswordResponse,
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

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || 'An error occurred');
  }

  return data as T;
};

/**
 * Create a new vault item
 */
export const createVaultItem = async (itemData: CreateVaultItemData): Promise<VaultItemResponse> => {
  return await apiRequest<VaultItemResponse>(VAULT_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

/**
 * Get vault items with optional category filter
 */
export const getVaultItems = async (filters?: {
  category?: string;
}): Promise<VaultItemsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters?.category) {
    queryParams.append('category', filters.category);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${VAULT_ENDPOINTS.GET_ALL}?${queryString}`
    : VAULT_ENDPOINTS.GET_ALL;

  return await apiRequest<VaultItemsResponse>(endpoint);
};

/**
 * Get a single vault item by ID
 */
export const getVaultItemById = async (id: string): Promise<VaultItemResponse> => {
  return await apiRequest<VaultItemResponse>(VAULT_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Reveal (decrypt) password for a vault item
 */
export const revealPassword = async (id: string): Promise<RevealPasswordResponse> => {
  return await apiRequest<RevealPasswordResponse>(VAULT_ENDPOINTS.REVEAL(id), {
    method: 'POST',
  });
};

/**
 * Update a vault item
 */
export const updateVaultItem = async (id: string, updateData: Partial<CreateVaultItemData>): Promise<VaultItemResponse> => {
  return await apiRequest<VaultItemResponse>(VAULT_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete a vault item
 */
export const deleteVaultItem = async (id: string): Promise<VaultItemResponse> => {
  return await apiRequest<VaultItemResponse>(VAULT_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
