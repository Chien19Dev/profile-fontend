"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api, ContactMessage, Profile, Project, Skill } from "@/lib/api";
import { brandColors } from "@/theme";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;
type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
};
type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

const profileForm: ProfileForm = {
  fullName: "",
  title: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
};

const projectForm: ProjectForm = {
  title: "",
  description: "",
  image: "",
  githubUrl: "",
  demoUrl: "",
  technologies: [],
  technologiesText: "",
};

const skillForm: SkillForm = {
  name: "",
  category: "",
  icon: "",
  level: 0,
  order: 0,
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [profile, setProfile] = useState(profileForm);
  const [project, setProject] = useState(projectForm);
  const [skill, setSkill] = useState(skillForm);
  const [editingProfileId, setEditingProfileId] = useState("");
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editingSkillId, setEditingSkillId] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const [profileData, projectData, skillData, contactData] =
      await Promise.all([
        api.profiles.list(),
        api.projects.list(),
        api.skills.list(),
        api.contacts.list(),
      ]);

    setProfiles(profileData);
    setProjects(projectData);
    setSkills(skillData);
    setContacts(contactData);
  }

  useEffect(() => {
    Promise.all([
      api.profiles.list(),
      api.projects.list(),
      api.skills.list(),
      api.contacts.list(),
    ]).then(([profileData, projectData, skillData, contactData]) => {
      setProfiles(profileData);
      setProjects(projectData);
      setSkills(skillData);
      setContacts(contactData);
    });
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingProfileId) {
      await api.profiles.update(editingProfileId, profile);
    } else {
      await api.profiles.create(profile);
    }
    setProfile(profileForm);
    setEditingProfileId("");
    setNotice("Profile saved");
    await load();
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...project,
      technologies: project.technologiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    delete (payload as Partial<ProjectForm>).technologiesText;

    if (editingProjectId) {
      await api.projects.update(editingProjectId, payload);
    } else {
      await api.projects.create(payload);
    }
    setProject(projectForm);
    setEditingProjectId("");
    setNotice("Project saved");
    await load();
  }

  async function saveSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...skill,
      level: Number(skill.level || 0),
      order: Number(skill.order || 0),
    };

    if (editingSkillId) {
      await api.skills.update(editingSkillId, payload);
    } else {
      await api.skills.create(payload);
    }
    setSkill(skillForm);
    setEditingSkillId("");
    setNotice("Skill saved");
    await load();
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ justifyContent: "space-between", gap: 2, mb: 3 }}
        >
          <Box>
            <Typography component="h1" sx={{ fontSize: 42, fontWeight: 900 }}>
              Admin
            </Typography>
            <Typography sx={{ color: brandColors.green }}>
              Manage profile content from backend APIs
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            sx={{ alignSelf: { xs: "stretch", md: "center" } }}
          >
            Refresh
          </Button>
        </Stack>

        {notice && (
          <Alert
            icon={<DoneIcon />}
            sx={{
              mb: 3,
              bgcolor: alpha(brandColors.green, 0.18),
              color: brandColors.gold,
              border: `1px solid ${brandColors.green}`,
            }}
          >
            {notice}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AdminPanel title="Profile">
              <Stack component="form" onSubmit={saveProfile} spacing={2}>
                <TextField
                  label="Full name"
                  value={profile.fullName}
                  onChange={(event) =>
                    setProfile({ ...profile, fullName: event.target.value })
                  }
                  required
                />
                <TextField
                  label="Title"
                  value={profile.title}
                  onChange={(event) =>
                    setProfile({ ...profile, title: event.target.value })
                  }
                  required
                />
                <TextField
                  label="Bio"
                  value={profile.bio}
                  onChange={(event) =>
                    setProfile({ ...profile, bio: event.target.value })
                  }
                  required
                  multiline
                  minRows={4}
                />
                {[
                  "avatar",
                  "email",
                  "phone",
                  "location",
                  "githubUrl",
                  "linkedinUrl",
                  "websiteUrl",
                ].map((field) => (
                  <TextField
                    key={field}
                    label={field}
                    value={String(profile[field as keyof ProfileForm] || "")}
                    onChange={(event) =>
                      setProfile({ ...profile, [field]: event.target.value })
                    }
                  />
                ))}
                <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                  {editingProfileId ? "Update profile" : "Create profile"}
                </Button>
              </Stack>

              <ItemList>
                {profiles.map((item) => (
                  <AdminItem key={item.id}>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>
                        {item.fullName}
                      </Typography>
                      <Typography sx={{ color: brandColors.green }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Actions
                      onEdit={() => {
                        setEditingProfileId(item.id);
                        setProfile({ ...profileForm, ...item });
                      }}
                      onDelete={async () => {
                        await api.profiles.remove(item.id);
                        await load();
                      }}
                    />
                  </AdminItem>
                ))}
              </ItemList>
            </AdminPanel>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <AdminPanel title="Projects">
              <Stack component="form" onSubmit={saveProject} spacing={2}>
                <TextField
                  label="Title"
                  value={project.title}
                  onChange={(event) =>
                    setProject({ ...project, title: event.target.value })
                  }
                  required
                />
                <TextField
                  label="Description"
                  value={project.description}
                  onChange={(event) =>
                    setProject({ ...project, description: event.target.value })
                  }
                  required
                  multiline
                  minRows={4}
                />
                <TextField
                  label="Image URL"
                  value={project.image || ""}
                  onChange={(event) =>
                    setProject({ ...project, image: event.target.value })
                  }
                />
                <TextField
                  label="Technologies, comma separated"
                  value={project.technologiesText}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      technologiesText: event.target.value,
                    })
                  }
                />
                <TextField
                  label="Github URL"
                  value={project.githubUrl || ""}
                  onChange={(event) =>
                    setProject({ ...project, githubUrl: event.target.value })
                  }
                />
                <TextField
                  label="Demo URL"
                  value={project.demoUrl || ""}
                  onChange={(event) =>
                    setProject({ ...project, demoUrl: event.target.value })
                  }
                />
                <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                  {editingProjectId ? "Update project" : "Create project"}
                </Button>
              </Stack>

              <ItemList>
                {projects.map((item) => (
                  <AdminItem key={item.id}>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>
                        {item.title}
                      </Typography>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                        {(item.technologies || []).map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                    </Box>
                    <Actions
                      onEdit={() => {
                        setEditingProjectId(item.id);
                        setProject({
                          ...projectForm,
                          ...item,
                          technologiesText: (item.technologies || []).join(", "),
                        });
                      }}
                      onDelete={async () => {
                        await api.projects.remove(item.id);
                        await load();
                      }}
                    />
                  </AdminItem>
                ))}
              </ItemList>
            </AdminPanel>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <AdminPanel title="Skills">
              <Stack component="form" onSubmit={saveSkill} spacing={2}>
                <TextField
                  label="Name"
                  value={skill.name}
                  onChange={(event) =>
                    setSkill({ ...skill, name: event.target.value })
                  }
                  required
                />
                <TextField
                  label="Category"
                  value={skill.category || ""}
                  onChange={(event) =>
                    setSkill({ ...skill, category: event.target.value })
                  }
                />
                <TextField
                  label="Icon"
                  value={skill.icon || ""}
                  onChange={(event) =>
                    setSkill({ ...skill, icon: event.target.value })
                  }
                />
                <TextField
                  label="Level"
                  type="number"
                  value={skill.level || 0}
                  onChange={(event) =>
                    setSkill({ ...skill, level: Number(event.target.value) })
                  }
                />
                <TextField
                  label="Order"
                  type="number"
                  value={skill.order || 0}
                  onChange={(event) =>
                    setSkill({ ...skill, order: Number(event.target.value) })
                  }
                />
                <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                  {editingSkillId ? "Update skill" : "Create skill"}
                </Button>
              </Stack>

              <ItemList>
                {skills.map((item) => (
                  <AdminItem key={item.id}>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: brandColors.green }}>
                        {item.category || "Skill"} {item.level || 0}%
                      </Typography>
                    </Box>
                    <Actions
                      onEdit={() => {
                        setEditingSkillId(item.id);
                        setSkill({ ...skillForm, ...item });
                      }}
                      onDelete={async () => {
                        await api.skills.remove(item.id);
                        await load();
                      }}
                    />
                  </AdminItem>
                ))}
              </ItemList>
            </AdminPanel>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <AdminPanel title="Contact messages">
              <Grid container spacing={2}>
                {contacts.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        border: `1px solid ${
                          item.isRead ? brandColors.green : brandColors.orange
                        }`,
                        bgcolor: alpha(brandColors.navy, 0.72),
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", gap: 1 }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 900 }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ color: brandColors.green }}>
                              {item.email}
                            </Typography>
                          </Box>
                          <Chip
                            label={item.isRead ? "Read" : "New"}
                            size="small"
                            sx={{
                              bgcolor: item.isRead
                                ? alpha(brandColors.green, 0.2)
                                : alpha(brandColors.orange, 0.2),
                              border: `1px solid ${
                                item.isRead
                                  ? brandColors.green
                                  : brandColors.orange
                              }`,
                            }}
                          />
                        </Stack>
                        <Typography sx={{ fontWeight: 800 }}>
                          {item.subject || "No subject"}
                        </Typography>
                        <Typography>{item.message}</Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            startIcon={<MarkEmailReadIcon />}
                            onClick={async () => {
                              await api.contacts.update(item.id, {
                                isRead: true,
                              });
                              await load();
                            }}
                          >
                            Mark read
                          </Button>
                          <IconButton
                            onClick={async () => {
                              await api.contacts.remove(item.id);
                              await load();
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AdminPanel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function AdminPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        height: "100%",
        p: 3,
        border: `1px solid ${brandColors.blue}`,
        bgcolor: alpha(brandColors.navy, 0.84),
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function ItemList({ children }: { children: React.ReactNode }) {
  return (
    <Stack spacing={1.5} sx={{ mt: 3 }}>
      <Divider sx={{ borderColor: brandColors.blue }} />
      {children}
    </Stack>
  );
}

function AdminItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        p: 2,
        border: `1px solid ${alpha(brandColors.gold, 0.6)}`,
        bgcolor: alpha(brandColors.navy, 0.68),
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

function Actions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton onClick={onEdit}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
