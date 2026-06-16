import { Skill } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import {Fragment} from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "../admin/admin-section-heading";

interface Props {
  skills: Skill[];
  loading: boolean;
}

export function SkillsSection({ skills, loading }: Props) {
  return (
    <DecoFrame className="p-6 md:p-8">
      <SectionHeading label="Chuyên môn" title="Kỹ năng" />
      {loading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      ) : skills.length === 0 ? (
        <Badge variant="outline" className="mt-6">
          Chưa có kỹ năng
        </Badge>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5"
            >
              <span className="text-sm font-medium text-foreground">
                {skill.name}
              </span>
              {skill.level ? (
                <Fragment>
                  <span className="text-muted-foreground/50 text-xs">·</span>
                  <span className="text-xs text-primary tabular-nums font-medium">
                    {skill.level}%
                  </span>
                </Fragment>
              ) : skill.category ? (
                <Fragment>
                  <span className="text-muted-foreground/50 text-xs">·</span>
                  <span className="text-xs text-muted-foreground">
                    {skill.category}
                  </span>
                </Fragment>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </DecoFrame>
  );
}
