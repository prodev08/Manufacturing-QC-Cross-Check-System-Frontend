export interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  overall_result?: 'PASS' | 'WARNING' | 'FAIL';
  files?: UploadedFile[];
  validation_results?: ValidationResult[];
}

export interface UploadedFile {
  id: string;
  session_id: string;
  filename: string;
  original_filename: string;
  file_type: 'TRAVELER_PDF' | 'PRODUCT_IMAGE' | 'BOM_EXCEL';
  file_size: number;
  mime_type: string;
  processing_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processing_error?: string;
  extracted_data?: any;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  id: string;
  session_id: string;
  check_type: 'JOB_NUMBER' | 'PART_NUMBER' | 'REVISION' | 'BOARD_SERIAL' | 'UNIT_SERIAL' | 'FLIGHT_STATUS' | 'FILE_COMPLETENESS';
  status: 'PASS' | 'WARNING' | 'FAIL';
  description: string;
  source_files?: string[];
  expected_value?: string;
  actual_value?: string;
  details?: string;
  created_at: string;
}

export interface ValidationSummary {
  total_checks: number;
  passed: number;
  warnings: number;
  failed: number;
  overall_result?: string;
}

export interface WorkflowStatus {
  session_id: string;
  session_status: string;
  overall_result?: string;
  workflow_stage: 'uploading' | 'processing_files' | 'validating' | 'completed' | 'failed' | 'unknown';
  created_at: string;
  updated_at: string;
  processing_summary: {
    total_files: number;
    by_status: Record<string, number>;
    by_type: Record<string, number>;
    files: Array<{
      id: string;
      filename: string;
      file_type: string;
      processing_status: string;
      has_extracted_data: boolean;
      processing_error?: string;
    }>;
  };
  validation_summary?: ValidationSummary;
}

export interface FileUploadResponse {
  file_id: string;
  filename: string;
  file_type: string;
  status: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  page: number;
  per_page: number;
}
