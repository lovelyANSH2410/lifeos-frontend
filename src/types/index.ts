export enum Tab {
  Dashboard = 'Dashboard',
  Entertainment = 'Entertainment',
  Dates = 'Dates',
  Money = 'Money',
  Vault = 'Vault',
  Subscriptions = 'Subscriptions',
  Travel = 'Travel',
  Journal = 'Journal',
  Ideas = 'Ideas'
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

// Vault types (for Secure Vault - Credentials)
export interface VaultItem {
  _id: string;
  userId: string;
  title: string;
  username?: string;
  category: 'credentials' | 'bank' | 'utility' | 'other';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVaultItemData {
  title: string;
  username?: string;
  password: string;
  category?: 'credentials' | 'bank' | 'utility' | 'other';
  notes?: string;
}

export interface VaultItemResponse {
  success: boolean;
  message: string;
  data: VaultItem;
}

export interface VaultItemsResponse {
  success: boolean;
  message: string;
  data: VaultItem[];
}

export interface RevealPasswordResponse {
  success: boolean;
  message: string;
  data: {
    password: string;
  };
}

// Legacy Credential type (for backward compatibility if needed)
export interface Credential {
  id: string;
  service: string;
  username: string;
  category: 'social' | 'finance' | 'work';
}

// Vault Document types (for Secure Vault - Documents)
export interface VaultDocumentFile {
  publicId: string;
  url?: string;
  format?: string;
  size?: number;
}

export interface VaultDocument {
  _id: string;
  userId: string;
  title: string;
  category: 'identity' | 'insurance' | 'finance' | 'medical' | 'property' | 'education' | 'other';
  file: VaultDocumentFile;
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVaultDocumentData {
  title: string;
  category?: 'identity' | 'insurance' | 'finance' | 'medical' | 'property' | 'education' | 'other';
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
  file: File;
}

export interface VaultDocumentResponse {
  success: boolean;
  message: string;
  data: VaultDocument;
}

export interface VaultDocumentsResponse {
  success: boolean;
  message: string;
  data: VaultDocument[];
}

export interface SignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    signedUrl: string;
    expiresIn: number;
  };
}

// Legacy Document type (for backward compatibility if needed)
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

// Trip types (for Travel Plans)
export interface TripLocation {
  city: string;
  country: string;
}

export interface TripCoverImage {
  publicId?: string;
  url?: string;
}

export interface TripBudget {
  estimated?: number;
  currency?: string;
}

export interface Trip {
  _id: string;
  userId: string;
  title: string;
  location: TripLocation;
  startDate: string;
  endDate: string;
  coverImage?: TripCoverImage;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  budget?: TripBudget;
  notes?: string;
  isPinned: boolean;
  daysToGo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTripData {
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  budget?: TripBudget;
  notes?: string;
  isPinned?: boolean;
  coverImage?: File;
}

export interface TripSummary {
  upcomingCount: number;
  completedCount: number;
  nextTrip: Trip | null;
}

export interface TripResponse {
  success: boolean;
  message: string;
  data: Trip;
}

export interface TripsResponse {
  success: boolean;
  message: string;
  data: {
    trips: Trip[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface TripSummaryResponse {
  success: boolean;
  message: string;
  data: TripSummary;
}

// Subscription types (for Subscriptions Manager)
export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  provider?: string;
  icon?: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  lastUsedAt?: string;
  category: 'entertainment' | 'productivity' | 'cloud' | 'utilities' | 'education' | 'other';
  status: 'active' | 'paused' | 'cancelled';
  notes?: string;
  isAutoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionData {
  name: string;
  provider?: string;
  icon?: string;
  amount: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly';
  renewalDate: string;
  lastUsedAt?: string;
  category?: 'entertainment' | 'productivity' | 'cloud' | 'utilities' | 'education' | 'other';
  status?: 'active' | 'paused' | 'cancelled';
  notes?: string;
  isAutoRenew?: boolean;
}

export interface SubscriptionSummary {
  monthlyTotal: number;
  activeSubscriptionsCount: number;
  upcomingRenewals: Array<{
    _id: string;
    name: string;
    amount: number;
    currency: string;
    renewalDate: string;
    billingCycle: string;
  }>;
  optimizationTips: Array<{
    subscriptionId: string;
    subscriptionName: string;
    suggestion: string;
    potentialSavings: number;
  }>;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: Subscription;
}

export interface SubscriptionsResponse {
  success: boolean;
  message: string;
  data: Subscription[];
}

export interface SubscriptionSummaryResponse {
  success: boolean;
  message: string;
  data: SubscriptionSummary;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  snippet: string;
  mood: 'happy' | 'neutral' | 'sad' | 'energetic' | 'calm';
  tags: string[];
}

// Diary Entry types (for Personal Diary / Memory Vault)
export interface DiaryImage {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface DiaryEntry {
  _id: string;
  userId: string;
  title?: string;
  content: string;
  mood: 'calm' | 'happy' | 'energetic' | 'sad' | 'nostalgic' | 'stressed' | 'grateful' | 'neutral';
  images: DiaryImage[];
  entryDate: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaryEntryData {
  title?: string;
  content: string;
  mood?: 'calm' | 'happy' | 'energetic' | 'sad' | 'nostalgic' | 'stressed' | 'grateful' | 'neutral';
  entryDate?: string;
  isPinned?: boolean;
  images?: File[];
}

export interface DiaryEntriesResponse {
  success: boolean;
  message: string;
  data: {
    entries: DiaryEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface DiaryEntryResponse {
  success: boolean;
  message: string;
  data: DiaryEntry;
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
  currency?: string;
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

// Idea types (for Idea Inbox)
export interface IdeaImage {
  publicId: string;
  url: string;
}

export interface Idea {
  _id: string;
  userId: string;
  title?: string;
  content: string;
  type?: 'curiosity' | 'learning' | 'idea' | 'inspiration' | 'news' | 'question' | 'random';
  source?: 'youtube' | 'instagram' | 'article' | 'book' | 'conversation' | 'random';
  link?: string;
  image?: IdeaImage;
  tags?: string[];
  status: 'inbox' | 'saved' | 'explored' | 'archived';
  revisitAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIdeaData {
  title?: string;
  content: string;
  type?: 'curiosity' | 'learning' | 'idea' | 'inspiration' | 'news' | 'question' | 'random';
  source?: 'youtube' | 'instagram' | 'article' | 'book' | 'conversation' | 'random';
  link?: string;
  tags?: string[];
  status?: 'inbox' | 'saved' | 'explored' | 'archived';
  revisitAt?: string;
  image?: File;
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  data: Idea;
}

export interface IdeasResponse {
  success: boolean;
  message: string;
  data: {
    ideas: Idea[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
