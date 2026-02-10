export enum Tab {
  Dashboard = 'Dashboard',
  Entertainment = 'Entertainment',
  Dates = 'Dates',
  Money = 'Money',
  Vault = 'Vault',
  Subscriptions = 'Subscriptions',
  Travel = 'Travel',
  Exams = 'Exams',
  Journal = 'Journal',
  Ideas = 'Ideas',
  SubscriptionPlans = 'SubscriptionPlans'
}

// Exam / Subject / Topic types (for Exams feature)
export interface Exam {
  _id: string;
  userId: string;
  name: string;
  examDate?: string;
  progress: number;
  createdAt?: string;
}

export interface Subject {
  _id: string;
  examId: string;
  name: string;
  progress: number;
  createdAt?: string;
}

export interface Topic {
  _id: string;
  subjectId: string;
  name: string;
  study: boolean;
  rev1: boolean;
  rev2: boolean;
  rev3: boolean;
  progress: number;
  createdAt?: string;
}

// Doubt types (for Exam Doubts feature)
export type DoubtPriority = 'low' | 'medium' | 'high';
export type DoubtStatus = 'open' | 'resolved';

export interface DoubtImage {
  url: string;
  publicId: string;
}

export interface Doubt {
  _id: string;
  userId: string;
  examId: string;
  subjectId: string;
  topicId?: string;
  title: string;
  description?: string;
  images: DoubtImage[];
  priority: DoubtPriority;
  status: DoubtStatus;
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoubtData {
  title: string;
  description?: string;
  topicId?: string;
  priority?: DoubtPriority;
  images?: DoubtImage[];
}

export interface UpdateDoubtData {
  title?: string;
  description?: string;
  topicId?: string | null;
  priority?: DoubtPriority;
  images?: DoubtImage[];
}

export interface ResolveDoubtData {
  resolutionNote?: string;
}

export interface CreateExamData {
  name: string;
  examDate?: string;
}

export interface CreateSubjectData {
  name: string;
}

export interface CreateTopicData {
  name: string;
}

export interface UpdateTopicProgressData {
  study?: boolean;
  rev1?: boolean;
  rev2?: boolean;
  rev3?: boolean;
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam;
}

export interface ExamsResponse {
  success: boolean;
  message: string;
  data: Exam[];
}

export interface SubjectResponse {
  success: boolean;
  message: string;
  data: Subject;
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  data: Subject[];
}

export interface TopicResponse {
  success: boolean;
  message: string;
  data: Topic;
}

export interface TopicsResponse {
  success: boolean;
  message: string;
  data: Topic[];
}

export interface DoubtResponse {
  success: boolean;
  message: string;
  data: Doubt;
}

export interface DoubtsResponse {
  success: boolean;
  message: string;
  data: Doubt[];
}

// Study Event types
export interface StudyEventRecurrence {
  type: 'daily' | 'weekly' | 'custom';
  daysOfWeek: number[];
}

export interface StudyEvent {
  _id: string;
  userId: string;
  title: string;
  date?: string;
  isRecurring: boolean;
  recurrence?: StudyEventRecurrence;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  completed?: boolean;
  createdAt?: string;
}

export interface CreateStudyEventData {
  title: string;
  date?: string;
  isRecurring?: boolean;
  recurrence?: StudyEventRecurrence;
  examId?: string;
  subjectId?: string;
  topicId?: string;
}

export interface StudyEventResponse {
  success: boolean;
  message: string;
  data: StudyEvent;
}

export interface StudyEventsResponse {
  success: boolean;
  message: string;
  data: StudyEvent[];
}

export interface StudyEventLogResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    eventId: string;
    date: string;
    completed: boolean;
  };
}

export type Plan = 'Free' | 'Couple' | 'Pro';

// User Subscription types
export type SubscriptionPlan = 'FREE' | 'PRO' | 'COUPLE' | 'LIFETIME';
export type BillingCycle = 'MONTHLY' | 'YEARLY' | 'NONE';

export interface UserSubscription {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  price: number;
  startedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  daysRemaining: number | null;
}

