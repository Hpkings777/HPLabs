
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { cn } from "@/lib/utils";

const engagingTexts = [
  "Reticulating splines...",
  "Calibrating quantum flux...",
  "Buffering neural network...",
  "Polishing pixels...",
  "Defragmenting reality...",
  "Warming up the AI...",
  "Unscrambling protons...",
  "Generating witty loading text..."
];

export function LoadingOverlay() {
  const { isLoading, stopLoading } = useLoading();
  const [show, setShow] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [subtext, setSubtext] = useState("");
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
        // If loading has already finished by the time the minimum display time is up, then hide it.
        if (!isLoading) {
          handleFinishLoading();
        }
      }, 3000);

      // 8s timeout for failure state. Only triggers if still loading.
      timeoutId = setTimeout(() => {
        if (isLoading) { // Check if we are still in a loading state
          setIsTimedOut(true);
          // After showing timeout message, redirect
          setTimeout(() => {
            router.back();
            handleFinishLoading();
          }, 2000);
        }
      }, 8000);

    } else if(show) {
       // If stopLoading() is called before 3s, wait for minTime to finish
       // The logic inside the minTimeId timeout will handle the closing.
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (minTimeId) clearTimeout(minTimeId);
    };
  }, [isLoading, show, handleFinishLoading, router]);

  useEffect(() => {
    if (show && !isTimedOut) {
      const textInterval = setInterval(() => {
        setSubtext(engagingTexts[Math.floor(Math.random() * engagingTexts.length)]);
      }, 2000);
      setSubtext(engagingTexts[Math.floor(Math.random() * engagingTexts.length)]);
      return () => clearInterval(textInterval);
    }
  }, [show, isTimedOut]);


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
          <div className="loading-subtext">{subtext}</div>
        </div>
      )}
    </div>
  );
}
