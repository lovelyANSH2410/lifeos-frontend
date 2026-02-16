import { API_BASE_URL, DOUBT_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  Doubt,
  DoubtStatus,
  DoubtPriority,
  CreateDoubtData,
  UpdateDoubtData,
  ResolveDoubtData,
  DoubtResponse,
  DoubtsResponse,
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

export const createDoubt = async (
  subjectId: string,
  payload: CreateDoubtData,
  files: File[] = []
): Promise<DoubtResponse> => {
  const hasFiles = files && files.length > 0;

  if (!hasFiles) {
    // JSON payload only (no file uploads)
    return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.CREATE(subjectId), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  const formData = new FormData();
  formData.append('title', payload.title);
  if (payload.description) formData.append('description', payload.description);
  if (payload.topicId) formData.append('topicId', payload.topicId);
  if (payload.priority) formData.append('priority', payload.priority);
  if (payload.images && payload.images.length > 0) {
    formData.append('images', JSON.stringify(payload.images));
  }
  files.forEach((file) => {
    formData.append('images', file);
  });

  return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.CREATE(subjectId), {
    method: 'POST',
    body: formData
  });
};

export const getDoubtsBySubject = async (
  subjectId: string,
  filters?: { status?: DoubtStatus; priority?: DoubtPriority }
): Promise<DoubtsResponse> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);

  const query = params.toString();
  const endpoint =
    DOUBT_ENDPOINTS.GET_BY_SUBJECT(subjectId) + (query ? `?${query}` : '');

  return apiRequest<DoubtsResponse>(endpoint);
};

export const getDoubtById = async (doubtId: string): Promise<DoubtResponse> => {
  return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.GET_BY_ID(doubtId));
};

export const updateDoubt = async (
  doubtId: string,
  payload: UpdateDoubtData,
  files: File[] = []
): Promise<DoubtResponse> => {
  const hasFiles = files && files.length > 0;

  if (!hasFiles) {
    return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.UPDATE(doubtId), {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  const formData = new FormData();
  if (payload.title) formData.append('title', payload.title);
  if (payload.description) formData.append('description', payload.description);
  if (payload.topicId !== undefined) {
    if (payload.topicId) {
      formData.append('topicId', payload.topicId);
    } else {
      formData.append('topicId', '');
    }
  }
  if (payload.priority) formData.append('priority', payload.priority);
  if (payload.images && payload.images.length > 0) {
    formData.append('images', JSON.stringify(payload.images));
  }
  files.forEach((file) => {
    formData.append('images', file);
  });

  return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.UPDATE(doubtId), {
    method: 'PUT',
    body: formData
  });
};

export const resolveDoubt = async (
  doubtId: string,
  payload?: ResolveDoubtData
): Promise<DoubtResponse> => {
  return apiRequest<DoubtResponse>(DOUBT_ENDPOINTS.RESOLVE(doubtId), {
    method: 'PUT',
    body: JSON.stringify(payload || {})
  });
};

export const deleteDoubt = async (
  doubtId: string
): Promise<{ success: boolean; message: string; data: null }> => {
  return apiRequest(DOUBT_ENDPOINTS.DELETE(doubtId), { method: 'DELETE' });
};

