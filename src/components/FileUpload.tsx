import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  isUploading = false,
  selectedFiles = [],
  onRemoveFile,
  maxFiles = 10,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/vnd.ms-excel": [".xls"],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        console.warn("Some files were rejected:", rejectedFiles);
      }
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles,
      disabled: isUploading,
    });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeLabel = (type: string): string => {
    if (type.includes("pdf")) return "Traveler PDF";
    if (type.includes("image")) return "Product Image";
    if (type.includes("sheet") || type.includes("excel")) return "BOM Excel";
    return "Unknown";
  };

  const getFileTypeColor = (type: string): string => {
    if (type.includes("pdf")) return "bg-red-100 text-red-800";
    if (type.includes("image")) return "bg-blue-100 text-blue-800";
    if (type.includes("sheet") || type.includes("excel"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragActive && !isDragReject && "border-primary-500 bg-primary-50",
          isDragReject && "border-danger-500 bg-danger-50",
          !isDragActive && "border-gray-300 hover:border-primary-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isDragReject ? (
            <AlertCircle className="h-12 w-12 text-danger-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? isDragReject
                  ? "Some files are not supported"
                  : "Drop files here"
                : "Drag and drop files here"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              or click to browse files
            </p>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>Supported files: PDF, JPG, PNG, Excel (.xlsx, .xls)</p>
            <p>Maximum file size: {formatFileSize(maxSize)}</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-900">
            Selected Files ({selectedFiles.length})
          </h3>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          getFileTypeColor(file.type)
                        )}
                      >
                        {getFileTypeLabel(file.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </div>

                {onRemoveFile && !isUploading && (
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span className="text-sm font-medium text-primary-700">
              Uploading files...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
