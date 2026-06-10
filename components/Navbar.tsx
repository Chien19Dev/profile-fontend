"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PaletteIcon from "@mui/icons-material/Palette";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import { useContext, useState } from "react";
import { ColorModeContext } from "@/app/providers";
import { brandColors } from "@/theme";
import Link from "next/link";

export default function Navbar() {
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: `1px solid ${brandColors.blue}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 28 } }}>
          My Portfolio
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Home
          </Button>
          {/* <Button
            component={Link}
            href="/admin"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Admin
          </Button> */}
          <Tooltip title="Theme">
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <PaletteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle mode">
            <IconButton onClick={colorMode.toggle}>
              {colorMode.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {Object.entries(brandColors).map(([name, color]) => (
          <MenuItem
            key={name}
            onClick={() => {
              colorMode.setAccent(name as keyof typeof brandColors);
              setAnchorEl(null);
            }}
            selected={colorMode.accent === name}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                bgcolor: color,
                border: `1px solid ${brandColors.navy}`,
                mr: 1,
              }}
            />
            {name}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
