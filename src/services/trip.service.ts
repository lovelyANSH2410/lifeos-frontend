import { API_BASE_URL, TRIP_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateTripData,
  Trip,
  TripResponse,
  TripsResponse,
  TripSummaryResponse,
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
 * Create a new trip
 */
export const createTrip = async (tripData: CreateTripData): Promise<TripResponse> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', tripData.title);
  formData.append('city', tripData.city);
  formData.append('country', tripData.country);
  formData.append('startDate', tripData.startDate);
  formData.append('endDate', tripData.endDate);
  
  if (tripData.budget) {
    formData.append('budget', JSON.stringify(tripData.budget));
  }
  
  if (tripData.notes) {
    formData.append('notes', tripData.notes);
  }
  
  if (tripData.isPinned !== undefined) {
    formData.append('isPinned', tripData.isPinned.toString());
  }

  // Add cover image if provided
  if (tripData.coverImage) {
    formData.append('coverImage', tripData.coverImage);
  }

  return await apiRequest<TripResponse>(TRIP_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get trips with filters
 */
export const getTrips = async (filters?: {
  status?: string;
  limit?: number;
  page?: number;
}): Promise<TripsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${TRIP_ENDPOINTS.GET_ALL}?${queryString}`
    : TRIP_ENDPOINTS.GET_ALL;

  return await apiRequest<TripsResponse>(endpoint);
};

/**
 * Get trip summary
 */
export const getTripSummary = async (): Promise<TripSummaryResponse> => {
  return await apiRequest<TripSummaryResponse>(TRIP_ENDPOINTS.SUMMARY);
};

/**
 * Get a single trip by ID
 */
export const getTripById = async (id: string): Promise<TripResponse> => {
  return await apiRequest<TripResponse>(TRIP_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Update a trip
 */
export const updateTrip = async (id: string, updateData: Partial<CreateTripData>): Promise<TripResponse> => {
  const formData = new FormData();
  
  // Add fields that are provided
  if (updateData.title !== undefined) {
    formData.append('title', updateData.title);
  }
  if (updateData.city !== undefined) {
    formData.append('city', updateData.city);
  }
  if (updateData.country !== undefined) {
    formData.append('country', updateData.country);
  }
  if (updateData.startDate !== undefined) {
    formData.append('startDate', updateData.startDate);
  }
  if (updateData.endDate !== undefined) {
    formData.append('endDate', updateData.endDate);
  }
  if (updateData.budget !== undefined) {
    formData.append('budget', JSON.stringify(updateData.budget));
  }
  if (updateData.notes !== undefined) {
    formData.append('notes', updateData.notes);
  }
  if (updateData.isPinned !== undefined) {
    formData.append('isPinned', updateData.isPinned.toString());
  }
  if (updateData.coverImage) {
    formData.append('coverImage', updateData.coverImage);
  }

  return await apiRequest<TripResponse>(TRIP_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: formData,
  });
};

/**
 * Delete (cancel) a trip
 */
export const deleteTrip = async (id: string): Promise<TripResponse> => {
  return await apiRequest<TripResponse>(TRIP_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
