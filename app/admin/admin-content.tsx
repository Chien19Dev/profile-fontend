"use client";

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { CategoriesSection } from "@/components/admin/categories-section";
import { NavigationSection } from "@/components/admin/navigation-section";
import { NotificationBell } from "@/components/admin/notification-bell";
import { Sidebar } from "@/components/admin/sidebar";
import { WorkspaceHeader } from "@/components/admin/workspace-header";
import { ContactsSection } from "@/components/sections/admin/admin-contacts-section";
import { ProfilesSection } from "@/components/sections/admin/admin-profiles-section";
import { ProjectsSection } from "@/components/sections/admin/admin-projects-section";
import { SkillsSection } from "@/components/sections/admin/admin-skills-section";
import { AdminTestimonialsSection } from "@/components/sections/admin/admin-testimonials-section";
import { UsersSection } from "@/components/sections/admin/admin-users-section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { alertError, alertSuccess } from "@/lib/alerts";
import {
  api,
  ContactMessage,
  Profile,
  Project,
  Skill,
  Testimonial,
  User,
} from "@/lib/api";
import { Section } from "@/types/types";
import { RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;
type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
  images: string[];
};
type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;
type TestimonialForm = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

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
  twitterUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  websiteUrl: "",
};
const emptyProject: ProjectForm = {
  title: "",
  description: "",
  images: [],
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
const emptyTestimonial: TestimonialForm = {
  authorName: "",
  authorTitle: "",
  content: "",
  avatar: "",
  order: 0,
};

export default function AdminPage() {
  const [section, setSection] = useState<Section>("profiles");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [postCount, setPostCount] = useState(0);

  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [project, setProject] = useState<ProjectForm>(emptyProject);
  const [skill, setSkill] = useState<SkillForm>(emptySkill);
  const [testimonial, setTestimonial] =
    useState<TestimonialForm>(emptyTestimonial);
  const [imageUploading, setImageUploading] = useState(false);

  const [editingProfileId, setEditingProfileId] = useState("");
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editingSkillId, setEditingSkillId] = useState("");
  const [editingTestimonialId, setEditingTestimonialId] = useState("");

  async function load() {
    const results = await Promise.allSettled([
      api.profiles.list(),
      api.projects.list(),
      api.skills.list(),
      api.testimonials.list(),
      api.contacts.list(),
      api.posts.list(),
      api.users.list(),
    ]);
    if (results[0].status === "fulfilled") setProfiles(results[0].value);
    if (results[1].status === "fulfilled") setProjects(results[1].value);
    if (results[2].status === "fulfilled") setSkills(results[2].value);
    if (results[3].status === "fulfilled") setTestimonials(results[3].value);
    if (results[4].status === "fulfilled") setContacts(results[4].value);
    if (results[5].status === "fulfilled")
      setPostCount(results[5].value.length);
    if (results[6].status === "fulfilled") setUsers(results[6].value);
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

    if (imageUploading) {
      alertError("Đang tải ảnh lên, vui lòng đợi...");
      return;
    }

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

  async function saveTestimonial(e: FormEvent) {
    e.preventDefault();

    if (imageUploading) {
      alertError("Đang tải ảnh lên, vui lòng đợi...");
      return;
    }

    const payload = {
      ...testimonial,
      order: Number(testimonial.order || 0),
    };

    try {
      if (editingTestimonialId) {
        await api.testimonials.update(editingTestimonialId, payload);
        alertSuccess("Đã cập nhật đánh giá");
      } else {
        await api.testimonials.create(payload);
        alertSuccess("Đã thêm đánh giá");
      }
      setTestimonial(emptyTestimonial);
      setEditingTestimonialId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu đánh giá");
    }
  }

  const newUnread = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6 max-w-340">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Label className="deco-eyebrow mb-1.5">Bảng điều khiển</Label>
            <Label className="deco-title text-4xl md:text-3xl text-foreground">
              Quản trị
            </Label>
          </div>
          <div className="flex items-center gap-2 flex-cols">
            <Button
              variant="default"
              size="lg"
              onClick={load}
              className="rounded-xs"
            >
              <RefreshCw className="size-3.5" />
              Làm mới
            </Button>
            <NotificationBell />
          </div>
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
              testimonials: testimonials.length,
              unread: newUnread,
              posts: postCount,
              categories: 0,
              users: users.length,
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
                    images: (item as any).images || [],
                    technologiesText: (item.technologies || []).join(", "),
                  } as ProjectForm);
                }}
                onReload={load}
                emptyForm={emptyProject}
                setEditingId={setEditingProjectId}
                onImageUploadingChange={setImageUploading}
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
            {section === "testimonials" && (
              <AdminTestimonialsSection
                testimonials={testimonials}
                form={testimonial}
                editingId={editingTestimonialId}
                onChange={setTestimonial}
                onSubmit={saveTestimonial}
                onEdit={(item) => {
                  setEditingTestimonialId(item.id);
                  setTestimonial({ ...emptyTestimonial, ...item });
                }}
                onReload={load}
                emptyForm={emptyTestimonial}
                setEditingId={setEditingTestimonialId}
                onImageUploadingChange={setImageUploading}
              />
            )}
            {section === "contacts" && (
              <ContactsSection contacts={contacts} onReload={load} />
            )}
            {section === "categories" && <CategoriesSection />}
            {section === "navigation" && <NavigationSection />}
            {section === "analytics" && <AnalyticsDashboard />}
            {section === "users" && (
              <UsersSection users={users} onReload={load} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
