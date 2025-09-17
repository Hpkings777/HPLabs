
"use client";
import "../../app/loading.css";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  isFullScreen?: boolean;
};

export function LoadingSpinner({ isFullScreen = false }: LoadingSpinnerProps) {
  if (isFullScreen) {
    return (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner-container">
          <div className="pulse-wave"></div>
          <div className="pulse-wave"></div>
          <div className="pulse-wave"></div>
          <div className="ring-particle"></div>
          <span className="loading-text">HP Labs</span>
        </div>
      </div>
    );
  }

  return <div className="compact-spinner" />;
}
