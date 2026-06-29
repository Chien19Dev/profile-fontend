"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";
import { createMuiTheme } from "./theme";

interface Props {
  children: React.ReactNode;
}

export default function MuiProvider({ children }: Props) {
  const { resolvedTheme } = useTheme();

  const theme = React.useMemo(
    () => createMuiTheme(resolvedTheme === "dark" ? "dark" : "light"),
    [resolvedTheme],
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
