import { API_BASE_URL, EXAM_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  Exam,
  Subject,
  Topic,
  CreateExamData,
  CreateSubjectData,
  CreateTopicData,
  UpdateTopicProgressData,
  ExamResponse,
  ExamsResponse,
  SubjectResponse,
  SubjectsResponse,
  TopicResponse,
  TopicsResponse,
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

export const createExam = async (data: CreateExamData): Promise<ExamResponse> => {
  return apiRequest<ExamResponse>(EXAM_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getExams = async (): Promise<ExamsResponse> => {
  return apiRequest<ExamsResponse>(EXAM_ENDPOINTS.GET_ALL);
};

export const getExamById = async (examId: string): Promise<ExamResponse> => {
  return apiRequest<ExamResponse>(EXAM_ENDPOINTS.GET_BY_ID(examId));
};

export const createSubject = async (examId: string, data: CreateSubjectData): Promise<SubjectResponse> => {
  return apiRequest<SubjectResponse>(EXAM_ENDPOINTS.SUBJECTS(examId).CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getSubjects = async (examId: string): Promise<SubjectsResponse> => {
  return apiRequest<SubjectsResponse>(EXAM_ENDPOINTS.SUBJECTS(examId).GET_ALL);
};

export const createTopic = async (subjectId: string, data: CreateTopicData): Promise<TopicResponse> => {
  return apiRequest<TopicResponse>(EXAM_ENDPOINTS.TOPICS(subjectId).CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getTopics = async (subjectId: string): Promise<TopicsResponse> => {
  return apiRequest<TopicsResponse>(EXAM_ENDPOINTS.TOPICS(subjectId).GET_ALL);
};

export const updateTopicProgress = async (
  topicId: string,
  data: UpdateTopicProgressData
): Promise<TopicResponse> => {
  return apiRequest<TopicResponse>(EXAM_ENDPOINTS.TOPIC_PROGRESS(topicId), {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};
