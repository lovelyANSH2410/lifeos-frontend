import { API_BASE_URL, STUDY_EVENT_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  StudyEvent,
  CreateStudyEventData,
  StudyEventResponse,
  StudyEventsResponse,
  StudyEventLogResponse,
  ApiError
} from '@/types';

const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication required');

  const headers: HeadersInit = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) {
    const err: ApiError = data;
    throw new Error(err.message || 'An error occurred');
  }
  return data as T;
};

export const createStudyEvent = async (data: CreateStudyEventData): Promise<StudyEventResponse> => {
  return apiRequest<StudyEventResponse>(STUDY_EVENT_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getStudyEvents = async (month: string): Promise<StudyEventsResponse> => {
  return apiRequest<StudyEventsResponse>(`${STUDY_EVENT_ENDPOINTS.GET_ALL}?month=${month}`);
};

export const getTodayStudyEvents = async (): Promise<StudyEventsResponse> => {
  return apiRequest<StudyEventsResponse>(STUDY_EVENT_ENDPOINTS.GET_TODAY);
};

export const completeStudyEvent = async (
  eventId: string,
  date?: string
): Promise<StudyEventLogResponse> => {
  return apiRequest<StudyEventLogResponse>(STUDY_EVENT_ENDPOINTS.COMPLETE(eventId), {
    method: 'POST',
    body: JSON.stringify({ date })
  });
};
