import { API_BASE_URL, GIFTING_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateGiftIdeaData,
  GiftIdea,
  GiftIdeaResponse,
  GiftIdeasResponse,
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
 * Create a new gift idea
 */
export const createGiftIdea = async (ideaData: CreateGiftIdeaData): Promise<GiftIdeaResponse> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', ideaData.title);
  if (ideaData.description) {
    formData.append('description', ideaData.description);
  }
  formData.append('type', ideaData.type);
  if (ideaData.location) {
    formData.append('location', JSON.stringify(ideaData.location));
  }
  if (ideaData.price) {
    formData.append('price', JSON.stringify(ideaData.price));
  }
  if (ideaData.link) {
    formData.append('link', ideaData.link);
  }
  if (ideaData.tags && ideaData.tags.length > 0) {
    formData.append('tags', JSON.stringify(ideaData.tags));
  }
  if (ideaData.status) {
    formData.append('status', ideaData.status);
  }
  if (ideaData.isFavorite !== undefined) {
    formData.append('isFavorite', ideaData.isFavorite.toString());
  }
  if (ideaData.source) {
    formData.append('source', ideaData.source);
  }

  // Add image files (max 3)
  if (ideaData.images && ideaData.images.length > 0) {
    ideaData.images.slice(0, 3).forEach((image) => {
      formData.append('images', image);
    });
  }

  return await apiRequest<GiftIdeaResponse>(GIFTING_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get gift ideas with optional filters
 */
export const getGiftIdeas = async (filters?: {
  type?: string;
  status?: string;
  isFavorite?: boolean;
}): Promise<GiftIdeasResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.isFavorite !== undefined) {
      queryParams.append('isFavorite', filters.isFavorite.toString());
    }
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${GIFTING_ENDPOINTS.GET_ALL}?${queryString}`
    : GIFTING_ENDPOINTS.GET_ALL;

  return await apiRequest<GiftIdeasResponse>(endpoint);
};

/**
 * Get a single gift idea by ID
 */
export const getGiftIdeaById = async (id: string): Promise<GiftIdeaResponse> => {
  return await apiRequest<GiftIdeaResponse>(GIFTING_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Update a gift idea
 */
export const updateGiftIdea = async (id: string, updateData: Partial<CreateGiftIdeaData>): Promise<GiftIdeaResponse> => {
  const body: any = {};
  
  if (updateData.title !== undefined) body.title = updateData.title;
  if (updateData.description !== undefined) body.description = updateData.description;
  if (updateData.status !== undefined) body.status = updateData.status;
  if (updateData.price !== undefined) body.price = updateData.price;
  if (updateData.isFavorite !== undefined) body.isFavorite = updateData.isFavorite;

  return await apiRequest<GiftIdeaResponse>(GIFTING_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

/**
 * Delete (archive) a gift idea
 */
export const deleteGiftIdea = async (id: string): Promise<GiftIdeaResponse> => {
  return await apiRequest<GiftIdeaResponse>(GIFTING_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
