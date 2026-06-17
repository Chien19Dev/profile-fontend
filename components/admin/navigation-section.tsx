"use client";

import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { api, Navigation } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavForm = Omit<Navigation, "id" | "createdAt" | "updatedAt">;

const emptyForm: NavForm = {
  label: "",
  href: "",
  icon: "",
  order: 0,
  isActive: true,
};

export function NavigationSection() {
  const [items, setItems] = useState<Navigation[]>([]);
  const [form, setForm] = useState<NavForm>(emptyForm);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await api.navigation.list();
      setItems(data);
    } catch {
      alertError("Lỗi khi tải điều hướng");
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
        await api.navigation.update(editingId, payload);
        alertSuccess("Đã cập nhật điều hướng");
      } else {
        await api.navigation.create(payload);
        alertSuccess("Đã tạo điều hướng");
      }
      setForm(emptyForm);
      setEditingId("");
      await load();
    } catch {
      alertError("Có lỗi xảy ra khi lưu điều hướng");
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const current = items[index];
    const swap = items[swapIndex];

    try {
      await Promise.all([
        api.navigation.update(current.id, { order: swap.order || 0 }),
        api.navigation.update(swap.id, { order: current.order || 0 }),
      ]);
      await load();
    } catch {
      alertError("Lỗi khi sắp xếp");
    }
  }

  return (
    <WorkspaceSplit
      form={
        <form onSubmit={handleSubmit} className="space-y-2">
          <WsField label="Nhãn">
            <Input
              size="lg"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </WsField>
          <WsField label="Đường dẫn (href)">
            <Input
              size="lg"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/blog"
              required
            />
          </WsField>
          <WsField label="Icon (tên Lucide)">
            <Input
              size="lg"
              value={form.icon || ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="BookOpen"
            />
          </WsField>
          <WsField label="Thứ tự">
            <Input
              size="lg"
              type="number"
              value={form.order || 0}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </WsField>
          <WsField label="Hiển thị">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive !== false}
                onCheckedChange={(checked: boolean) =>
                  setForm({ ...form, isActive: checked })
                }
              />
              <Label className="text-sm text-muted-foreground">
                {form.isActive !== false ? "Hiện" : "Ẩn"}
              </Label>
            </div>
          </WsField>
          <WsSubmit
            isEditing={!!editingId}
            label="điều hướng"
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
          cols={["Nhãn", "Đường dẫn", "Thứ tự"]}
          rows={items.map((item, index) => ({
            key: item.id,
            cells: [
              <div key="label" className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${item.isActive !== false ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                <p className="text-sm font-medium">{item.label}</p>
              </div>,
              <span
                key="href"
                className="text-xs text-muted-foreground font-mono"
              >
                {item.href}
              </span>,
              <div key="order" className="flex items-center gap-1">
                <span className="text-xs tabular-nums">{item.order ?? 0}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleReorder(item.id, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="size-3" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleReorder(item.id, "down")}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="size-3" />
                </Button>
              </div>,
            ],
            onEdit: () => {
              setEditingId(item.id);
              setForm({
                label: item.label,
                href: item.href,
                icon: item.icon || "",
                order: item.order || 0,
                isActive: item.isActive !== false,
              });
            },
            onDelete: async () => {
              try {
                await api.navigation.remove(item.id);
                alertSuccess("Đã xóa điều hướng");
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
