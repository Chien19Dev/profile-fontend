import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/register"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Bytespider",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    // host: BASE_URL,
  };
}
