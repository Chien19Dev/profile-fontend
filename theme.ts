import { createTheme } from "@mui/material/styles";

export const brandColors = {
  blue: "#0080ff",
  green: "#39ff14",
  navy: "#0a0e27",
  gold: "#ffd700",
  orange: "#ff6b35",
} as const;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: brandColors.blue,
      contrastText: brandColors.navy,
    },
    secondary: {
      main: brandColors.green,
      contrastText: brandColors.navy,
    },
    warning: {
      main: brandColors.gold,
      contrastText: brandColors.navy,
    },
    error: {
      main: brandColors.orange,
      contrastText: brandColors.navy,
    },
    background: {
      default: brandColors.navy,
      paper: brandColors.navy,
    },
    text: {
      primary: brandColors.gold,
      secondary: brandColors.blue,
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
});

export default theme;
