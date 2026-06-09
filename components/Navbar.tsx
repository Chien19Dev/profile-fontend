"use client";

import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useContext } from "react";
import { ColorModeContext } from "@/app/providers";

export default function Navbar({ mode }: { mode: string }) {
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar position="sticky" sx={{ backdropFilter: "blur(10px)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 28 }}>
          My Portfolio
        </Typography>

        <Box>
          <IconButton onClick={colorMode.toggle}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
