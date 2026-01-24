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

// Trip endpoints
export const TRIP_ENDPOINTS = {
  CREATE: '/trips',
  GET_ALL: '/trips',
  GET_BY_ID: (id: string) => `/trips/${id}`,
  UPDATE: (id: string) => `/trips/${id}`,
  DELETE: (id: string) => `/trips/${id}`,
  SUMMARY: '/trips/summary'
};

// Vault endpoints
export const VAULT_ENDPOINTS = {
  CREATE: '/vault',
  GET_ALL: '/vault',
  GET_BY_ID: (id: string) => `/vault/${id}`,
  REVEAL: (id: string) => `/vault/${id}/reveal`,
  UPDATE: (id: string) => `/vault/${id}`,
  DELETE: (id: string) => `/vault/${id}`
};

// Vault Documents endpoints
export const VAULT_DOCUMENT_ENDPOINTS = {
  CREATE: '/vault/documents',
  GET_ALL: '/vault/documents',
  GET_BY_ID: (id: string) => `/vault/documents/${id}`,
  GET_SIGNED_URL: (id: string) => `/vault/documents/${id}/url`,
  DELETE: (id: string) => `/vault/documents/${id}`
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lifeos_auth_token',
  USER: 'lifeos_user'
};
