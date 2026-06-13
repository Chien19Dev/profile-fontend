"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { usePageViewTracker } from "@/hooks/use-page-view-tracker";

function PageViewTracker({ children }: { children: React.ReactNode }) {
  usePageViewTracker();
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <PageViewTracker>{children}</PageViewTracker>
    </ThemeProvider>
  );
}
