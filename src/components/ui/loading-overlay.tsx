
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { cn } from "@/lib/utils";

export function LoadingOverlay() {
  const { isLoading, stopLoading } = useLoading();
  const [show, setShow] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
      
      // Minimum 3s display. Changed from 3s to 5s as per new req.
      minTimeId = setTimeout(() => {
        // If loading has already finished by the time the minimum display time is up, then hide it.
        if (!isLoading) {
          handleFinishLoading();
        }
      }, 5000);

      // 8s timeout for failure state.
      timeoutId = setTimeout(() => {
        // Only trigger failure if we are *still* loading.
        if (isLoading) {
          setIsTimedOut(true);
          // After showing timeout message for 2s, redirect back.
          setTimeout(() => {
            // Check if still on the same page before going back
            if (isLoading) {
               router.back();
            }
            handleFinishLoading();
          }, 2000);
        }
      }, 8000);

    } else if (show && !minTimeId) {
       // This handles the case where stopLoading() is called before the min display time is up.
       // The logic inside the minTimeId timeout will handle the closing.
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
          <div className="loading-card"></div>
          <div className="loading-text">HP Labs</div>
          <div className="loading-subtext">Initializing protocol...</div>
        </div>
      )}
    </div>
  );
}
