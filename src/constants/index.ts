// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile'
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  GET_DASHBOARD: '/dashboard'
};

// Diary endpoints
export const DIARY_ENDPOINTS = {
  CREATE: '/diary',
  GET_ALL: '/diary',
  GET_BY_ID: (id: string) => `/diary/${id}`,
  DELETE: (id: string) => `/diary/${id}`
};

// Subscription endpoints (for subscription manager - Netflix, Spotify, etc.)
export const SUBSCRIPTION_ENDPOINTS = {
  CREATE: '/subscriptions',
  GET_ALL: '/subscriptions',
  GET_BY_ID: (id: string) => `/subscriptions/${id}`,
  UPDATE: (id: string) => `/subscriptions/${id}`,
  DELETE: (id: string) => `/subscriptions/${id}`,
  SUMMARY: '/subscriptions/summary'
};

// User Subscription endpoints (for LifeOS plans)
export const USER_SUBSCRIPTION_ENDPOINTS = {
  GET: '/subscription',
  UPGRADE: '/subscription/upgrade',
  CANCEL: '/subscription/cancel'
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

// Exam / Subject / Topic endpoints
export const EXAM_ENDPOINTS = {
  CREATE: '/exams',
  GET_ALL: '/exams',
  GET_BY_ID: (id: string) => `/exams/${id}`,
  UPDATE: (id: string) => `/exams/${id}`,
  DELETE: (id: string) => `/exams/${id}`,
  SUBJECTS: (examId: string) => ({
    CREATE: `/exams/${examId}/subjects`,
    GET_ALL: `/exams/${examId}/subjects`
  }),
  SUBJECT_UPDATE: (subjectId: string) => `/subjects/${subjectId}`,
  SUBJECT_DELETE: (subjectId: string) => `/subjects/${subjectId}`,
  TOPICS: (subjectId: string) => ({
    CREATE: `/subjects/${subjectId}/topics`,
    GET_ALL: `/subjects/${subjectId}/topics`
  }),
  TOPIC_UPDATE: (topicId: string) => `/topics/${topicId}`,
  TOPIC_DELETE: (topicId: string) => `/topics/${topicId}`,
  TOPIC_PROGRESS: (topicId: string) => `/topics/${topicId}/progress`
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

// Idea endpoints
export const IDEA_ENDPOINTS = {
  CREATE: '/ideas',
  GET_ALL: '/ideas',
  GET_BY_ID: (id: string) => `/ideas/${id}`,
  UPDATE: (id: string) => `/ideas/${id}`,
  DELETE: (id: string) => `/ideas/${id}`,
  REFLECT: '/ideas/reflect'
};

// Gifting endpoints
export const GIFTING_ENDPOINTS = {
  CREATE: '/gifting',
  GET_ALL: '/gifting',
  GET_BY_ID: (id: string) => `/gifting/${id}`,
  UPDATE: (id: string) => `/gifting/${id}`,
  DELETE: (id: string) => `/gifting/${id}`
};

// Watch endpoints
export const WATCH_ENDPOINTS = {
  CREATE: '/watch',
  GET_ALL: '/watch',
  GET_BY_ID: (id: string) => `/watch/${id}`,
  UPDATE: (id: string) => `/watch/${id}`,
  UPDATE_PROGRESS: (id: string) => `/watch/${id}/progress`,
  DELETE: (id: string) => `/watch/${id}`
};

// Money Management endpoints
export const INCOME_ENDPOINTS = {
  CREATE: '/income',
  GET_ALL: '/income',
  GET_MONTHLY_SUMMARY: '/income/monthly-summary',
  DELETE: (id: string) => `/income/${id}`
};

export const FIXED_EXPENSE_ENDPOINTS = {
  CREATE: '/fixed-expenses',
  GET_ALL: '/fixed-expenses',
  GET_BY_ID: (id: string) => `/fixed-expenses/${id}`,
  UPDATE: (id: string) => `/fixed-expenses/${id}`,
  DELETE: (id: string) => `/fixed-expenses/${id}`
};

export const TRANSACTION_ENDPOINTS = {
  CREATE: '/transactions',
  GET_ALL: '/transactions',
  GET_MONTHLY: '/transactions/monthly'
};

export const FUND_ENDPOINTS = {
  CREATE: '/funds',
  GET_ALL: '/funds',
  GET_BY_ID: (id: string) => `/funds/${id}`,
  UPDATE: (id: string) => `/funds/${id}`,
  ADD: (id: string) => `/funds/${id}/add`,
  WITHDRAW: (id: string) => `/funds/${id}/withdraw`
};

export const DEBT_ENDPOINTS = {
  CREATE: '/debts',
  GET_ALL: '/debts',
  GET_BY_ID: (id: string) => `/debts/${id}`,
  SETTLE: (id: string) => `/debts/${id}/settle`,
  DELETE: (id: string) => `/debts/${id}`
};

export const WISHLIST_ENDPOINTS = {
  CREATE: '/wishlist',
  GET_ALL: '/wishlist',
  GET_BY_ID: (id: string) => `/wishlist/${id}`,
  UPDATE: (id: string) => `/wishlist/${id}`,
  DELETE: (id: string) => `/wishlist/${id}`
};

export const MONEY_OVERVIEW_ENDPOINTS = {
  GET_MONTHLY: '/money/overview'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lifeos_auth_token',
  USER: 'lifeos_user'
};
