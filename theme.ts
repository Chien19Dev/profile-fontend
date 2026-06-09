import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4f46e5",
    },
    background: {
      default: "#0b0b12",
      paper: "#111827",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
