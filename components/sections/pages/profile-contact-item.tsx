import Link from "next/link";
import { Fragment, type ComponentType } from "react";

interface ProfileContactItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  children: React.ReactNode;
}

export function ProfileContactItem({
  icon: Icon,
  label,
  href,
  children,
}: ProfileContactItemProps) {
  const content = (
    <Fragment>
      <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted/40 text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="deco-eyebrow block text-[0.58rem]">{label}</span>
        <span className="block truncate text-sm text-foreground">
          {children}
        </span>
      </span>
    </Fragment>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center gap-3 transition-colors hover:text-primary"
        >
          {content}
        </Link>
      </li>
    );
  }

  return <li className="flex items-center gap-3">{content}</li>;
}
