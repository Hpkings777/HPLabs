
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function InitialLoader() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4500); // Start fade-out 0.5s before animation ends

    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div className={cn("initial-loader-container", isFadingOut && "fade-out")}>
      <div className="loader-card">
        <svg
          className="loader-card-outline"
          viewBox="0 0 450 250"
          preserveAspectRatio="none"
        >
          <rect
            width="448"
            height="248"
            x="1"
            y="1"
            rx="11"
            ry="11"
          />
        </svg>

        <div className="loader-text">HP Labs</div>
        
        <div className="loader-edge left"></div>
        <div className="loader-edge right"></div>
      </div>
    </div>
  );
}
