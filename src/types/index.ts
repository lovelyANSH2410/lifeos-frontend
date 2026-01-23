export enum Tab {
  Dashboard = 'Dashboard',
  Entertainment = 'Entertainment',
  Dates = 'Dates',
  Money = 'Money',
  Vault = 'Vault',
  Subscriptions = 'Subscriptions',
  Travel = 'Travel',
  Journal = 'Journal'
}

export type Plan = 'Free' | 'Couple' | 'Pro';

export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  status: 'watching' | 'watchlist' | 'watched';
  rating: number; // 1-5
  image: string;
}

export interface DateIdea {
  id: string;
  title: string;
  category: 'cafe' | 'airbnb' | 'gift' | 'activity';
  priceRange: 'low' | 'medium' | 'high';
  location?: string;
  link?: string;
  image?: string;
}

export interface Credential {
  id: string;
  service: string;
  username: string;
  category: 'social' | 'finance' | 'work';
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'img';
  date: string;
}

export interface MoneyItem {
  id: string;
  title: string;
  amount: number;
  type: 'wishlist' | 'saving' | 'borrowing' | 'expense';
  status?: 'pending' | 'completed';
}

export interface Trip {
  id: string;
  destination: string;
  dates: string;
  status: 'upcoming' | 'past' | 'planning';
  budget: number;
  image: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  category: string;
  autoRenew: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  snippet: string;
  mood: 'happy' | 'neutral' | 'sad' | 'energetic' | 'calm';
  tags: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  deadline: string;
  status: string;
  milestones: Milestone[];
}

// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
