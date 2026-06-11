"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit, MailCheck, Plus, RefreshCw, Trash2 } from "lucide-react";
import { api, ContactMessage, Profile, Project, Skill } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { alertSuccess, alertError } from "@/lib/alerts";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;
type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
};
type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

const profileForm: ProfileForm = {
  fullName: "",
  title: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
};

const projectForm: ProjectForm = {
  title: "",
  description: "",
  image: "",
  githubUrl: "",
  demoUrl: "",
  technologies: [],
  technologiesText: "",
};

const skillForm: SkillForm = {
  name: "",
  category: "",
  icon: "",
  level: 0,
  order: 0,
};

const profileFieldLabels: Record<string, string> = {
  avatar: "Ảnh đại diện (URL)",
  email: "Email",
  phone: "Số điện thoại",
  location: "Địa điểm",
  githubUrl: "GitHub URL",
  linkedinUrl: "LinkedIn URL",
  websiteUrl: "Website URL",
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [profile, setProfile] = useState(profileForm);
  const [project, setProject] = useState(projectForm);
  const [skill, setSkill] = useState(skillForm);
  const [editingProfileId, setEditingProfileId] = useState("");
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editingSkillId, setEditingSkillId] = useState("");

  async function load() {
    const [profileData, projectData, skillData, contactData] =
      await Promise.all([
        api.profiles.list(),
        api.projects.list(),
        api.skills.list(),
        api.contacts.list(),
      ]);

    setProfiles(profileData);
    setProjects(projectData);
    setSkills(skillData);
    setContacts(contactData);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingProfileId) {
        await api.profiles.update(editingProfileId, profile);
        alertSuccess("Đã cập nhật hồ sơ thành công");
      } else {
        await api.profiles.create(profile);
        alertSuccess("Đã tạo hồ sơ thành công");
      }
      setProfile(profileForm);
      setEditingProfileId("");
      await load();
    } catch (error) {
      alertError("Có lỗi xảy ra khi lưu hồ sơ");
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...project,
      technologies: project.technologiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    delete (payload as Partial<ProjectForm>).technologiesText;

    try {
      if (editingProjectId) {
        await api.projects.update(editingProjectId, payload);
        alertSuccess("Đã cập nhật dự án thành công");
      } else {
        await api.projects.create(payload);
        alertSuccess("Đã tạo dự án thành công");
      }
      setProject(projectForm);
      setEditingProjectId("");
      await load();
    } catch (error) {
      alertError("Có lỗi xảy ra khi lưu dự án");
    }
  }

  async function saveSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...skill,
      level: Number(skill.level || 0),
      order: Number(skill.order || 0),
    };

    try {
      if (editingSkillId) {
        await api.skills.update(editingSkillId, payload);
        alertSuccess("Đã cập nhật kỹ năng thành công");
      } else {
        await api.skills.create(payload);
        alertSuccess("Đã tạo kỹ năng thành công");
      }
      setSkill(skillForm);
      setEditingSkillId("");
      await load();
    } catch (error) {
      alertError("Có lỗi xảy ra khi lưu kỹ năng");
    }
  }

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="deco-eyebrow mb-2">Bảng điều khiển</p>
            <h1 className="deco-title text-4xl md:text-5xl text-foreground">
              Quản trị
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Quản lý nội dung portfolio qua API backend
            </p>
          </div>
          <Button variant="outline" onClick={load}>
            <RefreshCw />
            Làm mới
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <AdminPanel title="Hồ sơ" label="Thông tin cá nhân">
            <form onSubmit={saveProfile} className="space-y-4">
              <FormField label="Họ và tên">
                <Input
                  value={profile.fullName}
                  onChange={(event) =>
                    setProfile({ ...profile, fullName: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Chức danh">
                <Input
                  value={profile.title}
                  onChange={(event) =>
                    setProfile({ ...profile, title: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Giới thiệu">
                <Textarea
                  value={profile.bio}
                  onChange={(event) =>
                    setProfile({ ...profile, bio: event.target.value })
                  }
                  required
                  rows={4}
                />
              </FormField>
              {Object.keys(profileFieldLabels).map((field) => (
                <FormField key={field} label={profileFieldLabels[field]}>
                  <Input
                    value={String(profile[field as keyof ProfileForm] || "")}
                    onChange={(event) =>
                      setProfile({ ...profile, [field]: event.target.value })
                    }
                  />
                </FormField>
              ))}
              <Button type="submit" className="w-full">
                <Plus />
                {editingProfileId ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
              </Button>
            </form>

            <ItemList>
              {profiles.map((item) => (
                <AdminItem key={item.id}>
                  <div>
                    <p className="font-medium">{item.fullName}</p>
                    <p className="text-sm text-primary">{item.title}</p>
                  </div>
                  <Actions
                    onEdit={() => {
                      setEditingProfileId(item.id);
                      setProfile({ ...profileForm, ...item });
                    }}
                    onDelete={async () => {
                      try {
                        await api.profiles.remove(item.id);
                        alertSuccess("Đã xóa hồ sơ thành công");
                        await load();
                      } catch (error) {
                        alertError("Có lỗi xảy ra khi xóa hồ sơ");
                      }
                    }}
                  />
                </AdminItem>
              ))}
            </ItemList>
          </AdminPanel>

          <AdminPanel title="Dự án" label="Portfolio">
            <form onSubmit={saveProject} className="space-y-4">
              <FormField label="Tên dự án">
                <Input
                  value={project.title}
                  onChange={(event) =>
                    setProject({ ...project, title: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Mô tả">
                <Textarea
                  value={project.description}
                  onChange={(event) =>
                    setProject({ ...project, description: event.target.value })
                  }
                  required
                  rows={4}
                />
              </FormField>
              <FormField label="Ảnh (URL)">
                <Input
                  value={project.image || ""}
                  onChange={(event) =>
                    setProject({ ...project, image: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Công nghệ (phân cách bằng dấu phẩy)">
                <Input
                  value={project.technologiesText}
                  onChange={(event) =>
                    setProject({
                      ...project,
                      technologiesText: event.target.value,
                    })
                  }
                />
              </FormField>
              <FormField label="GitHub URL">
                <Input
                  value={project.githubUrl || ""}
                  onChange={(event) =>
                    setProject({ ...project, githubUrl: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Demo URL">
                <Input
                  value={project.demoUrl || ""}
                  onChange={(event) =>
                    setProject({ ...project, demoUrl: event.target.value })
                  }
                />
              </FormField>
              <Button type="submit" className="w-full">
                <Plus />
                {editingProjectId ? "Cập nhật dự án" : "Tạo dự án"}
              </Button>
            </form>

            <ItemList>
              {projects.map((item) => (
                <AdminItem key={item.id}>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(item.technologies || []).map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Actions
                    onEdit={() => {
                      setEditingProjectId(item.id);
                      setProject({
                        ...projectForm,
                        ...item,
                        technologiesText: (item.technologies || []).join(", "),
                      });
                    }}
                    onDelete={async () => {
                      try {
                        await api.projects.remove(item.id);
                        alertSuccess("Đã xóa dự án thành công");
                        await load();
                      } catch (error) {
                        alertError("Có lỗi xảy ra khi xóa dự án");
                      }
                    }}
                  />
                </AdminItem>
              ))}
            </ItemList>
          </AdminPanel>

          <AdminPanel title="Kỹ năng" label="Chuyên môn">
            <form onSubmit={saveSkill} className="space-y-4">
              <FormField label="Tên kỹ năng">
                <Input
                  value={skill.name}
                  onChange={(event) =>
                    setSkill({ ...skill, name: event.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Danh mục">
                <Input
                  value={skill.category || ""}
                  onChange={(event) =>
                    setSkill({ ...skill, category: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Icon">
                <Input
                  value={skill.icon || ""}
                  onChange={(event) =>
                    setSkill({ ...skill, icon: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Mức độ (%)">
                <Input
                  type="number"
                  value={skill.level || 0}
                  onChange={(event) =>
                    setSkill({ ...skill, level: Number(event.target.value) })
                  }
                />
              </FormField>
              <FormField label="Thứ tự">
                <Input
                  type="number"
                  value={skill.order || 0}
                  onChange={(event) =>
                    setSkill({ ...skill, order: Number(event.target.value) })
                  }
                />
              </FormField>
              <Button type="submit" className="w-full">
                <Plus />
                {editingSkillId ? "Cập nhật kỹ năng" : "Tạo kỹ năng"}
              </Button>
            </form>

            <ItemList>
              {skills.map((item) => (
                <AdminItem key={item.id}>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-primary">
                      {item.category || "Kỹ năng"} · {item.level || 0}%
                    </p>
                  </div>
                  <Actions
                    onEdit={() => {
                      setEditingSkillId(item.id);
                      setSkill({ ...skillForm, ...item });
                    }}
                    onDelete={async () => {
                      try {
                        await api.skills.remove(item.id);
                        alertSuccess("Đã xóa kỹ năng thành công");
                        await load();
                      } catch (error) {
                        alertError("Có lỗi xảy ra khi xóa kỹ năng");
                      }
                    }}
                  />
                </AdminItem>
              ))}
            </ItemList>
          </AdminPanel>

          <div className="lg:col-span-3">
            <AdminPanel title="Tin nhắn liên hệ" label="Hộp thư">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((item) => (
                  <DecoFrame
                    key={item.id}
                    accent={!item.isRead}
                    className="p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-primary">{item.email}</p>
                        </div>
                        <Badge
                          variant={item.isRead ? "secondary" : "destructive"}
                          size="sm"
                        >
                          {item.isRead ? "Đã đọc" : "Mới"}
                        </Badge>
                      </div>
                      <Separator className="bg-primary/25" />
                      <p className="text-sm font-medium">
                        {item.subject || "Không có tiêu đề"}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.contacts.update(item.id, {
                                isRead: true,
                              });
                              alertSuccess("Đã đánh dấu tin nhắn là đã đọc");
                              await load();
                            } catch (error) {
                              alertError("Có lỗi xảy ra khi đánh dấu tin nhắn");
                            }
                          }}
                        >
                          <MailCheck />
                          Đánh dấu đã đọc
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await api.contacts.remove(item.id);
                              alertSuccess("Đã xóa tin nhắn thành công");
                              await load();
                            } catch (error) {
                              alertError("Có lỗi xảy ra khi xóa tin nhắn");
                            }
                          }}
                          aria-label="Xóa tin nhắn"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </DecoFrame>
                ))}
              </div>
            </AdminPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <DecoFrame className="h-full p-6">
      <SectionHeading label={label} title={title} />
      <div className="mt-6">{children}</div>
    </DecoFrame>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ItemList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 space-y-2">
      <Separator className="bg-primary/30" />
      {children}
    </div>
  );
}

function AdminItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border border-border bg-muted/30 p-3">
      {children}
    </div>
  );
}

function Actions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onEdit}
        aria-label="Chỉnh sửa"
      >
        <Edit />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onDelete}
        aria-label="Xóa"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
