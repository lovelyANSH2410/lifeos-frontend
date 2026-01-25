import { API_BASE_URL, WISHLIST_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateWishlistItemData,
  WishlistItem,
  WishlistItemResponse,
  WishlistItemsResponse,
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

export const createWishlistItem = async (itemData: CreateWishlistItemData): Promise<WishlistItemResponse> => {
  return await apiRequest<WishlistItemResponse>(WISHLIST_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

export const getWishlistItems = async (filters?: {
  status?: string;
  priority?: string;
  plannedMonth?: string;
}): Promise<WishlistItemsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.plannedMonth) queryParams.append('plannedMonth', filters.plannedMonth);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${WISHLIST_ENDPOINTS.GET_ALL}?${queryString}`
    : WISHLIST_ENDPOINTS.GET_ALL;

  return await apiRequest<WishlistItemsResponse>(endpoint);
};

export const updateWishlistItem = async (id: string, updateData: Partial<CreateWishlistItemData>): Promise<WishlistItemResponse> => {
  return await apiRequest<WishlistItemResponse>(WISHLIST_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

export const deleteWishlistItem = async (id: string): Promise<WishlistItemResponse> => {
  return await apiRequest<WishlistItemResponse>(WISHLIST_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
