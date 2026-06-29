"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect } from "react";

interface ImageLightboxProps {
  images: string[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

export function ImageLightbox({
  images,
  openIndex,
  onClose,
  onNavigate,
  title = "Ảnh",
}: ImageLightboxProps) {
  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate((openIndex! - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((openIndex! + 1) % images.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, openIndex, images.length, onNavigate]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPopup
        className="max-w-4xl border-0 bg-transparent p-2 shadow-none sm:max-w-4xl md:max-w-6xl lg:max-w-7xl"
        bottomStickOnMobile={false}
      >
        {openIndex !== null && images[openIndex] && (
          <div className="relative mx-auto w-full">
            <div className="relative aspect-square w-full h-auto lg:max-h-[min(75vh,800px)]">
              <Image
                src={images[openIndex]}
                alt={`${title} - ảnh ${openIndex + 1}`}
                fill
                className="rounded-t-lg object-contain"
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
                      onNavigate(
                        (openIndex - 1 + images.length) % images.length,
                      );
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
                      onNavigate((openIndex + 1) % images.length);
                    }}
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight className="size-5" />
                  </Button>

                  <span className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                    {openIndex + 1} / {images.length}
                  </span>
                </Fragment>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-1.5 p-2 bg-black/70 rounded-b-lg overflow-x-auto">
                {images.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(i);
                    }}
                    className={`relative shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                      i === openIndex
                        ? "border-primary ring-1 ring-primary/50"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogPopup>
    </Dialog>
  );
}
