import { Section } from "@/types/types";

interface SidebarProps {
  section: Section;
  onSection: (s: Section) => void;
  counts: {
    profiles: number;
    projects: number;
    skills: number;
    unread: number;
  };
}

const NAV_ITEMS: {
  id: Section;
  label: string;
  countKey: keyof SidebarProps["counts"];
}[] = [
  { id: "profiles", label: "Hồ sơ", countKey: "profiles" },
  { id: "projects", label: "Dự án", countKey: "projects" },
  { id: "skills", label: "Kỹ năng", countKey: "skills" },
];

export function Sidebar({ section, onSection, counts }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-muted/30 flex flex-col backdrop-blur-md">
      <nav className="flex-1 py-4">
        <p className="px-5 mb-2 text-[0.6rem] tracking-widest uppercase text-muted-foreground">
          Nội dung
        </p>
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            active={section === item.id}
            onClick={() => onSection(item.id)}
            label={item.label}
            count={counts[item.countKey]}
          />
        ))}

        <p className="px-5 mt-5 mb-2 text-[0.6rem] tracking-widest uppercase text-muted-foreground">
          Hộp thư
        </p>
        <NavButton
          active={section === "contacts"}
          onClick={() => onSection("contacts")}
          label="Tin nhắn"
          badge={
            counts.unread > 0 ? (
              <span className="text-[0.6rem] font-medium bg-destructive/15 text-destructive rounded-full px-1.5 py-0.5 tabular-nums">
                {counts.unread}
              </span>
            ) : null
          }
        />
      </nav>

      <div className="p-4 border-t border-border grid grid-cols-2 gap-2">
        {[
          { n: counts.profiles, l: "Hồ sơ" },
          { n: counts.projects, l: "Dự án" },
          { n: counts.skills, l: "Kỹ năng" },
          { n: counts.unread, l: "Mới" },
        ].map(({ n, l }) => (
          <div key={l} className="bg-background/70 px-3 py-2">
            <p className="text-lg font-medium leading-none tabular-nums">{n}</p>
            <p className="text-[0.6rem] tracking-wide uppercase text-muted-foreground mt-1">
              {l}
            </p>
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
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between cursor-pointer px-5 py-2.5 text-sm transition-colors hover:bg-background/60",
        active
          ? "bg-background font-medium text-foreground border-l-2 border-primary"
          : "text-muted-foreground border-l-2 border-transparent",
      ].join(" ")}
    >
      <span>{label}</span>
      {badge ??
        (count !== undefined && (
          <span className="text-xs text-muted-foreground/60 tabular-nums">
            {count}
          </span>
        ))}
    </button>
  );
}
