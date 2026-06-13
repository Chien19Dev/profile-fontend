"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return; // Don't track admin pages

    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch {
        // Silently fail
      }
    };

    // Debounce to avoid tracking rapid navigations
    const timer = setTimeout(trackPageView, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);
}
