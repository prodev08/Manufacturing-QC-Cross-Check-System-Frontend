import React from "react";
import { File, Trash2, RotateCcw } from "lucide-react";
import { UploadedFile } from "@/types/api";
import { formatFileSize, formatDate, getFileTypeLabel } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

interface FileStatusCardProps {
  file: UploadedFile;
  onDelete?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  showActions?: boolean;
}

const FileStatusCard: React.FC<FileStatusCardProps> = ({
  file,
  onDelete,
  onRetry,
  showActions = true,
}) => {
  const getFileTypeColor = (type: string): string => {
    if (type.includes("pdf")) return "bg-red-100 text-red-800 border-red-200";
    if (type.includes("image"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (type.includes("sheet") || type.includes("excel"))
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const hasError = file.processing_status === "FAILED";
  const isProcessing = file.processing_status === "PROCESSING";
  const canRetry = hasError && onRetry;
  const canDelete = !isProcessing && onDelete;

  return (
    <div
      className={cn(
        "card p-4 transition-all duration-200",
        hasError && "border-danger-200 bg-danger-50",
        isProcessing && "border-warning-200 bg-warning-50"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <File className="h-5 w-5 text-gray-400 mt-0.5" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {file.original_filename}
              </h4>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                  getFileTypeColor(file.mime_type)
                )}
              >
                {getFileTypeLabel(file.mime_type)}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Size: {formatFileSize(file.file_size)}</span>
                <span>Uploaded: {formatDate(file.created_at)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <StatusBadge status={file.processing_status} size="sm" />
                {file.processing_status === "COMPLETED" &&
                  file.extracted_data && (
                    <span className="text-xs text-success-600">
                      ✓ Data extracted
                    </span>
                  )}
              </div>

              {file.processing_error && (
                <p className="text-xs text-danger-600 mt-1">
                  Error: {file.processing_error}
                </p>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            {canRetry && (
              <button
                onClick={() => onRetry(file.id)}
                className="p-1 text-warning-600 hover:text-warning-700 transition-colors"
                title="Retry processing"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="p-1 text-danger-600 hover:text-danger-700 transition-colors"
                title="Delete file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Processing Progress for active files */}
      {isProcessing && (
        <div className="mt-3 pt-3 border-t border-warning-200">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warning-600"></div>
            <span className="text-sm text-warning-700">Processing file...</span>
          </div>
        </div>
      )}

      {/* Extracted Data Preview */}
      {file.processing_status === "COMPLETED" && file.extracted_data && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              {file.extracted_data.job_numbers?.length > 0 && (
                <div>
                  <span className="font-medium">Job Numbers:</span>{" "}
                  {file.extracted_data.job_numbers.slice(0, 2).join(", ")}
                  {file.extracted_data.job_numbers.length > 2 && "..."}
                </div>
              )}
              {file.extracted_data.board_serials?.length > 0 && (
                <div>
                  <span className="font-medium">Board Serials:</span>{" "}
                  {file.extracted_data.board_serials.slice(0, 2).join(", ")}
                  {file.extracted_data.board_serials.length > 2 && "..."}
                </div>
              )}
              {file.extracted_data.part_numbers?.length > 0 && (
                <div>
                  <span className="font-medium">Part Numbers:</span>{" "}
                  {file.extracted_data.part_numbers.slice(0, 2).join(", ")}
                  {file.extracted_data.part_numbers.length > 2 && "..."}
                </div>
              )}
              {file.extracted_data.flight_status && (
                <div>
                  <span className="font-medium">Flight Status:</span>{" "}
                  {file.extracted_data.flight_status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStatusCard;
