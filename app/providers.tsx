"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import theme, { brandColors } from "@/theme";

type Accent = keyof typeof brandColors;

export const ColorModeContext = createContext({
  toggle: () => {},
  mode: "dark" as "dark" | "light",
  accent: "blue" as Accent,
  setAccent: (() => undefined) as (accent: Accent) => void,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [accent, setAccent] = useState<Accent>("blue");

  const colorMode = useMemo(
    () => ({
      toggle: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
      mode,
      accent,
      setAccent,
    }),
    [mode, accent],
  );

  const themeMode = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode,
          primary: {
            main: brandColors[accent],
            contrastText: brandColors.navy,
          },
          background: {
            default: mode === "dark" ? brandColors.navy : brandColors.gold,
            paper: mode === "dark" ? brandColors.navy : brandColors.gold,
          },
          text: {
            primary: mode === "dark" ? brandColors.gold : brandColors.navy,
            secondary: mode === "dark" ? brandColors.blue : brandColors.navy,
          },
        },
      }),
    [mode, accent],
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
