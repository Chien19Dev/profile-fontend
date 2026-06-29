import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Project } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WsTable } from "@/components/admin/ws-table";
import { ProjectEditDialog } from "@/components/sections/admin/project-edit-dialog";
import { ProjectDetailDialog } from "@/components/sections/pages/project-detail-dialog";
import { Plus } from "lucide-react";

type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
  images: string[];
};

const emptyProject: ProjectForm = {
  title: "",
  description: "",
  images: [],
  githubUrl: "",
  demoUrl: "",
  technologies: [],
  technologiesText: "",
};

interface Props {
  projects: Project[];
  onReload: () => void;
  loading?: boolean;
}

export function ProjectsSection({
  projects,
  onReload,
  loading,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<ProjectForm>(emptyProject);
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const handleOpenDialog = (isEdit = false) => {
    if (!isEdit) {
      setForm(emptyProject);
      setEditingId("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptyProject);
    setEditingId("");
  };

  const handleEdit = (item: Project) => {
    setForm({
      ...emptyProject,
      ...item,
      images: (item as any).images || [],
      technologiesText: (item.technologies || []).join(", "),
    } as ProjectForm);
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (imageUploading) {
      alertError("Đang tải ảnh lên, vui lòng đợi...");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologiesText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    delete (payload as Partial<ProjectForm>).technologiesText;

    try {
      if (editingId) {
        await api.projects.update(editingId, payload);
        alertSuccess("Đã cập nhật dự án");
      } else {
        await api.projects.create(payload);
        alertSuccess("Đã tạo dự án");
      }
      handleCloseDialog();
      onReload();
    } catch {
      alertError("Có lỗi xảy ra khi lưu dự án");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Fragment>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Danh sách dự án</h2>
          <Button onClick={() => handleOpenDialog(false)}>
            <Plus className="size-4 mr-2" />
            Tạo mới
          </Button>
        </div>
        <WsTable
          cols={["Dự án", "Công nghệ"]}
          loading={loading}
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
            onEdit: () => handleEdit(item),
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
        <ProjectEditDialog
          project={form}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onChange={setForm}
          onSave={handleSave}
          isEditing={!!editingId}
          onImageUploadingChange={setImageUploading}
          loading={saving}
        />
      </div>
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
