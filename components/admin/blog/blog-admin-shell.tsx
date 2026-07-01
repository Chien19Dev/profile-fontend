"use client";

import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { BlogSidebar } from "./blog-sidebar";

interface BlogAdminShellProps {
  children: ReactNode;
  postCount?: number;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function BlogAdminShell({
  children,
  postCount,
  title,
  subtitle,
  actions,
}: BlogAdminShellProps) {
  return (
    <div className="blog-luxury-page deco-page relative h-full">
      <div className="relative z-10 flex h-full">
        <BlogSidebar postCount={postCount} />

        <div className="flex-1 min-h-0 flex flex-col min-w-0">
          {(title || actions) && (
            <header className="shrink-0 border-b border-border/50 bg-background/40 backdrop-blur-md px-4 py-3">
              <div className="flex items-start justify-between gap-4 lg:max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {subtitle && (
                    <Label className="tracking-[.15em] uppercase text-primary text-sm lg:text-xl mr-1.5">
                      {subtitle}
                    </Label>
                  )}
                  {title && (
                    <Label className="deco-title text-sm lg:text-xl text-foreground">
                      {title}
                    </Label>
                  )}
                </motion.div>
                {actions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="flex items-center gap-2 shrink-0"
                  >
                    {actions}
                  </motion.div>
                )}
              </div>
            </header>
          )}

          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="p-3 md:p-5 lg:p-8"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
