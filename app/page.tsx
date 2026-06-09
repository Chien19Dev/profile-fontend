"use client";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
const MotionBox = motion(Box);

const skills = [
  "Next.js",
  "React",
  "Node.js",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Redux",
  "Prisma",
];

const projects = [
  {
    title: "Elysia Wear",
    desc: "Full-stack fashion e-commerce với Next.js App Router, admin dashboard và tích hợp thanh toán.",
    tags: ["Next.js", "TypeScript", "MUI"],
    accent: "#4f46e5",
  },
  {
    title: "Portfolio UI",
    desc: "Portfolio cá nhân với MUI v9, Framer Motion animations và dark-mode system.",
    tags: ["MUI v9", "Framer Motion", "TypeScript"],
    accent: "#9c27b0",
  },
  {
    title: "Chat App",
    desc: "Real-time messaging với Socket.io, JWT auth và lịch sử tin nhắn persistent.",
    tags: ["Socket.io", "Node.js", "React"],
    accent: "#0ea5e9",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.42, 0, 0.58, 1], // valid cubic-bezier easing
    },
  }),
};

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflowX: "hidden",
      }}
    >
      {/* ── Aurora background blobs ── */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <MotionBox
          animate={{ x: [0, 40, 0], y: [0, -28, 0] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: "-5%",
            left: "-8%",
            width: 640,
            height: 640,
            borderRadius: "50%",
            filter: "blur(72px)",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 70%)",
          }}
        />
        <MotionBox
          animate={{ x: [0, -26, 0], y: [0, 36, 0] }}
          transition={{ repeat: Infinity, duration: 17, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: "28%",
            right: "-8%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            filter: "blur(72px)",
            background:
              "radial-gradient(circle, rgba(156,39,176,0.22) 0%, transparent 70%)",
          }}
        />
        <MotionBox
          animate={{ x: [0, 18, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            bottom: "6%",
            left: "20%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            filter: "blur(72px)",
            background:
              "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)",
          }}
        />
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
          }}
        >
          <MotionBox
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            sx={{ position: "relative", display: "inline-flex", mb: 4 }}
          >
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              sx={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #4f46e5, #9c27b0, #0ea5e9, #4f46e5)",
              }}
            />
            <Avatar
              sx={{
                width: 120,
                height: 120,
                position: "relative",
                zIndex: 1,
                background: "linear-gradient(135deg, #4f46e5, #9c27b0)",
                boxShadow: "0 0 0 3px #0b0b12", // gap màu bg tạo hiệu ứng ring
                fontSize: 44,
                fontWeight: 800,
              }}
            >
              C
            </Avatar>
          </MotionBox>

          {/* Available badge */}
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            sx={{ mb: 2 }}
          >
            <Chip
              label="● Available for work"
              size="small"
              sx={{
                bgcolor: "rgba(34,197,94,0.08)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.28)",
                fontWeight: 500,
                fontSize: 12,
              }}
            />
          </MotionBox>

          {/* Name */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 34, md: 58 },
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                mb: 1.5,
                background:
                  "linear-gradient(135deg, #ffffff 25%, rgba(255,255,255,0.5))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nguyễn Đình Chiến
            </Typography>
          </MotionBox>

          {/* Role */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            sx={{ mb: 4 }}
          >
            <Typography
              sx={{
                fontSize: { xs: 15, md: 17 },
                fontWeight: 500,
                background: "linear-gradient(90deg, #818cf8, #c084fc)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fullstack Developer — Next.js · Node.js · UI Lover
            </Typography>
          </MotionBox>

          {/* Social + CTA */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", mb: 3 }}
            >
              {[
                { icon: <GitHubIcon />, label: "GitHub" },
                { icon: <FacebookIcon />, label: "Facebook" },
                { icon: <LinkedInIcon />, label: "LinkedIn" },
              ].map(({ icon, label }) => (
                <IconButton
                  key={label}
                  aria-label={label}
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.22s ease",
                    "&:hover": {
                      color: "white",
                      borderColor: "#4f46e5",
                      bgcolor: "rgba(79,70,229,0.14)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "center" }}
            >
              <Button
                variant="contained"
                sx={{
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  background: "linear-gradient(135deg, #4f46e5, #9c27b0)",
                  boxShadow: "0 0 28px rgba(79,70,229,0.38)",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    boxShadow: "0 0 48px rgba(79,70,229,0.6)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Contact me
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 600,
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    borderColor: "#818cf8",
                    bgcolor: "rgba(79,70,229,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Download CV
              </Button>
            </Stack>
          </MotionBox>
        </Box>
        <Box sx={{ maxWidth: 860, mx: "auto", px: 3, pb: 10 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
              mb: 2,
            }}
          >
            Tech stack
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {skills.map((skill, i) => (
              <MotionBox
                key={skill}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Chip
                  label={skill}
                  sx={{
                    bgcolor: "rgba(79,70,229,0.08)",
                    border: "1px solid rgba(79,70,229,0.22)",
                    color: "rgba(255,255,255,0.68)",
                    fontSize: 13,
                    fontWeight: 500,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(79,70,229,0.18)",
                      borderColor: "#818cf8",
                      color: "#fff",
                    },
                  }}
                />
              </MotionBox>
            ))}
          </Stack>
        </Box>
        <Box sx={{ maxWidth: 860, mx: "auto", px: 3, pb: 16 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
              mb: 0.5,
            }}
          >
            Selected work
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 28, md: 42 },
              letterSpacing: "-0.02em",
              mb: 5,
              background:
                "linear-gradient(135deg, #ffffff, rgba(255,255,255,0.6))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Projects
          </Typography>
          <Stack spacing={2.5}>
            {projects.map((p, i) => (
              <MotionBox
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -3 }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  bgcolor: "background.paper",
                  backdropFilter: "blur(16px)",
                  cursor: "pointer",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${p.accent}, transparent)`,
                  },
                  "&:hover": {
                    borderColor: `${p.accent}50`,
                    boxShadow: `0 8px 40px ${p.accent}18`,
                  },
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{
                    alignItems: { sm: "flex-start" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: 19, mb: 0.75 }}
                    >
                      {p.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        mb: 2,
                      }}
                    >
                      {p.desc}
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                      {p.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: `${p.accent}14`,
                            border: `1px solid ${p.accent}38`,
                            color: `${p.accent}`,
                            fontSize: 11,
                            fontWeight: 600,
                            height: 22,
                            filter: "brightness(1.5)",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      color: "rgba(255,255,255,0.25)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      flexShrink: 0,
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "white",
                        borderColor: "rgba(255,255,255,0.38)",
                      },
                    }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </MotionBox>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
