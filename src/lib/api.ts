import axios from 'axios';
import {
  Session,
  UploadedFile,
  ValidationResult,
  ValidationSummary,
  WorkflowStatus,
  FileUploadResponse,
  SessionListResponse,
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Session API
export const sessionApi = {
  create: async (): Promise<Session> => {
    const response = await api.post('/sessions/', {});
    return response.data;
  },

  list: async (skip = 0, limit = 100): Promise<SessionListResponse> => {
    const response = await api.get(`/sessions/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  get: async (sessionId: string): Promise<Session> => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  delete: async (sessionId: string): Promise<void> => {
    await api.delete(`/sessions/${sessionId}`);
  },
};

// File API
export const fileApi = {
  upload: async (sessionId: string, files: File[]): Promise<FileUploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(`/files/upload/${sessionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSessionFiles: async (sessionId: string): Promise<UploadedFile[]> => {
    const response = await api.get(`/files/session/${sessionId}`);
    return response.data;
  },

  getFile: async (fileId: string): Promise<UploadedFile> => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },
};

// Processing API
export const processingApi = {
  processSession: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/processing/process/${sessionId}`);
    return response.data;
  },

  getProcessingStatus: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/processing/status/${sessionId}`);
    return response.data;
  },

  processFile: async (fileId: string): Promise<any> => {
    const response = await api.post(`/processing/process-file/${fileId}`);
    return response.data;
  },
};

// Validation API
export const validationApi = {
  validate: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/validation/validate/${sessionId}`);
    return response.data;
  },

  validateNow: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/validation/validate-now/${sessionId}`);
    return response.data;
  },

  getResults: async (sessionId: string): Promise<ValidationResult[]> => {
    const response = await api.get(`/validation/results/${sessionId}`);
    return response.data;
  },

  getSummary: async (sessionId: string): Promise<ValidationSummary> => {
    const response = await api.get(`/validation/summary/${sessionId}`);
    return response.data;
  },

  clearResults: async (sessionId: string): Promise<void> => {
    await api.delete(`/validation/results/${sessionId}`);
  },
};

// Workflow API
export const workflowApi = {
  analyze: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/workflow/analyze/${sessionId}`);
    return response.data;
  },

  analyzeNow: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/workflow/analyze-now/${sessionId}`);
    return response.data;
  },

  getStatus: async (sessionId: string): Promise<WorkflowStatus> => {
    const response = await api.get(`/workflow/status/${sessionId}`);
    return response.data;
  },

  retry: async (sessionId: string): Promise<any> => {
    const response = await api.post(`/workflow/retry/${sessionId}`);
    return response.data;
  },
};

export default api;
