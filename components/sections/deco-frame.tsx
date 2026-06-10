import { cn } from "@/lib/utils";

type DecoFrameProps = {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
};

export function DecoFrame({
  children,
  className,
  accent = false,
}: DecoFrameProps) {
  return (
    <div
      className={cn(
        "deco-panel relative bg-card text-card-foreground",
        accent && "deco-panel-accent",
        className,
      )}
    >
      <span className="deco-corner deco-corner-tl" aria-hidden />
      <span className="deco-corner deco-corner-tr" aria-hidden />
      <span className="deco-corner deco-corner-bl" aria-hidden />
      <span className="deco-corner deco-corner-br" aria-hidden />
      {children}
    </div>
  );
}
