import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  RefreshCw,
  Upload,
  Plus,
} from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import FileStatusCard from "@/components/FileStatusCard";
import ValidationResultCard from "@/components/ValidationResultCard";
import FileUpload from "@/components/FileUpload";

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isPolling, setIsPolling] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    currentSession,
    files,
    validationResults,
    workflowStatus,
    isLoading,
    isAnalyzing,
    isUploadingFiles,
    loadSession,
    loadValidationResults,
    loadWorkflowStatus,
    runAnalysis,
    retryAnalysis,
    deleteFile,
    clearSession,
    uploadFiles,
  } = useSessionStore();

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
      loadValidationResults(sessionId);
      loadWorkflowStatus(sessionId);
    }

    return () => {
      clearSession();
    };
  }, [sessionId]);

  // Auto-refresh during processing
  useEffect(() => {
    if (!sessionId || !workflowStatus) return;

    const shouldPoll =
      workflowStatus.workflow_stage === "processing_files" ||
      workflowStatus.workflow_stage === "validating" ||
      isAnalyzing;

    if (shouldPoll && !isPolling) {
      setIsPolling(true);
      const interval = setInterval(() => {
        loadWorkflowStatus(sessionId);
        if (workflowStatus.workflow_stage === "completed") {
          loadValidationResults(sessionId);
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        setIsPolling(false);
      };
    }
  }, [sessionId, workflowStatus?.workflow_stage, isAnalyzing]);

  const handleRunAnalysis = async () => {
    if (sessionId) {
      await runAnalysis(sessionId);
    }
  };

  const handleRetryAnalysis = async () => {
    if (sessionId) {
      await retryAnalysis(sessionId);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    await deleteFile(fileId);
  };

  const handleRefresh = () => {
    if (sessionId) {
      loadSession(sessionId);
      loadValidationResults(sessionId);
      loadWorkflowStatus(sessionId);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (!sessionId || selectedFiles.length === 0) return;

    const success = await uploadFiles(sessionId, selectedFiles);
    if (success) {
      setSelectedFiles([]);
      setShowUpload(false);
      handleRefresh(); // Refresh the session data
    }
  };

  const handleToggleUpload = () => {
    setShowUpload(!showUpload);
    if (showUpload) {
      setSelectedFiles([]);
    }
  };

  const getOverallProgress = (): number => {
    if (!workflowStatus) return 0;

    const stage = workflowStatus.workflow_stage;
    switch (stage) {
      case "uploading":
        return 10;
      case "processing_files":
        return 40;
      case "validating":
        return 70;
      case "completed":
        return 100;
      case "failed":
        return 0;
      default:
        return 0;
    }
  };

  const canRunAnalysis = files.length > 0 && !isAnalyzing;
  const canRetry =
    workflowStatus?.workflow_stage === "failed" ||
    files.some((f) => f.processing_status === "FAILED");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentSession || !sessionId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Session not found</p>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/history")}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              QC Analysis Session
            </h1>
            <p className="text-sm text-gray-500">
              Created {formatDate(currentSession.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary inline-flex items-center space-x-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          {canRetry && (
            <button
              onClick={handleRetryAnalysis}
              className="btn-warning inline-flex items-center space-x-2"
              disabled={isAnalyzing}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          )}

          {canRunAnalysis && (
            <button
              onClick={handleRunAnalysis}
              className="btn-primary inline-flex items-center space-x-2"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isAnalyzing ? "Analyzing..." : "Run Analysis"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Status Overview */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Session Status
            </h3>
            <StatusBadge
              status={workflowStatus?.session_status || currentSession.status}
              size="lg"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Overall Result
            </h3>
            {currentSession.overall_result ? (
              <StatusBadge status={currentSession.overall_result} size="lg" />
            ) : (
              <span className="text-gray-400">Pending analysis</span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Files Uploaded
            </h3>
            <div className="text-2xl font-bold text-gray-900">
              {files.length}
            </div>
          </div>
        </div>

        {workflowStatus && (
          <div className="mt-6">
            <ProgressBar
              progress={getOverallProgress()}
              status={
                workflowStatus.workflow_stage === "failed"
                  ? "danger"
                  : workflowStatus.workflow_stage === "completed"
                  ? "success"
                  : "primary"
              }
              animated={
                workflowStatus.workflow_stage === "processing_files" ||
                workflowStatus.workflow_stage === "validating"
              }
            />
          </div>
        )}
      </div>

      {/* Files Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Uploaded Files ({files.length})
          </h2>
          <div className="flex items-center space-x-3">
            {workflowStatus?.processing_summary && (
              <div className="text-sm text-gray-500">
                Completed:{" "}
                {workflowStatus.processing_summary.by_status.COMPLETED || 0} |
                Processing:{" "}
                {workflowStatus.processing_summary.by_status.PROCESSING || 0} |
                Failed:{" "}
                {workflowStatus.processing_summary.by_status.FAILED || 0}
              </div>
            )}
            <button
              onClick={handleToggleUpload}
              className="btn-primary btn-sm inline-flex items-center space-x-2"
              disabled={isUploadingFiles}
            >
              <Plus className="h-4 w-4" />
              <span>{showUpload ? "Cancel Upload" : "Add Files"}</span>
            </button>
          </div>
        </div>

        {/* Upload Section (when toggled) */}
        {showUpload && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Upload Additional Files
            </h3>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
              isUploading={isUploadingFiles}
            />

            {selectedFiles.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-300 mt-4">
                <div className="text-sm text-gray-600">
                  {selectedFiles.length} file(s) ready to upload
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleToggleUpload}
                    className="btn-secondary btn-sm"
                    disabled={isUploadingFiles}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadFiles}
                    disabled={isUploadingFiles}
                    className="btn-primary btn-sm inline-flex items-center space-x-2"
                  >
                    {isUploadingFiles ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="h-3 w-3" />
                    )}
                    <span>
                      {isUploadingFiles ? "Uploading..." : "Upload Files"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No files uploaded yet</p>
            <p className="text-sm mt-1">
              Use the "Add Files" button above to upload files to this session
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <FileStatusCard
                key={file.id}
                file={file}
                onDelete={handleDeleteFile}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Validation Results Section */}
      {validationResults.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Validation Results ({validationResults.length})
            </h2>
            {workflowStatus?.validation_summary && (
              <div className="text-sm text-gray-500">
                Pass: {workflowStatus.validation_summary.passed} | Warning:{" "}
                {workflowStatus.validation_summary.warnings} | Fail:{" "}
                {workflowStatus.validation_summary.failed}
              </div>
            )}
          </div>

          <div>
            {/* Table Header */}
            <div className="bg-gray-50 border border-gray-200">
              <div className="grid grid-cols-12 items-center p-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-1"></div>
                <div className="col-span-3">Check Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-6">Message</div>
              </div>
            </div>

            {/* Validation Results */}
            {validationResults
              .sort((a, b) => {
                // Sort by status priority: FAIL, WARNING, PASS
                const priority = { FAIL: 0, WARNING: 1, PASS: 2 };
                return (
                  priority[a.status as keyof typeof priority] -
                  priority[b.status as keyof typeof priority]
                );
              })
              .map((result) => (
                <ValidationResultCard
                  key={result.id}
                  result={result}
                  showDetails={true}
                />
              ))}
          </div>
        </div>
      )}

      {/* Session Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Session Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Session ID:</span>
            <br />
            <span className="font-mono text-gray-900">{sessionId}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Created:</span>
            <br />
            <span className="text-gray-900">
              {formatDate(currentSession.created_at)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Last Updated:</span>
            <br />
            <span className="text-gray-900">
              {formatDate(currentSession.updated_at)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Workflow Stage:</span>
            <br />
            <span className="text-gray-900 capitalize">
              {workflowStatus?.workflow_stage?.replace("_", " ") || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
