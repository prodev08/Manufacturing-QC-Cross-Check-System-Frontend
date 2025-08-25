import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  status?: "success" | "warning" | "danger" | "primary";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = "primary",
  size = "md",
  showLabel = true,
  animated = false,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const statusClasses = {
    primary: "bg-primary-600",
    success: "bg-success-600",
    warning: "bg-warning-500",
    danger: "bg-danger-600",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{clampedProgress}%</span>
        </div>
      )}

      <div className={cn("w-full bg-gray-200 rounded-full", sizeClasses[size])}>
        <div
          className={cn(
            "rounded-full transition-all duration-300 ease-in-out",
            statusClasses[status],
            animated && "animate-pulse",
            sizeClasses[size]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
