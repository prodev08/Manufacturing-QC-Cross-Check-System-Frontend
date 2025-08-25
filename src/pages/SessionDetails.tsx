import React from "react";
import { useParams } from "react-router-dom";

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Session Details
        </h1>
        <p className="text-gray-600">Session ID: {sessionId}</p>
        <p className="text-sm text-gray-500 mt-2">
          Full session details page will be implemented in the next step.
        </p>
      </div>
    </div>
  );
};

export default SessionDetails;
