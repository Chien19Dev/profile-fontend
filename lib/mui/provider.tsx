"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";
import { createMuiTheme } from "./theme";

interface MuiProviderProps {
  children: React.ReactNode;
}

export default function MuiProvider({ children }: MuiProviderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const theme = React.useMemo(
    () =>
      createMuiTheme(
        mounted ? (resolvedTheme === "dark" ? "dark" : "light") : "dark",
      ),
    [mounted, resolvedTheme],
  );
  if (!mounted) {
    return null;
  }

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
