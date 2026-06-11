import { Section } from "@/types/types";

const LABELS: Record<Section, string> = {
  profiles: "Hồ sơ cá nhân",
  projects: "Dự án",
  skills: "Kỹ năng",
  contacts: "Tin nhắn liên hệ",
};

export function WorkspaceHeader({ section }: { section: Section }) {
  return (
    <div className="h-11 flex items-center px-6 border-b border-border shrink-0 bg-border/40 backdrop-blur-md">
      <span className="deco-eyebrow">{LABELS[section]}</span>
    </div>
  );
}
