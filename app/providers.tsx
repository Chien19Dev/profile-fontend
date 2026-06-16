"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { usePageViewTracker } from "@/hooks/use-page-view-tracker";
import { Fragment } from "react/jsx-runtime";

function PageViewTracker({ children }: { children: React.ReactNode }) {
  usePageViewTracker();
  return <Fragment>{children}</Fragment>;
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
