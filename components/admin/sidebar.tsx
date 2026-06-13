"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Section } from "@/types/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface SidebarProps {
  section: Section;
  onSection: (s: Section) => void;
  counts: {
    profiles: number;
    projects: number;
    skills: number;
    testimonials: number;
    unread: number;
    posts: number;
    categories: number;
    users: number;
  };
}

const NAV_ITEMS: {
  id: Section;
  label: string;
  countKey: keyof SidebarProps["counts"];
  href?: string;
}[] = [
  { id: "profiles", label: "Hồ sơ", countKey: "profiles" },
  { id: "projects", label: "Dự án", countKey: "projects" },
  { id: "skills", label: "Kỹ năng", countKey: "skills" },
  { id: "testimonials", label: "Đánh giá", countKey: "testimonials" },
  { id: "posts", label: "Blog", countKey: "posts", href: "/admin/blogs" },
  { id: "categories", label: "Danh mục", countKey: "categories" },
];

export function Sidebar({ section, onSection, counts }: SidebarProps) {
  const pathname = usePathname();

  return (
      <aside className="w-56 shrink-0 border-r border-border bg-muted/30 flex flex-col backdrop-blur-md">
        <nav className="flex-1 py-4 gap-2 flex flex-col">
          <Label className="px-5 mb-2 text-[0.6rem] tracking-widest uppercase text-muted-foreground">
            Nội dung
          </Label>
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className={[
                  "relative w-full flex items-center justify-between px-5 py-2.5 text-sm rounded-none overflow-hidden",
                  "hover:bg-background/60 transition-colors",
                  pathname.startsWith(item.href)
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                <Label className="relative z-10 cursor-pointer flex items-center gap-2">
                  {item.label}
                  <ExternalLink className="size-3 opacity-50" />
                </Label>
                <Label className="relative z-10 cursor-pointer">
                  <span className="text-xs tabular-nums text-muted-foreground/60">
                    {counts[item.countKey]}
                  </span>
                </Label>
              </Link>
            ) : (
              <NavButton
                  key={item.id}
                  active={section === item.id}
                  onClick={() => onSection(item.id)}
                  label={item.label}
                  count={counts[item.countKey]}
              />
            ),
          )}

          <Label className="px-5 mt-5 mb-2 text-[0.6rem] tracking-widest uppercase text-muted-foreground">
            Hộp thư
          </Label>
          <NavButton
              active={section === "contacts"}
              onClick={() => onSection("contacts")}
              label="Tin nhắn"
              badge={
                counts.unread > 0 ? (
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[0.6rem] font-medium bg-destructive/15 text-destructive rounded-full px-1.5 py-0.5 tabular-nums"
                    >
                      {counts.unread}
                    </motion.span>
                ) : null
              }
          />
          <Label className="px-5 mt-5 mb-2 text-[0.6rem] tracking-widest uppercase text-muted-foreground">
            Hệ thống
          </Label>
          <NavButton
              active={section === "categories"}
              onClick={() => onSection("categories")}
              label="Danh mục"
              count={counts.categories}
          />
          <NavButton
              active={section === "navigation"}
              onClick={() => onSection("navigation")}
              label="Điều hướng"
          />
          <NavButton
              active={section === "analytics"}
              onClick={() => onSection("analytics")}
              label="Phân tích"
          />
          <NavButton
              active={section === "users"}
              onClick={() => onSection("users")}
              label="Người dùng"
              count={counts.users}
          />
        </nav>

        <div className="p-4 border-t border-border grid grid-cols-2 gap-2">
          {[
            { n: counts.profiles, l: "Hồ sơ" },
            { n: counts.projects, l: "Dự án" },
            { n: counts.skills, l: "Kỹ năng" },
            { n: counts.testimonials, l: "Đánh giá" },
          ].map(({ n, l }) => (
              <div key={l} className="bg-background/70 px-3 py-2">
                <p className="text-lg font-medium leading-none tabular-nums">{n}</p>
                <Label className="text-[0.6rem] tracking-wide uppercase text-muted-foreground mt-1">
                  {l}
                </Label>
              </div>
          ))}
        </div>
      </aside>
  );
}

function NavButton({
  active,
  onClick,
  label,
  count,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  badge?: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={[
        "relative w-full flex items-center justify-between px-5 py-2.5 text-sm rounded-none overflow-hidden",
        "hover:bg-background/60 transition-colors",
        active ? "font-medium text-foreground" : "text-muted-foreground",
      ].join(" ")}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-active-bg"
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-active-border"
            className="absolute left-0 top-0 h-full w-0.75 bg-primary rounded-r-full"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
      <Label className="relative z-10 cursor-pointer">{label}</Label>
      <Label className="relative z-10 cursor-pointer">
        {badge ??
          (count !== undefined && (
            <motion.span
              animate={{
                color: active
                  ? "hsl(var(--foreground) / 0.4)"
                  : "hsl(var(--muted-foreground) / 0.6)",
              }}
              transition={{ duration: 0.2 }}
              className="text-xs tabular-nums"
            >
              {count}
            </motion.span>
          ))}
      </Label>
    </Button>
  );
}
