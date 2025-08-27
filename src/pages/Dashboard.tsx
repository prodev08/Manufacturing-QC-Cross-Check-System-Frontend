import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, ArrowRight, Eye, RefreshCw } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { formatDate } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import StatusBadge from "@/components/StatusBadge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    createSession,
    uploadFiles,
    isLoading,
    isUploadingFiles,
    sessions,
    isLoadingSessions,
    loadSessions,
  } = useSessionStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateSession = async () => {
    const session = await createSession();
    if (session) {
      setCurrentSessionId(session.id);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndAnalyze = async () => {
    if (!currentSessionId || selectedFiles.length === 0) return;

    const success = await uploadFiles(currentSessionId, selectedFiles);
    if (success) {
      navigate(`/session/${currentSessionId}`);
    }
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const handleRefresh = () => {
    loadSessions();
  };

  // Get recent sessions for summary
  const recentSessions = sessions.slice(0, 5);
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const processingSessions = sessions.filter(
    (s) => s.status === "PROCESSING"
  ).length;
  const failedSessions = sessions.filter((s) => s.status === "FAILED").length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Manufacturing QC Cross-Check System
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Upload your Traveler PDFs, product images, and BOM Excel files to
          automatically cross-check for discrepancies and ensure quality control
          standards.
        </p>
      </div>

      {/* Main Action Card */}
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Start New QC Analysis
            </h2>
            <p className="text-gray-600">
              Create a new session and upload your manufacturing documents
            </p>
          </div>

          {!currentSessionId ? (
            /* Step 1: Create Session */
            <div className="text-center">
              <button
                onClick={handleCreateSession}
                disabled={isLoading}
                className="btn-primary btn-lg inline-flex items-center space-x-2 px-8 py-4 text-lg"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                <span>{isLoading ? "Creating..." : "Create New Session"}</span>
              </button>
            </div>
          ) : (
            /* Step 2: Upload Files */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Session Created
                  </h3>
                  <p className="text-sm text-gray-600">
                    Session ID: {currentSessionId}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-success-600">
                  <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                  <span>Ready for files</span>
                </div>
              </div>

              <FileUpload
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFiles}
                onRemoveFile={handleRemoveFile}
                isUploading={isUploadingFiles}
              />

              {selectedFiles.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedFiles.length} file(s) ready to upload
                  </div>
                  <button
                    onClick={handleUploadAndAnalyze}
                    disabled={isUploadingFiles}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    {isUploadingFiles ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>
                      {isUploadingFiles ? "Uploading..." : "Upload & Analyze"}
                    </span>
                    {!isUploadingFiles && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="max-w-4xl mx-auto">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Required Files for Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-semibold">PDF</span>
              </div>
              <h4 className="font-medium text-gray-900">Traveler Documents</h4>
              <p className="text-sm text-gray-600 mt-1">
                Work instructions with job numbers, part numbers, and Seq 20
                data
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">IMG</span>
              </div>
              <h4 className="font-medium text-gray-900">Product Images</h4>
              <p className="text-sm text-gray-600 mt-1">
                Board photos with serials, part numbers, and flight status
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-semibold">XLS</span>
              </div>
              <h4 className="font-medium text-gray-900">BOM Excel Files</h4>
              <p className="text-sm text-gray-600 mt-1">
                Bill of materials with job numbers, parts, and revisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats and Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Session Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-xl font-bold text-gray-900">
                  {totalSessions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-xl font-bold text-success-600">
                  {completedSessions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing</span>
                <span className="text-xl font-bold text-warning-600">
                  {processingSessions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed</span>
                <span className="text-xl font-bold text-danger-600">
                  {failedSessions}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/history")}
                className="w-full btn-secondary"
              >
                View All Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Sessions
              </h2>
              <button
                onClick={handleRefresh}
                className="btn-secondary btn-sm inline-flex items-center space-x-1"
                disabled={isLoadingSessions}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>

            {isLoadingSessions ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No sessions yet</p>
                <p className="text-sm mt-1">Create your first session below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={session.status} size="sm" />
                        {session.overall_result && (
                          <StatusBadge
                            status={session.overall_result}
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-mono">
                          {session.id.slice(0, 8)}...
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(session.created_at)}</span>
                        {session.files && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{session.files.length} files</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewSession(session.id)}
                      className="btn-primary btn-sm inline-flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
