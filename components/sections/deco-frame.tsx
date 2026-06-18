import { cn } from "@/lib/utils";

type DecoFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  accent?: boolean;
  bottomLeftClassName?: string;
  bottomRightClassName?: string;
};

export function DecoFrame({
  children,
  className,
  accent = false,
  bottomLeftClassName,
  bottomRightClassName,
  ...rest
}: DecoFrameProps) {
  return (
    <div
      className={cn(
        "deco-panel relative bg-card text-card-foreground",
        accent && "deco-panel-accent",
        className,
      )}
      {...rest}
    >
      <span className="deco-corner deco-corner-tl" aria-hidden />
      <span className="deco-corner deco-corner-tr" aria-hidden />
      <span
        className={cn("deco-corner deco-corner-bl", bottomLeftClassName)}
        aria-hidden
      />
      <span
        className={cn("deco-corner deco-corner-br", bottomRightClassName)}
        aria-hidden
      />
      {children}
    </div>
  );
}
