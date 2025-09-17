"use client";
import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 px-4 md:px-6 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        &copy; {year} HP Labs. All Rights Reserved.
      </div>
    </footer>
  );
}
