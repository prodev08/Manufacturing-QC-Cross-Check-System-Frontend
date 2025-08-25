import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { ValidationResult } from "@/types/api";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ValidationResultCardProps {
  result: ValidationResult;
  showDetails?: boolean;
}

const ValidationResultCard: React.FC<ValidationResultCardProps> = ({
  result,
  showDetails = true,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PASS":
        return {
          icon: CheckCircle,
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          iconColor: "text-success-600",
          textColor: "text-success-800",
        };
      case "WARNING":
        return {
          icon: AlertTriangle,
          bgColor: "bg-warning-50",
          borderColor: "border-warning-200",
          iconColor: "text-warning-600",
          textColor: "text-warning-800",
        };
      case "FAIL":
        return {
          icon: XCircle,
          bgColor: "bg-danger-50",
          borderColor: "border-danger-200",
          iconColor: "text-danger-600",
          textColor: "text-danger-800",
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          iconColor: "text-gray-600",
          textColor: "text-gray-800",
        };
    }
  };

  const config = getStatusConfig(result.status);
  const Icon = config.icon;

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

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all duration-200",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn("h-5 w-5 mt-0.5", config.iconColor)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={cn("text-sm font-medium", config.textColor)}>
              {getCheckTypeLabel(result.check_type)}
            </h4>
            <span className="text-xs text-gray-500">
              {formatDate(result.created_at)}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-2">{result.description}</p>

          {showDetails && (
            <div className="space-y-2">
              {(result.expected_value || result.actual_value) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {result.expected_value && (
                    <div className="bg-white/60 rounded px-2 py-1 border">
                      <span className="font-medium text-gray-600">
                        Expected:
                      </span>
                      <br />
                      <span className="text-gray-800">
                        {result.expected_value}
                      </span>
                    </div>
                  )}
                  {result.actual_value && (
                    <div className="bg-white/60 rounded px-2 py-1 border">
                      <span className="font-medium text-gray-600">Actual:</span>
                      <br />
                      <span className="text-gray-800">
                        {result.actual_value}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {result.details && (
                <div className="text-xs text-gray-600 bg-white/60 rounded px-2 py-1 border">
                  <span className="font-medium">Details:</span> {result.details}
                </div>
              )}

              {result.source_files && result.source_files.length > 0 && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Sources:</span>{" "}
                  {result.source_files.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationResultCard;
