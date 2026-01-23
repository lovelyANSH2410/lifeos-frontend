// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lifeos_auth_token',
  USER: 'lifeos_user'
};
