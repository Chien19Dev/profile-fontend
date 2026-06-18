import { HomePage } from "@/components/sections/pages/home-page";
import { getHomePageData } from "@/lib/data";

export const revalidate = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export default async function Page() {
  const { profile, projects, skills, testimonials } = await getHomePageData();
  const sameAs = [
    profile?.githubUrl,
    profile?.linkedinUrl,
    profile?.twitterUrl,
    profile?.facebookUrl,
    profile?.websiteUrl,
  ].filter(Boolean) as string[];

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.fullName || "Nguyễn Đình Chiến",
    jobTitle: profile?.title || "Frontend Developer",
    description: profile?.bio || "Frontend Developer chuyên React, Next.js, TypeScript.",
    email: profile?.email || undefined,
    url: SITE_URL,
    image: profile?.avatar || `${SITE_URL}/banner.png`,
    sameAs,
    knowsAbout: skills.map((s) => s.name),
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nguyễn Đình Chiến Portfolio",
    url: SITE_URL,
    description:
      "Portfolio cá nhân giới thiệu dự án, kỹ năng và kinh nghiệm phát triển web hiện đại.",
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Person",
      name: profile?.fullName || "Nguyễn Đình Chiến",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePage
        profile={profile}
        projects={projects}
        skills={skills}
        testimonials={testimonials}
      />
    </>
  );
}
