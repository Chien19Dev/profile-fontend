import { prisma } from "@/lib/prisma";
import type { Profile, Project, Skill, Testimonial } from "@/lib/api";

const profileSelect = {
  id: true,
  fullName: true,
  title: true,
  bio: true,
  avatar: true,
  email: true,
  phone: true,
  location: true,
  githubUrl: true,
  linkedinUrl: true,
  websiteUrl: true,
  cvUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function getHomePageData(): Promise<{
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  testimonials: Testimonial[];
}> {
  const [profileResult, projectsResult, skillsResult, testimonialsResult] =
    await Promise.allSettled([
      prisma.profile.findFirst({
        orderBy: { createdAt: "desc" },
        select: profileSelect,
      }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skill.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
    ]);

  return {
    profile:
      profileResult.status === "fulfilled"
        ? (serialize(profileResult.value) as unknown as Profile | null)
        : null,
    projects:
      projectsResult.status === "fulfilled"
        ? (serialize(projectsResult.value) as unknown as Project[])
        : [],
    skills:
      skillsResult.status === "fulfilled"
        ? (serialize(skillsResult.value) as unknown as Skill[])
        : [],
    testimonials:
      testimonialsResult.status === "fulfilled"
        ? (serialize(testimonialsResult.value) as unknown as Testimonial[])
        : [],
  };
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, updatedAt: true, createdAt: true },
  });
}

export async function getPublishedSkills() {
  return prisma.skill.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, updatedAt: true },
  });
}

export async function getPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, authorName: true, updatedAt: true },
  });
}

export async function getNavigationItems() {
  return prisma.navigation.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getCvExists(): Promise<boolean> {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "desc" },
      select: { cvUrl: true },
    });
    return !!profile?.cvUrl;
  } catch {
    return false;
  }
}
