"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Eye, Link } from "lucide-react";
import { Project } from "@/lib/api";
import { ProjectDetailDialog } from "@/components/sections/pages/project-detail-dialog";
import { fadeEase } from "@/lib/motion";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "../admin/admin-section-heading";
import { SearchBar } from "@/components/sections/search-bar";

const MotionDiv = motion.div;

interface ProjectsSectionProps {
  projects: Project[];
  loading: boolean;
}

export function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => {
      (p.technologies || []).forEach((t) => techs.add(t));
    });
    return Array.from(techs);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (selectedTech) {
      result = result.filter((p) =>
        (p.technologies || []).includes(selectedTech),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.technologies || []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [projects, selectedTech, searchQuery]);

  return (
    <section id="projects">
      <SectionHeading label="Tác phẩm" title="Dự án" className="mb-4" />

      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Tìm kiếm dự án..."
        className="mb-4 max-w-sm"
      />

      {!loading && allTechs.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedTech === null ? "default" : "outline"}
            onClick={() => setSelectedTech(null)}
          >
            Tất cả
          </Button>
          {allTechs.map((tech) => (
            <Button
              key={tech}
              size="sm"
              variant={selectedTech === tech ? "default" : "outline"}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </Button>
          ))}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))
          : filteredProjects.map((project, index) => (
              <MotionDiv
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * index,
                  ease: fadeEase,
                }}
                whileHover={{ y: -3 }}
              >
                <DecoFrame className="flex h-full flex-col overflow-hidden">
                  <div
                    className="aspect-video border-b border-border bg-muted bg-cover bg-center"
                    style={{
                      backgroundImage:
                        project.images && project.images.length > 0
                          ? `url(${project.images[0]})`
                          : undefined,
                    }}
                  />
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <h3 className="deco-title text-xl text-foreground">
                      {project.title}
                    </h3>
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                      {project.description?.slice(0, 50)}...
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDetailProject(project)}
                      >
                        Chi tiết <Eye />
                      </Button>
                      {project.demoUrl && (
                        <Button
                          size="sm"
                          render={
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          Xem demo <ExternalLink />
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          render={
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          Mã nguồn <Link />
                        </Button>
                      )}
                    </div>
                  </div>
                </DecoFrame>
              </MotionDiv>
            ))}
      </div>

      <ProjectDetailDialog
        project={detailProject}
        open={detailProject !== null}
        onOpenChange={(open) => {
          if (!open) setDetailProject(null);
        }}
      />
    </section>
  );
}
