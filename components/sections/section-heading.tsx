import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label: string;
  title?: string;
  className?: string;
};

export function SectionHeading({
  label,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="deco-eyebrow">{label}</p>
      {title ? (
        <div className="deco-rule">
          <h2 className="deco-title text-2xl md:text-3xl text-foreground shrink-0">
            {title}
          </h2>
        </div>
      ) : null}
    </div>
  );
}
