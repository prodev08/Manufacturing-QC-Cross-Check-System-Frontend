import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, ArrowRight } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import FileUpload from "@/components/FileUpload";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { createSession, uploadFiles, isLoading, isUploadingFiles } =
    useSessionStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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
    </div>
  );
};

export default Dashboard;
