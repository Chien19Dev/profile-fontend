import {
    getPublishedPosts,
    getPublishedProjects,
    getPublishedSkills,
    getPublishedTestimonials,
} from "@/lib/data";
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, skills, testimonials] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
    getPublishedSkills(),
    getPublishedTestimonials(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: project.updatedAt || project.createdAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
  //   url: `${BASE_URL}/skills/${skill.id}`,
  //   lastModified: skill.updatedAt || new Date(),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.5,
  // }));

  const testimonialPages: MetadataRoute.Sitemap = testimonials.map(
    (testimonial) => ({
      url: `${BASE_URL}/testimonials/${testimonial.id}`,
      lastModified: testimonial.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }),
  );

  return [
    ...staticPages,
    ...blogPages,
    ...projectPages,
    // ...skillPages,
    ...testimonialPages,
  ];
}
