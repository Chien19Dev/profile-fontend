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
import { AdminServicesSection } from "@/components/sections/admin/admin-services-section";
import { AdminTestimonialsSection } from "@/components/sections/admin/admin-testimonials-section";
import { UsersSection } from "@/components/sections/admin/admin-users-section";
import { Label } from "@/components/ui/label";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import {
  api,
  ContactMessage,
  Profile,
  Project,
  Skill,
  Service,
  Testimonial,
  User,
} from "@/lib/api";
import { Section } from "@/types/types";
import { RefreshCw } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSection = searchParams?.get("section") as Section | null;
  const [section, setSection] = useState<Section>(initialSection || "profiles");
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [postCount, setPostCount] = useState(0);

  async function loadProfiles() {
    setProfilesLoading(true);
    try {
      const data = await api.profiles.list();
      setProfiles(data);
    } catch {
    } finally {
      setProfilesLoading(false);
      setSidebarLoading(false);
    }
  }

  async function loadProjects() {
    setProjectsLoading(true);
    try {
      const data = await api.projects.list();
      setProjects(data);
    } catch {
    } finally {
      setProjectsLoading(false);
    }
  }

  async function loadSkills() {
    setSkillsLoading(true);
    try {
      const data = await api.skills.list();
      setSkills(data);
    } catch {
    } finally {
      setSkillsLoading(false);
    }
  }

  async function loadServices() {
    setServicesLoading(true);
    try {
      const data = await api.services.list();
      setServices(data);
    } catch {
    } finally {
      setServicesLoading(false);
    }
  }

  async function loadTestimonials() {
    setTestimonialsLoading(true);
    try {
      const data = await api.testimonials.list();
      setTestimonials(data);
    } catch {
    } finally {
      setTestimonialsLoading(false);
    }
  }

  async function loadContacts() {
    setContactsLoading(true);
    try {
      const data = await api.contacts.list();
      setContacts(data);
    } catch {
    } finally {
      setContactsLoading(false);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const data = await api.users.list();
      setUsers(data);
    } catch {
    } finally {
      setUsersLoading(false);
    }
  }

  async function loadPostCount() {
    try {
      const data = await api.posts.count();
      setPostCount(data.count);
    } catch {}
  }

  const handleRefresh = () => {
    switch (section) {
      case "profiles":
        loadProfiles();
        break;
      case "projects":
        loadProjects();
        break;
      case "skills":
        loadSkills();
        break;
      case "services":
        loadServices();
        break;
      case "testimonials":
        loadTestimonials();
        break;
      case "contacts":
        loadContacts();
        break;
      case "users":
        loadUsers();
        break;
      default:
        break;
    }
  };

  const handleSectionChange = (newSection: Section) => {
    setSection(newSection);
    router.push(`?section=${newSection}`, { scroll: false });
    switch (newSection) {
      case "profiles":
        if (profiles.length === 0) loadProfiles();
        break;
      case "projects":
        if (projects.length === 0) loadProjects();
        break;
      case "skills":
        if (skills.length === 0) loadSkills();
        break;
      case "services":
        if (services.length === 0) loadServices();
        break;
      case "testimonials":
        if (testimonials.length === 0) loadTestimonials();
        break;
      case "contacts":
        if (contacts.length === 0) loadContacts();
        break;
      case "users":
        if (users.length === 0) loadUsers();
        break;
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    const s = searchParams?.get("section") as Section | null;
    if (!s) {
      router.replace("?section=profiles", { scroll: false });
      loadProfiles();
      loadPostCount();
    } else if (s !== section) {
      setSection(s);
      switch (s) {
        case "profiles":
          if (profiles.length === 0) loadProfiles();
          break;
        case "projects":
          if (projects.length === 0) loadProjects();
          break;
        case "skills":
          if (skills.length === 0) loadSkills();
          break;
        case "services":
          if (services.length === 0) loadServices();
          break;
        case "testimonials":
          if (testimonials.length === 0) loadTestimonials();
          break;
        case "contacts":
          if (contacts.length === 0) loadContacts();
          break;
        case "users":
          if (users.length === 0) loadUsers();
          break;
        default:
          break;
      }
    } else {
      switch (section) {
        case "profiles":
          if (profiles.length === 0) loadProfiles();
          break;
        case "projects":
          if (projects.length === 0) loadProjects();
          break;
        case "skills":
          if (skills.length === 0) loadSkills();
          break;
        case "services":
          if (services.length === 0) loadServices();
          break;
        case "testimonials":
          if (testimonials.length === 0) loadTestimonials();
          break;
        case "contacts":
          if (contacts.length === 0) loadContacts();
          break;
        case "users":
          if (users.length === 0) loadUsers();
          break;
        default:
          break;
      }
      if (postCount === 0) loadPostCount();
    }
  }, [searchParams]);

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
              variant="contained"
              onClick={handleRefresh}
              startIcon={<CachedOutlinedIcon fontSize="small" />}
            >
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
            onSection={handleSectionChange}
            loading={sidebarLoading}
            counts={{
              profiles: profiles.length,
              projects: projects.length,
              skills: skills.length,
              services: services.length,
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
                onReload={loadProfiles}
                loading={profilesLoading}
              />
            )}
            {section === "projects" && (
              <ProjectsSection
                projects={projects}
                onReload={loadProjects}
                loading={projectsLoading}
              />
            )}
            {section === "skills" && (
              <SkillsSection
                skills={skills}
                onReload={loadSkills}
                loading={skillsLoading}
              />
            )}
            {section === "services" && (
              <AdminServicesSection
                services={services}
                onReload={loadServices}
                loading={servicesLoading}
              />
            )}
            {section === "testimonials" && (
              <AdminTestimonialsSection
                testimonials={testimonials}
                onReload={loadTestimonials}
                loading={testimonialsLoading}
              />
            )}
            {section === "contacts" && (
              <ContactsSection contacts={contacts} onReload={loadContacts} />
            )}
            {section === "categories" && <CategoriesSection />}
            {section === "navigation" && <NavigationSection />}
            {section === "analytics" && <AnalyticsDashboard />}
            {section === "users" && (
              <UsersSection
                users={users}
                onReload={loadUsers}
                loading={usersLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
