import { API_BASE_URL, WATCH_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateWatchItemData,
  UpdateWatchProgressData,
  WatchItem,
  WatchItemResponse,
  WatchItemsResponse,
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
    ...options.headers,
  };

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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
 * Create a new watch item
 */
export const createWatchItem = async (itemData: CreateWatchItemData): Promise<WatchItemResponse> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', itemData.title);
  if (itemData.description) {
    formData.append('description', itemData.description);
  }
  formData.append('type', itemData.type);
  if (itemData.status) {
    formData.append('status', itemData.status);
  }
  if (itemData.platforms && itemData.platforms.length > 0) {
    formData.append('platforms', JSON.stringify(itemData.platforms));
  }
  if (itemData.isFavorite !== undefined) {
    formData.append('isFavorite', itemData.isFavorite.toString());
  }
  if (itemData.rating !== undefined && itemData.rating !== null) {
    formData.append('rating', itemData.rating.toString());
  }
  if (itemData.moodTags && itemData.moodTags.length > 0) {
    formData.append('moodTags', JSON.stringify(itemData.moodTags));
  }
  if (itemData.notes) {
    formData.append('notes', itemData.notes);
  }
  if (itemData.currentSeason !== undefined) {
    formData.append('currentSeason', itemData.currentSeason.toString());
  }
  if (itemData.currentEpisode !== undefined) {
    formData.append('currentEpisode', itemData.currentEpisode.toString());
  }

  // Add poster file if provided
  if (itemData.poster) {
    formData.append('poster', itemData.poster);
  }
  
  // Add poster URL if provided (and no file)
  if (itemData.posterUrl && !itemData.poster) {
    formData.append('posterUrl', itemData.posterUrl);
  }

  return await apiRequest<WatchItemResponse>(WATCH_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get watch items with optional filters
 */
export const getWatchItems = async (filters?: {
  status?: string;
  type?: string;
  platform?: string;
  isFavorite?: boolean;
  rating?: number;
}): Promise<WatchItemsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.platform) queryParams.append('platform', filters.platform);
    if (filters.isFavorite !== undefined) {
      queryParams.append('isFavorite', filters.isFavorite.toString());
    }
    if (filters.rating !== undefined) {
      queryParams.append('rating', filters.rating.toString());
    }
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${WATCH_ENDPOINTS.GET_ALL}?${queryString}`
    : WATCH_ENDPOINTS.GET_ALL;

  return await apiRequest<WatchItemsResponse>(endpoint);
};

/**
 * Get a single watch item by ID
 */
export const getWatchItemById = async (id: string): Promise<WatchItemResponse> => {
  return await apiRequest<WatchItemResponse>(WATCH_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Update a watch item
 */
export const updateWatchItem = async (id: string, updateData: Partial<CreateWatchItemData>): Promise<WatchItemResponse> => {
  const body: any = {};
  
  if (updateData.status !== undefined) body.status = updateData.status;
  if (updateData.rating !== undefined) body.rating = updateData.rating;
  if (updateData.notes !== undefined) body.notes = updateData.notes;
  if (updateData.moodTags !== undefined) body.moodTags = updateData.moodTags;
  if (updateData.platforms !== undefined) body.platforms = updateData.platforms;
  if (updateData.isFavorite !== undefined) body.isFavorite = updateData.isFavorite;

  return await apiRequest<WatchItemResponse>(WATCH_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

/**
 * Update series progress
 */
export const updateWatchProgress = async (id: string, progressData: UpdateWatchProgressData): Promise<WatchItemResponse> => {
  return await apiRequest<WatchItemResponse>(WATCH_ENDPOINTS.UPDATE_PROGRESS(id), {
    method: 'PATCH',
    body: JSON.stringify(progressData),
  });
};

/**
 * Delete (archive) a watch item
 */
export const deleteWatchItem = async (id: string): Promise<WatchItemResponse> => {
  return await apiRequest<WatchItemResponse>(WATCH_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
