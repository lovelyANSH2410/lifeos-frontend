import { API_BASE_URL, VAULT_DOCUMENT_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import type {
  CreateVaultDocumentData,
  VaultDocument,
  VaultDocumentResponse,
  VaultDocumentsResponse,
  SignedUrlResponse,
  ApiError
} from '@/types';

/**
 * Get stored auth token
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Make API request with authentication
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.message || 'An error occurred');
  }

  return data as T;
};

/**
 * Create a new vault document
 */
export const createVaultDocument = async (documentData: CreateVaultDocumentData): Promise<VaultDocumentResponse> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', documentData.title);
  if (documentData.category) {
    formData.append('category', documentData.category);
  }
  if (documentData.issuedDate) {
    formData.append('issuedDate', documentData.issuedDate);
  }
  if (documentData.expiryDate) {
    formData.append('expiryDate', documentData.expiryDate);
  }
  if (documentData.notes) {
    formData.append('notes', documentData.notes);
  }

  // Add file
  formData.append('file', documentData.file);

  return await apiRequest<VaultDocumentResponse>(VAULT_DOCUMENT_ENDPOINTS.CREATE, {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get vault documents with optional filters
 */
export const getVaultDocuments = async (filters?: {
  category?: string;
  expiringSoon?: boolean;
  isArchived?: boolean;
}): Promise<VaultDocumentsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.expiringSoon !== undefined) {
      queryParams.append('expiringSoon', filters.expiringSoon.toString());
    }
    if (filters.isArchived !== undefined) {
      queryParams.append('isArchived', filters.isArchived.toString());
    }
  }

  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${VAULT_DOCUMENT_ENDPOINTS.GET_ALL}?${queryString}`
    : VAULT_DOCUMENT_ENDPOINTS.GET_ALL;

  return await apiRequest<VaultDocumentsResponse>(endpoint);
};

/**
 * Get a single vault document by ID
 */
export const getVaultDocumentById = async (id: string): Promise<VaultDocumentResponse> => {
  return await apiRequest<VaultDocumentResponse>(VAULT_DOCUMENT_ENDPOINTS.GET_BY_ID(id));
};

/**
 * Get signed URL for document access
 */
export const getDocumentSignedUrl = async (id: string): Promise<SignedUrlResponse> => {
  return await apiRequest<SignedUrlResponse>(VAULT_DOCUMENT_ENDPOINTS.GET_SIGNED_URL(id));
};

/**
 * Delete (archive) a vault document
 */
export const deleteVaultDocument = async (id: string): Promise<VaultDocumentResponse> => {
  return await apiRequest<VaultDocumentResponse>(VAULT_DOCUMENT_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};
