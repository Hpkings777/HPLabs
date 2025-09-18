
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { cn } from "@/lib/utils";

export function LoadingOverlay() {
  const { isLoading, stopLoading } = useLoading();
  const [show, setShow] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const router = useRouter();

  const handleFinishLoading = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      stopLoading();
      setShow(false);
      setIsFadingOut(false);
      setIsTimedOut(false);
    }, 500); // Corresponds to fadeOut animation
  }, [stopLoading]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let minTimeId: NodeJS.Timeout | null = null;

    if (isLoading) {
      setShow(true);

      // Minimum 3s display
      minTimeId = setTimeout(() => {
        if (!isLoading) {
          handleFinishLoading();
        }
      }, 3000);

      // 8s timeout for failure
      timeoutId = setTimeout(() => {
        setIsTimedOut(true);
        // After showing timeout message, redirect
        setTimeout(() => {
          router.back();
          handleFinishLoading();
        }, 2000);
      }, 8000);

    } else if(show) {
       // If stopLoading() is called before 3s, wait for minTime to finish
       if(!minTimeId) {
          handleFinishLoading();
       }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (minTimeId) clearTimeout(minTimeId);
    };
  }, [isLoading, show, handleFinishLoading, router]);

  if (!show) {
    return null;
  }

  return (
    <div className={cn("loading-overlay", isFadingOut && "fade-out")}>
      {isTimedOut ? (
        <div className="relative">
            <div className="crack-effect"></div>
            <div className="timeout-message">
                <h2 className="text-2xl font-bold mb-2">Experiment Failed</h2>
                <p>Returning to last lab station...</p>
            </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-rectangle"></div>
          <div className="scan-bar"></div>
          <div className="loading-text">HP Labs</div>
        </div>
      )}
    </div>
  );
}
