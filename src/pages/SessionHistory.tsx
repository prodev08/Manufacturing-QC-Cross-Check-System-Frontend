import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Plus, RefreshCw } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

const SessionHistory: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, isLoadingSessions, loadSessions, createSession } =
    useSessionStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const handleViewSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const handleCreateNew = async () => {
    const session = await createSession();
    if (session) {
      navigate(`/session/${session.id}`);
    }
  };

  const handleRefresh = () => {
    loadSessions();
  };

  if (isLoadingSessions) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-600 mt-1">
            View and manage your QC analysis sessions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary inline-flex items-center space-x-2"
            disabled={isLoadingSessions}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {sessions.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Summary Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {sessions.length}
              </div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {sessions.filter((s) => s.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {sessions.filter((s) => s.status === "PROCESSING").length}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-danger-600">
                {sessions.filter((s) => s.status === "FAILED").length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first QC analysis session to get started
            </p>
            <button
              onClick={handleCreateNew}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Session</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((session) => (
              <div key={session.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        QC Session
                      </h3>
                      <StatusBadge status={session.status} />
                      {session.overall_result && (
                        <StatusBadge status={session.overall_result} />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Session ID:</span>
                        <br />
                        <span className="font-mono text-xs">
                          {session.id.slice(0, 8)}...
                        </span>
                      </div>

                      <div>
                        <span className="font-medium">Created:</span>
                        <br />
                        <span>{formatDate(session.created_at)}</span>
                      </div>

                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <br />
                        <span>{formatDate(session.updated_at)}</span>
                      </div>
                    </div>

                    {session.files && session.files.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">
                              {session.files.length}
                            </span>{" "}
                            file(s)
                          </span>

                          {session.validation_results && (
                            <span>
                              <span className="font-medium">
                                {session.validation_results.length}
                              </span>{" "}
                              validation(s)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => handleViewSession(session.id)}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
