"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import theme from "@/theme";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export const ColorModeContext = createContext({
  toggle: () => {},
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const colorMode = useMemo(
    () => ({
      toggle: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [],
  );

  const themeMode = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={themeMode}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
