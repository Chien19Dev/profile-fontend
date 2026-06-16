"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Link,
  ZoomIn,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import type { Project } from "@/lib/api";
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

  const showPrevImage = () => {
    if (previewIndex === null || images.length <= 1) return;
    setPreviewIndex((previewIndex - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    if (previewIndex === null || images.length <= 1) return;
    setPreviewIndex((previewIndex + 1) % images.length);
  };

  useEffect(() => {
    if (previewIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === "ArrowLeft") {
        setPreviewIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length,
        );
      }
      if (e.key === "ArrowRight") {
        setPreviewIndex((i) => (i === null ? null : (i + 1) % images.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewIndex, images.length]);

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

      <Dialog
        open={previewIndex !== null}
        onOpenChange={(next) => {
          if (!next) setPreviewIndex(null);
        }}
      >
        <DialogPopup
          className="max-w-4xl border-0 bg-transparent p-2 shadow-none sm:max-w-4xl"
          bottomStickOnMobile={false}
        >
          {previewIndex !== null && images[previewIndex] && (
            <div className="relative mx-auto aspect-square w-full max-h-[min(85vh,768px)]">
              <Image
                src={images[previewIndex]}
                alt={`${project?.title ?? "Dự án"} - ảnh ${previewIndex + 1}`}
                fill
                className="rounded-lg object-contain"
              />

              {images.length > 1 && (
                <Fragment>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrevImage();
                    }}
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNextImage();
                    }}
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight className="size-5" />
                  </Button>

                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                    {previewIndex + 1} / {images.length}
                  </span>
                </Fragment>
              )}
            </div>
          )}
        </DialogPopup>
      </Dialog>
    </Fragment>
  );
}
