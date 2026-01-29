import { API_BASE_URL, DIARY_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type { CreateDiaryEntryData, DiaryEntriesResponse, DiaryEntryResponse, ApiError } from '@/types';

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

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, get text
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (!response.ok) {
    // Preserve the full error object for better error handling
    const error: ApiError = data;
    const errorObj = new Error(error.message || 'An error occurred');
    (errorObj as any).response = data; // Attach full response for error extraction
    throw errorObj;
  }

  return data as T;
};

/**
 * Create a new diary entry
 */
export const createDiaryEntry = async (entryData: CreateDiaryEntryData): Promise<DiaryEntryResponse> => {
  const formData = new FormData();
  
  // Add text fields
  if (entryData.title) {
    formData.append('title', entryData.title);
  }
  formData.append('content', entryData.content);
  if (entryData.mood) {
    formData.append('mood', entryData.mood);
  }
  if (entryData.entryDate) {
    formData.append('entryDate', entryData.entryDate);
  }
  if (entryData.isPinned !== undefined) {
    formData.append('isPinned', entryData.isPinned.toString());
  }

  // Add image files
  if (entryData.images && entryData.images.length > 0) {
    entryData.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  return await apiRequest<DiaryEntryResponse>(DIARY_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get diary entries with filters
 */
export const getDiaryEntries = async (filters?: {
  mood?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  page?: number;
  isArchived?: boolean;
}): Promise<DiaryEntriesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.mood) queryParams.append('mood', filters.mood);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.isArchived !== undefined) {
      queryParams.append('isArchived', filters.isArchived.toString());
    }
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${DIARY_ENDPOINTS.GET_ALL}?${queryString}`
    : DIARY_ENDPOINTS.GET_ALL;

  return await apiRequest<DiaryEntriesResponse>(endpoint);
};

/**
 * Get a single diary entry by ID
 */
export const getDiaryEntryById = async (id: string): Promise<DiaryEntryResponse> => {
  return await apiRequest<DiaryEntryResponse>(DIARY_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Archive (soft delete) a diary entry
 */
export const archiveDiaryEntry = async (id: string): Promise<DiaryEntryResponse> => {
  return await apiRequest<DiaryEntryResponse>(DIARY_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
