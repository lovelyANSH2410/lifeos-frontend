// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile'
};

// Diary endpoints
export const DIARY_ENDPOINTS = {
  CREATE: '/diary',
  GET_ALL: '/diary',
  GET_BY_ID: (id: string) => `/diary/${id}`,
  DELETE: (id: string) => `/diary/${id}`
};

// Subscription endpoints
export const SUBSCRIPTION_ENDPOINTS = {
  CREATE: '/subscriptions',
  GET_ALL: '/subscriptions',
  GET_BY_ID: (id: string) => `/subscriptions/${id}`,
  UPDATE: (id: string) => `/subscriptions/${id}`,
  DELETE: (id: string) => `/subscriptions/${id}`,
  SUMMARY: '/subscriptions/summary'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lifeos_auth_token',
  USER: 'lifeos_user'
};
