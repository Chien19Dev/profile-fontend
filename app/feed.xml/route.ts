import { getPublishedPosts } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export async function GET() {
  const posts = await getPublishedPosts();

  const allPosts = await Promise.all(
    posts.map(async (p) => {
      const { prisma } = await import("@/lib/prisma");
      const fullPost = await prisma.post.findUnique({
        where: { id: p.slug },
        select: { title: true, slug: true, summary: true, author: true, publishedAt: true, content: true },
      });
      return fullPost;
    }),
  );

  const validPosts = allPosts.filter(Boolean);

  const rssItems = validPosts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post!.title}]]></title>
      <link>${BASE_URL}/blog/${post!.slug}</link>
      <description><![CDATA[${post!.summary || ""}]]></description>
      <author>${post!.author || "Nguyễn Đình Chiến"}</author>
      <pubDate>${new Date(post!.publishedAt || Date.now()).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/blog/${post!.slug}</guid>
    </item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nguyễn Đình Chiến - Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js, TypeScript và các giải pháp web thực tế.</description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
    },
  });
}
