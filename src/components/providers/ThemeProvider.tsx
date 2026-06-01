"use client";

import { useEffect } from "react";

/**
 * ThemeProvider — reads localStorage for theme preference on mount and applies
 * the `dark` class to <html>. Defaults to dark on first visit.
 *
 * Note: An inline script in layout.tsx prevents FOUC by applying the class
 * before React hydration. This component keeps the class in sync after mount.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("medivantage:theme");
      if (stored === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // Default to dark on first visit (stored === null) or when stored === 'dark'
        document.documentElement.classList.add("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return <>{children}</>;
}
