import React, { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ValidationResult } from "@/types/api";
import { cn } from "@/lib/utils";

interface ValidationResultCardProps {
  result: ValidationResult;
  showDetails?: boolean;
}

const ValidationResultCard: React.FC<ValidationResultCardProps> = ({
  result,
  showDetails = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PASS":
        return {
          icon: CheckCircle,
          bgColor: "bg-success-100",
          textColor: "text-success-800",
          label: "Pass",
        };
      case "WARNING":
        return {
          icon: AlertTriangle,
          bgColor: "bg-warning-100",
          textColor: "text-warning-800",
          label: "Warning",
        };
      case "FAIL":
        return {
          icon: XCircle,
          bgColor: "bg-danger-100",
          textColor: "text-danger-800",
          label: "Fail",
        };
      case "INFO":
        return {
          icon: Info,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          label: "Info",
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          label: status,
        };
    }
  };

  const config = getStatusConfig(result.status);
  const StatusIcon = config.icon;

  const getCheckTypeLabel = (checkType: string): string => {
    switch (checkType) {
      case "JOB_NUMBER":
        return "Job Number";
      case "PART_NUMBER":
        return "Part Number";
      case "REVISION":
        return "Revision";
      case "BOARD_SERIAL":
        return "Board Serial";
      case "UNIT_SERIAL":
        return "Unit Serial";
      case "FLIGHT_STATUS":
        return "Flight Status";
      case "FILE_COMPLETENESS":
        return "File Completeness";
      default:
        return checkType.replace("_", " ");
    }
  };

  const hasDetails =
    result.expected_value || result.actual_value || result.details;

  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="grid grid-cols-12 items-center p-4 gap-4">
          {/* Expand/Collapse Icon */}
          <div className="col-span-1 flex justify-center">
            {hasDetails ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )
            ) : null}
          </div>

          {/* Check Type */}
          <div className="col-span-3">
            <div className="text-sm font-medium text-gray-900">
              {getCheckTypeLabel(result.check_type)}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2">
            <div
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                config.bgColor,
                config.textColor
              )}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </div>
          </div>

          {/* Message */}
          <div className="col-span-6">
            <div className="text-sm text-gray-700">{result.description}</div>
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Expected Value */}
            {result.expected_value && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Expected Value
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 font-mono">
                  {result.expected_value}
                </div>
              </div>
            )}

            {/* Actual Value */}
            {result.actual_value && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Actual Value
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 font-mono">
                  {result.actual_value}
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {result.details && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500 mb-2">
                Details
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900">
                {result.details}
              </div>
            </div>
          )}

          {/* Source Files */}
          {result.source_files && result.source_files.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500 mb-2">
                Source Files
              </div>
              <div className="text-xs text-gray-600">
                {result.source_files.join(", ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationResultCard;
