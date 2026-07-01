import { Service } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "../admin/admin-section-heading";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@mui/material/Button";

interface Props {
  services: Service[];
  loading: boolean;
}

export function ServicesSection({ services, loading }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!loading && services.length === 0) {
    return null;
  }

  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentItems = () => {
    const start = currentIndex * itemsPerPage;
    return services.slice(start, start + itemsPerPage);
  };

  return (
    <DecoFrame className="p-6 md:p-8">
      <SectionHeading label="Cung cấp" title="Dịch vụ" />
      {loading ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentItems().map((service) => (
              <DecoFrame key={service.id} className="p-4">
                <div className="flex flex-col items-start text-start gap-2">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="w-full">
                    <h3 className="font-semibold text-foreground text-base">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
              </DecoFrame>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outlined"
                size="small"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={handleNext}
                disabled={currentIndex === totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </DecoFrame>
  );
}
