import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
}) => {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "pass":
      case "completed":
      case "success":
        return {
          icon: CheckCircle,
          classes: "bg-success-100 text-success-800 border-success-200",
          label: status.toUpperCase(),
        };
      case "warning":
      case "processing":
        return {
          icon: AlertTriangle,
          classes: "bg-warning-100 text-warning-800 border-warning-200",
          label: status.toUpperCase(),
        };
      case "fail":
      case "failed":
      case "error":
        return {
          icon: XCircle,
          classes: "bg-danger-100 text-danger-800 border-danger-200",
          label: status.toUpperCase(),
        };
      case "pending":
      case "uploading":
        return {
          icon: Clock,
          classes: "bg-gray-100 text-gray-800 border-gray-200",
          label: status.toUpperCase(),
        };
      case "analyzing":
      case "validating":
        return {
          icon: Loader,
          classes: "bg-primary-100 text-primary-800 border-primary-200",
          label: status.toUpperCase(),
        };
      default:
        return {
          icon: Clock,
          classes: "bg-gray-100 text-gray-800 border-gray-200",
          label: status.toUpperCase(),
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.classes,
        sizeClasses[size]
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            iconSizes[size],
            "mr-1.5",
            config.icon === Loader && "animate-spin"
          )}
        />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
