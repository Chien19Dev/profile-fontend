"use client";

import { FormEvent, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { api, ContactMessage, Profile, Project, Skill } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { Button } from "@/components/ui/button";
import { Section } from "@/types/types";
import { Sidebar } from "@/components/admin/sidebar";
import { WorkspaceHeader } from "@/components/admin/workspace-header";
import { ProfilesSection } from "@/components/sections/profiles-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactsSection } from "@/components/sections/contacts-section";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;
type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
};
type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

const emptyProfile: ProfileForm = {
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
const emptyProject: ProjectForm = {
  title: "",
  description: "",
  image: "",
  githubUrl: "",
  demoUrl: "",
  technologies: [],
  technologiesText: "",
};
const emptySkill: SkillForm = {
  name: "",
  category: "",
  icon: "",
  level: 0,
  order: 0,
};

export default function AdminPage() {
  const [section, setSection] = useState<Section>("profiles");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [project, setProject] = useState<ProjectForm>(emptyProject);
  const [skill, setSkill] = useState<SkillForm>(emptySkill);

  const [editingProfileId, setEditingProfileId] = useState("");
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editingSkillId, setEditingSkillId] = useState("");

  async function load() {
    const [p, pr, s, c] = await Promise.all([
      api.profiles.list(),
      api.projects.list(),
      api.skills.list(),
      api.contacts.list(),
    ]);
    setProfiles(p);
    setProjects(pr);
    setSkills(s);
    setContacts(c);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingProfileId) {
        await api.profiles.update(editingProfileId, profile);
        alertSuccess("Đã cập nhật hồ sơ");
      } else {
        await api.profiles.create(profile);
        alertSuccess("Đã tạo hồ sơ");
      }
      setProfile(emptyProfile);
      setEditingProfileId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu hồ sơ");
    }
  }

  async function saveProject(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...project,
      technologies: project.technologiesText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    delete (payload as Partial<ProjectForm>).technologiesText;
    try {
      if (editingProjectId) {
        await api.projects.update(editingProjectId, payload);
        alertSuccess("Đã cập nhật dự án");
      } else {
        await api.projects.create(payload);
        alertSuccess("Đã tạo dự án");
      }
      setProject(emptyProject);
      setEditingProjectId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu dự án");
    }
  }

  async function saveSkill(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...skill,
      level: Number(skill.level || 0),
      order: Number(skill.order || 0),
    };
    try {
      if (editingSkillId) {
        await api.skills.update(editingSkillId, payload);
        alertSuccess("Đã cập nhật kỹ năng");
      } else {
        await api.skills.create(payload);
        alertSuccess("Đã tạo kỹ năng");
      }
      setSkill(emptySkill);
      setEditingSkillId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu kỹ năng");
    }
  }

  const newUnread = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="deco-eyebrow mb-1.5">Bảng điều khiển</p>
            <h1 className="deco-title text-4xl md:text-5xl text-foreground">
              Quản trị
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="size-3.5" />
            Làm mới
          </Button>
        </div>

        <div
          className="flex gap-0 border border-border overflow-hidden"
          style={{ minHeight: "calc(100vh - 220px)" }}
        >
          <Sidebar
            section={section}
            onSection={setSection}
            counts={{
              profiles: profiles.length,
              projects: projects.length,
              skills: skills.length,
              unread: newUnread,
            }}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <WorkspaceHeader section={section} />

            {section === "profiles" && (
              <ProfilesSection
                profiles={profiles}
                form={profile}
                editingId={editingProfileId}
                onChange={setProfile}
                onSubmit={saveProfile}
                onEdit={(item) => {
                  setEditingProfileId(item.id);
                  setProfile({ ...emptyProfile, ...item });
                }}
                onReload={load}
                emptyForm={emptyProfile}
                setEditingId={setEditingProfileId}
              />
            )}
            {section === "projects" && (
              <ProjectsSection
                projects={projects}
                form={project}
                editingId={editingProjectId}
                onChange={setProject}
                onSubmit={saveProject}
                onEdit={(item) => {
                  setEditingProjectId(item.id);
                  setProject({
                    ...emptyProject,
                    ...item,
                    technologiesText: (item.technologies || []).join(", "),
                  });
                }}
                onReload={load}
                emptyForm={emptyProject}
                setEditingId={setEditingProjectId}
              />
            )}
            {section === "skills" && (
              <SkillsSection
                skills={skills}
                form={skill}
                editingId={editingSkillId}
                onChange={setSkill}
                onSubmit={saveSkill}
                onEdit={(item) => {
                  setEditingSkillId(item.id);
                  setSkill({ ...emptySkill, ...item });
                }}
                onReload={load}
                emptyForm={emptySkill}
                setEditingId={setEditingSkillId}
              />
            )}
            {section === "contacts" && (
              <ContactsSection contacts={contacts} onReload={load} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
