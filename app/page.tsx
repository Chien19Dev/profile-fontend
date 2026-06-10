"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import SendIcon from "@mui/icons-material/Send";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import { api, Profile, Project, Skill } from "@/lib/api";
import { brandColors } from "@/theme";

const MotionBox = motion(Box);

const emptyContact = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contact, setContact] = useState(emptyContact);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const initials = useMemo(() => {
    const name = profile?.fullName || "My Profile";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile]);

  useEffect(() => {
    Promise.all([api.profiles.current(), api.projects.list(), api.skills.list()])
      .then(([profileData, projectData, skillData]) => {
        setProfile(profileData);
        setProjects(projectData);
        setSkills(skillData);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice("");

    try {
      await api.contacts.create(contact);
      setContact(emptyContact);
      setNotice("Message sent");
    } finally {
      setSending(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage: `linear-gradient(135deg, ${alpha(
          brandColors.blue,
          0.22,
        )}, ${alpha(brandColors.navy, 0.94)} 42%, ${alpha(
          brandColors.orange,
          0.18,
        )})`,
      }}
    >
      {loading && <LinearProgress />}

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                height: "100%",
                p: { xs: 3, md: 4 },
                border: `1px solid ${alpha(brandColors.blue, 0.7)}`,
                bgcolor: alpha(brandColors.navy, 0.86),
              }}
            >
              <Stack spacing={3}>
                <Avatar
                  src={profile?.avatar || undefined}
                  sx={{
                    width: 118,
                    height: 118,
                    bgcolor: "primary.main",
                    color: brandColors.navy,
                    fontSize: 38,
                    fontWeight: 900,
                    border: `3px solid ${brandColors.gold}`,
                  }}
                >
                  {initials}
                </Avatar>

                <Box>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: 38, md: 58 },
                      lineHeight: 1,
                      fontWeight: 900,
                    }}
                  >
                    {profile?.fullName || "Your profile"}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: brandColors.green,
                      fontSize: { xs: 18, md: 22 },
                      fontWeight: 800,
                    }}
                  >
                    {profile?.title || "Fullstack Developer"}
                  </Typography>
                </Box>

                <Typography sx={{ color: brandColors.gold, lineHeight: 1.8 }}>
                  {profile?.bio ||
                    "Create your profile in Admin to show your bio here."}
                </Typography>

                <Stack direction="row" spacing={1}>
                  {profile?.githubUrl && (
                    <IconButton href={profile.githubUrl} target="_blank">
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {profile?.linkedinUrl && (
                    <IconButton href={profile.linkedinUrl} target="_blank">
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {profile?.websiteUrl && (
                    <IconButton href={profile.websiteUrl} target="_blank">
                      <LanguageIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </MotionBox>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  border: `1px solid ${alpha(brandColors.green, 0.7)}`,
                  bgcolor: alpha(brandColors.navy, 0.78),
                }}
              >
                <Typography sx={{ fontSize: 14, color: brandColors.green }}>
                  Skills
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {skills.length === 0 && <Chip label="No skills yet" />}
                  {skills.map((skill) => (
                    <Chip
                      key={skill.id}
                      label={
                        skill.level
                          ? `${skill.name} ${skill.level}%`
                          : skill.name
                      }
                      sx={{
                        bgcolor: alpha(brandColors.blue, 0.22),
                        color: brandColors.gold,
                        border: `1px solid ${brandColors.blue}`,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box
                component="form"
                onSubmit={submitContact}
                sx={{
                  p: { xs: 3, md: 4 },
                  border: `1px solid ${alpha(brandColors.orange, 0.8)}`,
                  bgcolor: alpha(brandColors.navy, 0.78),
                }}
              >
                <Typography
                  component="h2"
                  sx={{ fontSize: 28, fontWeight: 900, mb: 2 }}
                >
                  Contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Name"
                      value={contact.name}
                      onChange={(event) =>
                        setContact({ ...contact, name: event.target.value })
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(event) =>
                        setContact({ ...contact, email: event.target.value })
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Subject"
                      value={contact.subject}
                      onChange={(event) =>
                        setContact({ ...contact, subject: event.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Message"
                      value={contact.message}
                      onChange={(event) =>
                        setContact({ ...contact, message: event.target.value })
                      }
                      required
                      multiline
                      minRows={4}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={
                      sending ? <CircularProgress size={16} /> : <SendIcon />
                    }
                    disabled={sending}
                  >
                    Send
                  </Button>
                  {notice && <Alert severity="success">{notice}</Alert>}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography
            component="h2"
            sx={{ fontSize: { xs: 32, md: 46 }, fontWeight: 900, mb: 2 }}
          >
            Projects
          </Typography>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, md: 4 }}>
                <MotionBox
                  whileHover={{ y: -4 }}
                  sx={{
                    height: "100%",
                    p: 3,
                    border: `1px solid ${brandColors.blue}`,
                    bgcolor: alpha(brandColors.navy, 0.82),
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        aspectRatio: "16 / 9",
                        bgcolor: alpha(brandColors.orange, 0.28),
                        border: `1px solid ${brandColors.orange}`,
                        backgroundImage: project.image
                          ? `url(${project.image})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                      {project.title}
                    </Typography>
                    <Typography sx={{ lineHeight: 1.7 }}>
                      {project.description}
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                      {(project.technologies || []).map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {project.demoUrl && (
                        <Button
                          href={project.demoUrl}
                          target="_blank"
                          endIcon={<OpenInNewIcon />}
                        >
                          Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          href={project.githubUrl}
                          target="_blank"
                          endIcon={<GitHubIcon />}
                        >
                          Code
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
