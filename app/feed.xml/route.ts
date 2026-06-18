import { prisma } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [profile, posts] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        title: true,
        slug: true,
        summary: true,
        content: true,
        author: true,
        category: true,
        tags: true,
        coverImage: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const siteName = profile?.fullName || "Nguyễn Đình Chiến";
  const siteDescription =
    profile?.bio ||
    "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js, TypeScript và các giải pháp web thực tế.";
  const defaultAuthor = profile?.email || "nguyendinhchien19042003@gmail.com";

  const rssItems = posts
    .map((post) => {
      const categories = [
        ...(post.category ? [`      <category>${escapeXml(post.category)}</category>`] : []),
        ...post.tags.map(
          (tag) => `      <category>${escapeXml(tag)}</category>`,
        ),
      ].join("\n");

      const authorName = post.author || siteName;
      const pubDate = new Date(
        post.publishedAt || post.updatedAt || Date.now(),
      ).toUTCString();

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <description><![CDATA[${post.summary || ""}]]></description>
      <content:encoded><![CDATA[${post.content || ""}]]></content:encoded>
      <author>${escapeXml(`${defaultAuthor} (${authorName})`)}</author>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
${categories}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)} - Blog</title>
    <link>${BASE_URL}/blog</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${escapeXml(defaultAuthor)} (${escapeXml(siteName)})</managingEditor>
    <webMaster>${escapeXml(defaultAuthor)} (${escapeXml(siteName)})</webMaster>
    <image>
      <url>${BASE_URL}/blog.png</url>
      <title>${escapeXml(siteName)} - Blog</title>
      <link>${BASE_URL}</link>
    </image>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}
