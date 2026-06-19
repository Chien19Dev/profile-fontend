"use client";

export function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <Icon className="h-3.5 w-3.5 text-muted-foreground/40" />
      <span className="text-sm font-semibold tabular-nums tracking-tight">
        {value}
      </span>
      <span className="text-[0.55rem] text-muted-foreground/40 leading-none uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
