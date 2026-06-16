import type { FormEvent } from "react";
import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api, Project } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";
import { Pattern } from "@/components/upload-file";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectDetailDialog } from "@/components/sections/pages/project-detail-dialog";

type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
  images: string[];
};

interface Props {
  projects: Project[];
  form: ProjectForm;
  editingId: string;
  onChange: (f: ProjectForm) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: (item: Project) => void;
  onReload: () => void;
  emptyForm: ProjectForm;
  setEditingId: (id: string) => void;
  onImageUploadingChange?: (isUploading: boolean) => void;
}

export function ProjectsSection({
  projects,
  form,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onReload,
  emptyForm,
  setEditingId,
  onImageUploadingChange,
}: Props) {
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  return (
    <Fragment>
      <WorkspaceSplit
        form={
          <form onSubmit={onSubmit} className="space-y-2">
            <WsField label="Tên dự án">
              <Input
                value={form.title}
                onChange={(e) => onChange({ ...form, title: e.target.value })}
                required
              />
            </WsField>
            <WsField label="Mô tả">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  onChange({ ...form, description: e.target.value })
                }
                required
                rows={3}
              />
            </WsField>
            <WsField label="Ảnh dự án">
              <Pattern
                maxSize={5 * 1024 * 1024}
                accept="image/*"
                multiple={true}
                value={form.images}
                onUploadComplete={(urls) => onChange({ ...form, images: urls })}
                onUploadingChange={onImageUploadingChange}
              />
            </WsField>
            <WsField label="Công nghệ (phân cách bằng dấu phẩy)">
              <Input
                value={form.technologiesText}
                onChange={(e) =>
                  onChange({ ...form, technologiesText: e.target.value })
                }
              />
            </WsField>
            <WsField label="GitHub URL (tùy chọn)">
              <Input
                value={form.githubUrl || ""}
                onChange={(e) =>
                  onChange({ ...form, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo"
              />
            </WsField>
            <WsField label="Demo URL (tùy chọn)">
              <Input
                value={form.demoUrl || ""}
                onChange={(e) => onChange({ ...form, demoUrl: e.target.value })}
                placeholder="https://your-project-demo.com"
              />
            </WsField>
            <WsField label="Xuất bản">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.published !== false}
                  onCheckedChange={(checked: boolean) => onChange({ ...form, published: checked })}
                />
                <Label className="text-sm text-muted-foreground">
                  {form.published !== false ? "Đã xuất bản" : "Bản nháp"}
                </Label>
              </div>
            </WsField>
            <WsSubmit
              isEditing={!!editingId}
              label="dự án"
              onCancel={
                editingId
                  ? () => {
                      onChange(emptyForm);
                      setEditingId("");
                    }
                  : undefined
              }
            />
          </form>
        }
        list={
          <WsTable
            cols={["Dự án", "Công nghệ"]}
            rows={projects.map((item) => ({
              key: item.id,
              cells: [
                <p key="title" className="text-sm font-medium truncate">
                  {item.title}
                </p>,
                <div key="tags" className="flex flex-wrap gap-1">
                  {(item.technologies || []).slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" size="sm">
                      {t}
                    </Badge>
                  ))}
                  {(item.technologies || []).length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{(item.technologies || []).length - 3}
                    </span>
                  )}
                </div>,
              ],
              onView: () => setDetailProject(item),
              onEdit: () => onEdit(item),
              onDelete: async () => {
                try {
                  await api.projects.remove(item.id);
                  alertSuccess("Đã xóa dự án");
                  onReload();
                } catch {
                  alertError("Lỗi khi xóa");
                }
              },
            }))}
          />
        }
      />

      <ProjectDetailDialog
        project={detailProject}
        open={detailProject !== null}
        onOpenChange={(open) => {
          if (!open) setDetailProject(null);
        }}
      />
    </Fragment>
  );
}
