"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function usePageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
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
      }
    };
    const timer = setTimeout(trackPageView, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);
}