// Watch types (for Movies & Series)
export interface WatchItemPoster {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

// Poster can be either Cloudinary object or direct URL string
export type WatchItemPosterType = WatchItemPoster | string;

export interface WatchItem {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'movie' | 'series' | 'documentary' | 'anime' | 'short';
  status: 'planned' | 'watching' | 'watched' | 'dropped';
  platforms?: string[];
  isFavorite: boolean;
  rating?: number; // 1-5, only when status is 'watched'
  moodTags?: string[];
  notes?: string;
  poster?: WatchItemPosterType; // Can be Cloudinary object or URL string
  currentSeason?: number; // Only for series
  currentEpisode?: number; // Only for series
  lastWatchedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWatchItemData {
  title: string;
  description?: string;
  type: 'movie' | 'series' | 'documentary' | 'anime' | 'short';
  status?: 'planned' | 'watching' | 'watched' | 'dropped';
  platforms?: string[];
  isFavorite?: boolean;
  rating?: number; // 1-5, only when status is 'watched'
  moodTags?: string[];
  notes?: string;
  poster?: File; // File upload
  posterUrl?: string; // Direct image URL (stored as-is, no Cloudinary upload)
  currentSeason?: number; // Only for series
  currentEpisode?: number; // Only for series
}

export interface UpdateWatchProgressData {
  currentSeason?: number;
  currentEpisode?: number;
}

export interface WatchItemResponse {
  success: boolean;
  message: string;
  data: WatchItem;
}

export interface WatchItemsResponse {
  success: boolean;
  message: string;
  data: WatchItem[];
}

// Legacy Movie interface (for backward compatibility if needed)
export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  status: 'watching' | 'watchlist' | 'watched';
  rating: number; // 1-5
  image: string;
}

// Gifting types (for Gifting & Dates)
export interface GiftIdeaLocation {
  name?: string;
  city?: string;
  country?: string;
}

export interface GiftIdeaPrice {
  amount: number;
  currency: string;
}

export interface GiftIdeaImage {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface GiftIdea {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'cafe' | 'stay' | 'gift' | 'activity' | 'experience' | 'other';
  location?: GiftIdeaLocation;
  price?: GiftIdeaPrice;
  link?: string;
  images: GiftIdeaImage[];
  tags?: string[];
  status: 'idea' | 'planned' | 'used' | 'archived';
  isFavorite: boolean;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGiftIdeaData {
  title: string;
  description?: string;
  type: 'cafe' | 'stay' | 'gift' | 'activity' | 'experience' | 'other';
  location?: GiftIdeaLocation;
  price?: GiftIdeaPrice;
  link?: string;
  tags?: string[];
  status?: 'idea' | 'planned' | 'used' | 'archived';
  isFavorite?: boolean;
  source?: string;
  images?: File[];
}

export interface GiftIdeaResponse {
  success: boolean;
  message: string;
  data: GiftIdea;
}

export interface GiftIdeasResponse {
  success: boolean;
  message: string;
  data: GiftIdea[];
}

// Legacy DateIdea type (for backward compatibility if needed)
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
  profileImage?: string | {
    publicId: string;
    url: string;
    width?: number;
    height?: number;
    format?: string;
  };
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

// Money Management types
export interface Income {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'bonus' | 'side_income' | 'refund' | 'other';
  frequency: 'monthly' | 'one_time';
  receivedAt: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIncomeData {
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'bonus' | 'side_income' | 'refund' | 'other';
  frequency: 'monthly' | 'one_time';
  receivedAt: string;
  notes?: string;
}

export interface IncomeResponse {
  success: boolean;
  message: string;
  data: Income;
}

export interface IncomesResponse {
  success: boolean;
  message: string;
  data: Income[];
}

export interface MonthlyIncomeSummary {
  total: number;
  count: number;
  byType: Record<string, number>;
  incomes: Income[];
}

export interface MonthlyIncomeSummaryResponse {
  success: boolean;
  message: string;
  data: MonthlyIncomeSummary;
}

export interface FixedExpense {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  category: 'rent' | 'utilities' | 'internet' | 'phone' | 'insurance' | 'emi' | 'subscription' | 'other';
  billingCycle: 'monthly' | 'yearly';
  dueDate?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFixedExpenseData {
  name: string;
  amount: number;
  category: 'rent' | 'utilities' | 'internet' | 'phone' | 'insurance' | 'emi' | 'subscription' | 'other';
  billingCycle: 'monthly' | 'yearly';
  dueDate?: number;
  isActive?: boolean;
}

export interface FixedExpenseResponse {
  success: boolean;
  message: string;
  data: FixedExpense;
}

export interface FixedExpensesResponse {
  success: boolean;
  message: string;
  data: FixedExpense[];
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'expense' | 'income';
  category: 'food' | 'travel' | 'shopping' | 'entertainment' | 'health' | 'misc';
  date: string;
  note?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'expense' | 'income';
  category: 'food' | 'travel' | 'shopping' | 'entertainment' | 'health' | 'misc';
  date: string;
  note?: string;
  source?: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface MonthlyTransactions {
  totalExpenses: number;
  totalIncome: number;
  expensesByCategory: Record<string, number>;
  transactions: Transaction[];
}

export interface MonthlyTransactionsResponse {
  success: boolean;
  message: string;
  data: MonthlyTransactions;
}

export interface Fund {
  _id: string;
  userId: string;
  name: string;
  type: 'emergency' | 'savings' | 'goal';
  targetAmount?: number;
  currentAmount: number;
  priority: number;
  isLocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFundData {
  name: string;
  type: 'emergency' | 'savings' | 'goal';
  targetAmount?: number;
  currentAmount?: number;
  priority?: number;
  isLocked?: boolean;
}

export interface FundResponse {
  success: boolean;
  message: string;
  data: Fund;
}

export interface FundsResponse {
  success: boolean;
  message: string;
  data: Fund[];
}

export interface Debt {
  _id: string;
  userId: string;
  personName: string;
  amount: number;
  type: 'lent' | 'borrowed';
  status: 'pending' | 'settled';
  dueDate?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDebtData {
  personName: string;
  amount: number;
  type: 'lent' | 'borrowed';
  dueDate?: string;
  note?: string;
}

export interface DebtResponse {
  success: boolean;
  message: string;
  data: Debt;
}

export interface DebtsResponse {
  success: boolean;
  message: string;
  data: Debt[];
}

export interface WishlistItem {
  _id: string;
  userId: string;
  name: string;
  price: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'bought' | 'removed';
  plannedMonth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWishlistItemData {
  name: string;
  price: number;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'bought' | 'removed';
  plannedMonth?: string;
}

export interface WishlistItemResponse {
  success: boolean;
  message: string;
  data: WishlistItem;
}

export interface WishlistItemsResponse {
  success: boolean;
  message: string;
  data: WishlistItem[];
}

export interface MoneyOverview {
  totalIncome: number;
  fixedExpensesTotal: number;
  savingsTotal: number;
  safeToSpend: number;
  spentSoFar: number;
  emergencyFundStatus: 'low' | 'okay' | 'healthy';
  emergencyFundAmount: number;
  debts: {
    owed: number;
    receivable: number;
  };
}

export interface MoneyOverviewResponse {
  success: boolean;
  message: string;
  data: MoneyOverview;
}

// Dashboard types
export interface DashboardGreeting {
  message: string;
  date: string;
}

export interface NextTrip {
  title: string;
  startDate: string;
  endDate?: string | null;
  startsInDays: number;
  image: string | null;
}

export interface NextSubscription {
  name: string;
  amount: number;
  currency?: string;
  renewsInDays: number;
}

export interface NextPayment {
  title: string;
  amount: number;
  dueInDays: number;
}

export interface Upcoming {
  nextTrip: NextTrip | null;
  nextSubscription: NextSubscription | null;
  nextPayment: NextPayment | null;
}

export interface MoneySnapshot {
  currentBalance: number;
  monthlyBudget: number;
  monthlySpent: number;
  borrowed: number;
  lent: number;
}

export interface ContinueWatching {
  title: string;
  type: 'movie' | 'series';
  season: number | null;
  episode: number | null;
  platform: string | null;
  progressPercent: number;
  poster: string | null; // Can be URL string or Cloudinary URL
}

export interface RecentActivity {
  type: 'DIARY' | 'TRAVEL' | 'MONEY' | 'IDEA' | 'WATCH';
  message: string;
  createdAt: string;
}

export interface QuickCapture {
  enabled: boolean;
}

export interface Insight {
  message: string;
  cta: string;
}

export interface DashboardData {
  greeting: DashboardGreeting;
  upcoming: Upcoming;
  moneySnapshot: MoneySnapshot;
  continueWatching: ContinueWatching | null;
  recentActivity: RecentActivity[];
  quickCapture: QuickCapture;
  insight: Insight | null;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
