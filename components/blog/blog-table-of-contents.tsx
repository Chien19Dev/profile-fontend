"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, List } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: "H2" | "H3";
}

interface BlogTableOfContentsProps {
  articleSelector?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogTableOfContents({
  articleSelector = "[data-blog-content]",
}: BlogTableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const extractHeadings = useCallback(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];
    const idCounts: Record<string, number> = {};

    headings.forEach((el) => {
      const text = el.textContent?.trim() || "";
      if (!text) return;

      let id = slugify(text);
      if (idCounts[id] !== undefined) {
        idCounts[id]++;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 0;
      }

      el.id = id;
      tocItems.push({
        id,
        text,
        level: el.tagName as "H2" | "H3",
      });
    });

    setItems(tocItems);
  }, [articleSelector]);

  useEffect(() => {
    const timer = setTimeout(() => {
      extractHeadings();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [extractHeadings]);

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  const scrollToHeading = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
        setActiveId(id);
      }
    },
    [],
  );

  if (items.length === 0) return null;

  return (
    <nav className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <List className="size-4 text-primary" />
          Mục lục
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            collapsed && "-rotate-90",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
      >
        <ul className="overflow-hidden">
          <li className="px-4 pb-3">
            <ul className="space-y-0.5 border-s-2 border-border">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(e, item.id)}
                    className={cn(
                      "block text-xs leading-relaxed transition-colors duration-150 hover:text-primary",
                      item.level === "H3" && "ps-6",
                      item.level === "H2" && "ps-3",
                      "pe-3 py-1.5",
                      activeId === item.id
                        ? "text-primary font-semibold border-s-2 border-primary -ms-[2px]"
                        : "text-muted-foreground border-s-2 border-transparent -ms-[2px]",
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
