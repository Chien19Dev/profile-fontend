"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/lib/api";
import {
    ExternalLink,
    Link,
    ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { ImageLightbox } from "./image-lightbox";

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: ProjectDetailDialogProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const images = project?.images ?? [];

  return (
    <Fragment>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setPreviewIndex(null);
          onOpenChange(next);
        }}
      >
        <DialogPopup className="max-w-3xl">
          {project && (
            <Fragment>
              <DialogHeader>
                <DialogTitle>{project.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  Chi tiết dự án {project.title}
                </DialogDescription>
              </DialogHeader>

              <DialogPanel className="space-y-5">
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setPreviewIndex(images.indexOf(url))}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                          <ZoomIn className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {project.description}
                </p>

                {(project.technologies?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies!.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
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
              </DialogPanel>
            </Fragment>
          )}
        </DialogPopup>
      </Dialog>

      <ImageLightbox
        images={images}
        openIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
        onNavigate={(i) => setPreviewIndex(i)}
        title={project?.title}
      />
    </Fragment>
  );
}
