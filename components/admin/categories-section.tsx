"use client";

import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, ProjectCategory } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";

type CategoryForm = Omit<ProjectCategory, "id" | "createdAt" | "updatedAt">;

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  order: 0,
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await api.categories.list();
      setCategories(data as any[]);
    } catch {
      alertError("Lỗi khi tải danh mục");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        order: Number(form.order || 0),
      };
      if (editingId) {
        await api.categories.update(editingId, payload);
        alertSuccess("Đã cập nhật danh mục");
      } else {
        await api.categories.create(payload);
        alertSuccess("Đã tạo danh mục");
      }
      setForm(emptyForm);
      setEditingId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu danh mục");
    }
  }

  return (
    <WorkspaceSplit
      form={
        <form onSubmit={handleSubmit} className="space-y-2">
          <WsField label="Tên danh mục">
            <Input
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({
                  ...form,
                  name,
                  slug: form.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                });
              }}
              required
            />
          </WsField>
          <WsField label="Slug">
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
          </WsField>
          <WsField label="Mô tả">
            <Textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </WsField>
          <WsField label="Thứ tự">
            <Input
              type="number"
              value={form.order || 0}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </WsField>
          <WsSubmit
            isEditing={!!editingId}
            label="danh mục"
            onCancel={
              editingId
                ? () => {
                    setForm(emptyForm);
                    setEditingId("");
                  }
                : undefined
            }
          />
        </form>
      }
      list={
        <WsTable
          cols={["Danh mục", "Slug", "Dự án"]}
          rows={categories.map((item) => ({
            key: item.id,
            cells: [
              <p key="name" className="text-sm font-medium">
                {item.name}
              </p>,
              <span key="slug" className="text-xs text-muted-foreground font-mono">
                {item.slug}
              </span>,
              <span key="count" className="text-xs tabular-nums text-primary font-medium">
                {item._count?.projects ?? 0}
              </span>,
            ],
            onEdit: () => {
              setEditingId(item.id);
              setForm({
                name: item.name,
                slug: item.slug,
                description: item.description || "",
                order: item.order || 0,
              });
            },
            onDelete: async () => {
              try {
                await api.categories.remove(item.id);
                alertSuccess("Đã xóa danh mục");
                await load();
              } catch {
                alertError("Lỗi khi xóa");
              }
            },
          }))}
        />
      }
    />
  );
}
