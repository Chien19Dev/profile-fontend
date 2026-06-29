"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  LayoutGrid,
  PenLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/admin/blogs",
    label: "Tất cả bài viết",
    icon: LayoutGrid,
    exact: true,
  },
  {
    href: "/admin/blogs/new",
    label: "Viết bài mới",
    icon: PenLine,
    exact: false,
  },
] as const;

interface BlogSidebarProps {
  postCount?: number;
}

export function BlogSidebar({ postCount = 0 }: BlogSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="blog-luxury-sidebar w-60 shrink-0 sticky top-0 h-full flex flex-col border-r border-border/60">
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Sparkles className="size-4 text-primary" />
          <Label className="deco-eyebrow text-[0.65rem]">Blog Studio</Label>
        </div>
        <h2 className="deco-title text-2xl text-foreground tracking-wide">
          Biên tập
        </h2>
        <div className="deco-rule mt-4" />
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm overflow-hidden",
                active
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              <AnimatePresence>
                {active && (
                  <motion.span
                    layoutId="blog-nav-active"
                    className="absolute inset-0 bg-background/80 border border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary rounded-r-full" />
              )}
              <Icon className="relative z-10 size-4 shrink-0" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-border/50">
        <div className="blog-luxury-stat mb-4">
          <FileText className="size-4 text-primary/70" />
          <div className="flex flex-row items-start gap-2">
            <Label className="text-2xl font-medium tabular-nums leading-none">
              {postCount}
            </Label>
            <Label className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              Bài viết
            </Label>
          </div>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="size-3.5" />
          Quay lại Quản trị
        </Link>
      </div>
    </aside>
  );
}
