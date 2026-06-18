import { prisma } from "@/lib/prisma";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export async function GET() {
  const [profile, posts, projects, skills] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: { title: true, slug: true, summary: true, tags: true, publishedAt: true },
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { title: true, description: true, technologies: true },
    }),
    prisma.skill.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { name: true, category: true },
    }),
  ]);

  const blogSection = posts
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.summary || "Bài viết chia sẻ kinh nghiệm lập trình."}`,
    )
    .join("\n");

  const projectSection = projects
    .map((p) => `- ${p.title}: ${p.description}`)
    .join("\n");

  const skillNames = skills.map((s) => s.name).join(", ");

  const content = `# ${profile?.fullName || "Nguyễn Đình Chiến"}

> ${profile?.title || "Frontend Developer"} — ${profile?.bio || "Chuyên React, Next.js, TypeScript và Modern UI."}

## About

- **Name**: ${profile?.fullName || "Nguyễn Đình Chiến"}
- **Title**: ${profile?.title || "Frontend Developer"}
- **Website**: ${SITE_URL}
- **Email**: ${profile?.email || "nguyendinhchien19042003@gmail.com"}
- **Location**: ${profile?.location || "Vietnam"}
${profile?.githubUrl ? `- **GitHub**: ${profile.githubUrl}` : ""}
${profile?.linkedinUrl ? `- **LinkedIn**: ${profile.linkedinUrl}` : ""}

## Skills

${skillNames}

## Projects

${projectSection}

## Blog

${blogSection}

## Contact

- **Email**: ${profile?.email || "nguyendinhchien19042003@gmail.com"}
${profile?.phone ? `- **Phone**: ${profile.phone}` : ""}
- **Website**: ${SITE_URL}

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS Feed](${SITE_URL}/feed.xml)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
