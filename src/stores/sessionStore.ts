import { create } from 'zustand';
import { Session, UploadedFile, ValidationResult, WorkflowStatus } from '@/types/api';
import { sessionApi, fileApi, validationApi, workflowApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface SessionState {
  // Current session
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;

  // Sessions list
  sessions: Session[];
  isLoadingSessions: boolean;

  // Files
  files: UploadedFile[];
  isUploadingFiles: boolean;

  // Validation results
  validationResults: ValidationResult[];
  isValidating: boolean;

  // Workflow status
  workflowStatus: WorkflowStatus | null;
  isAnalyzing: boolean;

  // Actions
  createSession: () => Promise<Session | null>;
  loadSession: (sessionId: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  uploadFiles: (sessionId: string, files: File[]) => Promise<boolean>;
  runAnalysis: (sessionId: string) => Promise<void>;
  loadValidationResults: (sessionId: string) => Promise<void>;
  loadWorkflowStatus: (sessionId: string) => Promise<void>;
  retryAnalysis: (sessionId: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  clearSession: () => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  currentSession: null,
  isLoading: false,
  error: null,
  sessions: [],
  isLoadingSessions: false,
  files: [],
  isUploadingFiles: false,
  validationResults: [],
  isValidating: false,
  workflowStatus: null,
  isAnalyzing: false,

  // Actions
  createSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionApi.create();
      set({ currentSession: session, isLoading: false });
      toast.success('New session created successfully');
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create session';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  loadSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionApi.get(sessionId);
      const files = await fileApi.getSessionFiles(sessionId);
      set({ 
        currentSession: session, 
        files,
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load session';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  loadSessions: async () => {
    set({ isLoadingSessions: true, error: null });
    try {
      const response = await sessionApi.list();
      set({ sessions: response.sessions, isLoadingSessions: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load sessions';
      set({ error: errorMessage, isLoadingSessions: false });
      toast.error(errorMessage);
    }
  },

  uploadFiles: async (sessionId: string, files: File[]): Promise<boolean> => {
    set({ isUploadingFiles: true, error: null });
    try {
      const uploadResults = await fileApi.upload(sessionId, files);
      
      // Reload session files
      const updatedFiles = await fileApi.getSessionFiles(sessionId);
      set({ files: updatedFiles, isUploadingFiles: false });
      
      toast.success(`Successfully uploaded ${uploadResults.length} file(s)`);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to upload files';
      set({ error: errorMessage, isUploadingFiles: false });
      toast.error(errorMessage);
      return false;
    }
  },

  runAnalysis: async (sessionId: string) => {
    set({ isAnalyzing: true, error: null });
    try {
      await workflowApi.analyze(sessionId);
      toast.success('Analysis started successfully');
      
      // Start polling for status updates
      const pollStatus = async () => {
        try {
          const status = await workflowApi.getStatus(sessionId);
          set({ workflowStatus: status });
          
          if (status.workflow_stage === 'completed' || status.workflow_stage === 'failed') {
            set({ isAnalyzing: false });
            if (status.workflow_stage === 'completed') {
              // Load validation results
              get().loadValidationResults(sessionId);
            }
          } else {
            // Continue polling
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Polling error:', error);
          set({ isAnalyzing: false });
        }
      };
      
      setTimeout(pollStatus, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to start analysis';
      set({ error: errorMessage, isAnalyzing: false });
      toast.error(errorMessage);
    }
  },

  loadValidationResults: async (sessionId: string) => {
    set({ isValidating: true, error: null });
    try {
      const results = await validationApi.getResults(sessionId);
      set({ validationResults: results, isValidating: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load validation results';
      set({ error: errorMessage, isValidating: false });
      // Don't show toast for this as it might be called automatically
    }
  },

  loadWorkflowStatus: async (sessionId: string) => {
    try {
      const status = await workflowApi.getStatus(sessionId);
      set({ workflowStatus: status });
    } catch (error: any) {
      console.error('Failed to load workflow status:', error);
    }
  },

  retryAnalysis: async (sessionId: string) => {
    set({ isAnalyzing: true, error: null });
    try {
      await workflowApi.retry(sessionId);
      toast.success('Retrying analysis...');
      
      // Reload workflow status
      get().loadWorkflowStatus(sessionId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to retry analysis';
      set({ error: errorMessage, isAnalyzing: false });
      toast.error(errorMessage);
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      await fileApi.deleteFile(fileId);
      
      // Remove file from local state
      const updatedFiles = get().files.filter(file => file.id !== fileId);
      set({ files: updatedFiles });
      
      toast.success('File deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete file';
      toast.error(errorMessage);
    }
  },

  clearSession: () => {
    set({
      currentSession: null,
      files: [],
      validationResults: [],
      workflowStatus: null,
      error: null,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
