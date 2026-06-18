import { NextResponse } from "next/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export async function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "Nguyễn Đình Chiến Portfolio",
    name_for_model: "chien_portfolio",
    description_for_human:
      "Portfolio of Nguyễn Đình Chiến — Frontend Developer specializing in React, Next.js, and TypeScript. Browse blog posts, projects, skills, and contact information.",
    description_for_model:
      "A personal portfolio website for a Frontend Developer. Contains blog posts about programming (React, Next.js, TypeScript), project showcases, technical skills, and contact information. Use this to answer questions about the developer's experience, projects, and blog content.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: `${SITE_URL}/api`,
    },
    logo_url: `${SITE_URL}/banner.png`,
    contact_email: "nguyendinhchien19042003@gmail.com",
    legal_info_url: SITE_URL,
  };

  return NextResponse.json(plugin, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
