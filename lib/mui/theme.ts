"use client";

import { createTheme } from "@mui/material/styles";

export function createMuiTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#007595",
      },
    },

    typography: {
      fontFamily: "var(--font-sans)",

      h1: {
        fontFamily: "var(--font-heading)",
        fontWeight: 700,
      },

      h2: {
        fontFamily: "var(--font-heading)",
        fontWeight: 700,
      },

      h3: {
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
      },

      h4: {
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: "var(--background)",
            color: "var(--foreground)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            backgroundImage: "none",
            boxShadow: "none",
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },

          contained: {
            background: "var(--primary)",
            color: "var(--primary-foreground)",

            "&:hover": {
              background: "var(--primary)",
              filter: "brightness(.9)",
            },
          },

          outlined: {
            color: "var(--primary)",
            borderColor: "var(--primary)",

            "&:hover": {
              borderColor: "var(--primary)",
              background: "var(--accent)",
            },
          },

          text: {
            color: "var(--foreground)",

            "&:hover": {
              background: "var(--accent)",
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "var(--foreground)",
            transition: "all .2s",

            "& input": {
              color: "var(--foreground)",
            },

            "& textarea": {
              color: "var(--foreground)",
            },

            "& input::placeholder": {
              color: "var(--muted-foreground)",
              opacity: 1,
            },

            "& textarea::placeholder": {
              color: "var(--muted-foreground)",
              opacity: 1,
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--border)",
              transition: "all .2s",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--hover)",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--primary)",
            },

            "& .MuiInputAdornment-root": {
              color: "var(--muted-foreground)",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "var(--muted-foreground)",

            "&.Mui-focused": {
              color: "var(--primary)",
            },
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
          size: "small",
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            color: "var(--foreground)",
          },

          icon: {
            color: "var(--muted-foreground)",
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "var(--muted-foreground)",

            "&.Mui-checked": {
              color: "var(--primary)",
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            color: "var(--muted-foreground)",

            "&.Mui-checked": {
              color: "var(--primary)",
            },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: "var(--primary)",

              "& + .MuiSwitch-track": {
                background: "var(--primary)",
              },
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: "var(--border)",
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            color: "var(--foreground)",
            borderColor: "var(--border)",
          },

          head: {
            fontWeight: 600,
            color: "var(--foreground)",
          },
        },
      },
    },
  });
}
