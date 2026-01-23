import { API_BASE_URL, AUTH_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type { LoginCredentials, RegisterCredentials, AuthResponse, ApiError, User } from '@/types';

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Store auth token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Remove auth token
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get stored user
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Store user
 */
export const setStoredUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Remove stored user
 */
export const removeStoredUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Make API request with authentication
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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
 * Register a new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.success && response.data) {
    setAuthToken(response.data.token);
    setStoredUser(response.data.user);
  }

  return response;
};

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.success && response.data) {
    setAuthToken(response.data.token);
    setStoredUser(response.data.user);
  }

  return response;
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<{ success: boolean; message: string; data: User }> => {
  return await apiRequest<{ success: boolean; message: string; data: User }>(
    AUTH_ENDPOINTS.PROFILE
  );
};

/**
 * Update user profile
 */
export const updateProfile = async (updateData: { name?: string; currency?: string }): Promise<{ success: boolean; message: string; data: User }> => {
  return await apiRequest<{ success: boolean; message: string; data: User }>(
    AUTH_ENDPOINTS.UPDATE_PROFILE,
    {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }
  );
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeAuthToken();
  removeStoredUser();
};
