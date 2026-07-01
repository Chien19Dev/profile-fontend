"use client";

import { ContactSection } from "@/components/sections/pages/contact-section";
import { ProfileCard } from "@/components/sections/pages/profile-card";
import { ProjectsSection } from "@/components/sections/pages/projects-section";
import { RegisteredUsersSection } from "@/components/sections/pages/registered-users-section";
import { SkillsSection } from "@/components/sections/pages/skills-section";
import { ServicesSection } from "@/components/sections/pages/services-section";
import { TestimonialsSection } from "@/components/sections/pages/testimonials-section";
import type { Profile, Project, Service, Skill, Testimonial } from "@/lib/api";
import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { useMemo } from "react";

const MotionDiv = motion.div;

interface HomePageProps {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  testimonials: Testimonial[];
}

export function HomePage({
  profile,
  projects,
  skills,
  services,
  testimonials,
}: HomePageProps) {
  const initials = useMemo(() => {
    const name = profile?.fullName || "Hồ sơ";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile]);

  return (
    <div className="deco-page relative">
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 max-w-330">
        <div className="grid items-stretch gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <MotionDiv {...fadeUp} className="h-full">
              <ProfileCard
                profile={profile}
                initials={initials}
                loading={false}
              />
            </MotionDiv>
          </div>
          <div className="md:col-span-7 space-y-6">
            <MotionDiv
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
            >
              <SkillsSection skills={skills} loading={false} />
            </MotionDiv>

            <MotionDiv
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.14 }}
            >
              <ContactSection />
            </MotionDiv>
          </div>
        </div>

        <MotionDiv
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.18 }}
          className="mt-10 md:mt-14"
        >
          <ProjectsSection projects={projects} loading={false} />
        </MotionDiv>

        <MotionDiv
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.22 }}
          className="mt-10 md:mt-14"
        >
          <ServicesSection services={services} loading={false} />
        </MotionDiv>

        <MotionDiv
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.26 }}
          className="mt-10 md:mt-14"
        >
          <TestimonialsSection testimonials={testimonials} loading={false} />
        </MotionDiv>

        <MotionDiv
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.30 }}
          className="mt-10 md:mt-14"
        >
          <RegisteredUsersSection />
        </MotionDiv>
      </div>
    </div>
  );
}
