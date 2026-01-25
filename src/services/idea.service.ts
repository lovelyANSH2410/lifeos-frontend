import { API_BASE_URL, IDEA_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateIdeaData,
  Idea,
  IdeaResponse,
  IdeasResponse,
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
 * Create a new idea
 */
export const createIdea = async (ideaData: CreateIdeaData): Promise<IdeaResponse> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('content', ideaData.content);
  if (ideaData.title) {
    formData.append('title', ideaData.title);
  }
  if (ideaData.type) {
    formData.append('type', ideaData.type);
  }
  if (ideaData.source) {
    formData.append('source', ideaData.source);
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
  if (ideaData.revisitAt) {
    formData.append('revisitAt', ideaData.revisitAt);
  }

  // Add image if provided
  if (ideaData.image) {
    formData.append('image', ideaData.image);
  }

  return await apiRequest<IdeaResponse>(IDEA_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get ideas with filters
 */
export const getIdeas = async (filters?: {
  status?: string;
  type?: string;
  source?: string;
  tag?: string;
  limit?: number;
  page?: number;
}): Promise<IdeasResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.source) queryParams.append('source', filters.source);
    if (filters.tag) queryParams.append('tag', filters.tag);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${IDEA_ENDPOINTS.GET_ALL}?${queryString}`
    : IDEA_ENDPOINTS.GET_ALL;

  return await apiRequest<IdeasResponse>(endpoint);
};

/**
 * Get reflect ideas (random ideas for reflection)
 */
export const getReflectIdeas = async (): Promise<IdeasResponse> => {
  return await apiRequest<IdeasResponse>(IDEA_ENDPOINTS.REFLECT);
};

/**
 * Get a single idea by ID
 */
export const getIdeaById = async (id: string): Promise<IdeaResponse> => {
  return await apiRequest<IdeaResponse>(IDEA_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Update an idea
 */
export const updateIdea = async (id: string, updateData: Partial<CreateIdeaData>): Promise<IdeaResponse> => {
  const formData = new FormData();
  
  // Add fields that are provided
  if (updateData.content !== undefined) {
    formData.append('content', updateData.content);
  }
  if (updateData.title !== undefined) {
    formData.append('title', updateData.title || '');
  }
  if (updateData.type !== undefined) {
    formData.append('type', updateData.type || '');
  }
  if (updateData.source !== undefined) {
    formData.append('source', updateData.source || '');
  }
  if (updateData.link !== undefined) {
    formData.append('link', updateData.link || '');
  }
  if (updateData.tags !== undefined) {
    formData.append('tags', JSON.stringify(updateData.tags || []));
  }
  if (updateData.status !== undefined) {
    formData.append('status', updateData.status);
  }
  if (updateData.revisitAt !== undefined) {
    formData.append('revisitAt', updateData.revisitAt || '');
  }
  if (updateData.image) {
    formData.append('image', updateData.image);
  }

  return await apiRequest<IdeaResponse>(IDEA_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: formData,
  });
};

/**
 * Delete (archive) an idea
 */
export const deleteIdea = async (id: string): Promise<IdeaResponse> => {
  return await apiRequest<IdeaResponse>(IDEA_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
