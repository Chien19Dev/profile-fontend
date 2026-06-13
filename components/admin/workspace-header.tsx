import { Section } from "@/types/types";

const LABELS: Record<Section, string> = {
  profiles: "Hồ sơ cá nhân",
  projects: "Dự án",
  skills: "Kỹ năng",
  testimonials: "Đánh giá",
  contacts: "Tin nhắn liên hệ",
  posts: "Bài viết (Blog)",
  analytics: "Phân tích truy cập",
  navigation: "Điều hướng",
  notifications: "Thông báo",
  categories: "Danh mục dự án",
  users: "Người dùng",
};

export function WorkspaceHeader({ section }: { section: Section }) {
  return (
      <div className="h-11 flex items-center px-6 border-b border-border shrink-0 bg-border/40 backdrop-blur-md">
        <span className="deco-eyebrow">{LABELS[section]}</span>
      </div>
  );
}
