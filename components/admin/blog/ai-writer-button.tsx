"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogBackdrop,
    DialogPortal,
    DialogPrimitive,
    DialogViewport,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectButton,
    SelectItem,
    SelectPopup,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ClipboardList,
    GripVertical,
    Loader2,
    PenLine,
    RotateCcw,
    Sparkles,
    X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface OutlineItem {
  level: "H2" | "H3";
  title: string;
  parent?: number;
}

interface AiConfig {
  keyword: string;
  title: string;
  style: string;
  length: string;
}

export interface AiWriterResult {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
}

interface AiWriterButtonProps {
  onApply: (result: AiWriterResult) => void;
  existingTitle?: string;
}

type View = "config" | "content";

const WRITING_STYLES = [
  { value: "seo", label: "Tối ưu hóa SEO" },
  { value: "friendly", label: "Thân thiện" },
  { value: "professional", label: "Chuyên nghiệp" },
];

const LENGTH_OPTIONS = [
  { value: "500-1000", label: "Từ 500 - 1000 từ" },
  { value: "1000-1500", label: "Từ 1000 - 1500 từ" },
  { value: "1500-2000", label: "Từ 1500 - 2000 từ" },
  { value: "2000-3000", label: "Từ 2000 - 3000 từ" },
];

export function AiWriterButton({
  onApply,
  existingTitle,
}: AiWriterButtonProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("config");

  // Always-fresh ref for the callback — never stale
  const onApplyRef = useRef(onApply);
  useEffect(() => {
    onApplyRef.current = onApply;
  }, [onApply]);

  const [config, setConfig] = useState<AiConfig>({
    keyword: "",
    title: existingTitle || "",
    style: "seo",
    length: "1000-1500",
  });

  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [generatedContent, setGeneratedContent] =
    useState<AiWriterResult | null>(null);
  const generatedContentRef = useRef<AiWriterResult | null>(null);
  const applyingRef = useRef(false);
  const [notes, setNotes] = useState("");
  const [editOutline, setEditOutline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const configValid = config.keyword.trim() && config.title.trim();

  const resetAll = useCallback(() => {
    setOutline([]);
    setGeneratedContent(null);
    generatedContentRef.current = null;
    setNotes("");
    setEditOutline(false);
    setError("");
    setView("config");
  }, []);

  const handleClose = useCallback(() => {
    if (applyingRef.current) return;
    setOpen(false);
    setTimeout(() => resetAll(), 150);
  }, [resetAll]);

  const handleGenerateOutline = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, step: "outline" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi tạo dàn ý");
      setOutline(data.outline || []);
      setView("content");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  }, [config]);

  const handleGenerateContent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          outline,
          notes,
          step: "content",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi tạo nội dung");
      setGeneratedContent({
        title: data.title || config.title,
        slug: data.slug || "",
        summary: data.summary || "",
        content: data.content || "",
        tags: data.tags || [],
      });
      generatedContentRef.current = {
        title: data.title || config.title,
        slug: data.slug || "",
        summary: data.summary || "",
        content: data.content || "",
        tags: data.tags || [],
      };
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  }, [config, outline, notes]);

  const handleApply = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const result = generatedContentRef.current;
      if (!result) {
        console.warn("[AiWriter] handleApply: no generatedContent");
        return;
      }
      applyingRef.current = true;
      flushSync(() => {
        onApplyRef.current(result);
      });
      setOpen(false);
      setTimeout(() => {
        applyingRef.current = false;
        resetAll();
      }, 200);
    },
    [resetAll],
  );

  const isContent = view === "content";

  return (
    <Fragment>
      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={() => {
          setConfig((c) => ({ ...c, title: existingTitle || c.title }));
          setOpen(true);
        }}
      >
        <Sparkles className="size-3.5" />
        Viết bài bằng AI
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) handleClose();
        }}
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogViewport className={cn(isContent && "p-2 sm:p-4")}>
            <DialogPrimitive.Popup
              className={cn(
                "relative row-start-2 flex max-h-full min-h-0 w-full origin-center flex-col rounded-2xl border bg-background text-foreground shadow-2xl outline-none",
                "transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform",
                "data-ending-style:opacity-0 data-starting-style:opacity-0",
                isContent ? "max-w-6xl" : "max-w-lg",
              )}
              data-slot="dialog-popup"
            >
              <DialogPrimitive.Close
                aria-label="Close"
                className="absolute inset-e-3 top-3 z-10 rounded-full p-1 text-white/80 hover:text-white transition"
                render={<Button size="icon" variant="ghost" />}
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
              {view === "config" && (
                <Fragment>
                  <div className="bg-primary rounded-t-2xl px-6 py-4 shrink-0">
                    <h2 className="text-white font-bold text-lg tracking-wide">
                      CẤU HÌNH THÔNG TIN
                    </h2>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto flex-1">
                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Từ khóa mục tiêu{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={config.keyword}
                        onChange={(e) =>
                          setConfig((c) => ({ ...c, keyword: e.target.value }))
                        }
                        placeholder="Từ khóa mục tiêu"
                        className="blog-luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Tiêu đề bài viết{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={config.title}
                        onChange={(e) =>
                          setConfig((c) => ({ ...c, title: e.target.value }))
                        }
                        placeholder="Tiêu đề bài viết"
                        className="blog-luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Phong cách viết
                      </label>
                      <Select
                        value={config.style}
                        onValueChange={(v) =>
                          setConfig((c) => ({ ...c, style: String(v) }))
                        }
                      >
                        <SelectButton className="w-full">
                          <SelectValue placeholder="Chọn phong cách" />
                        </SelectButton>
                        <SelectPopup>
                          {WRITING_STYLES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Độ dài
                      </label>
                      <Select
                        value={config.length}
                        onValueChange={(v) =>
                          setConfig((c) => ({ ...c, length: String(v) }))
                        }
                      >
                        <SelectButton className="w-full">
                          <SelectValue placeholder="Chọn độ dài" />
                        </SelectButton>
                        <SelectPopup>
                          {LENGTH_OPTIONS.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 shrink-0">
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      disabled={!configValid || loading}
                      className="w-full rounded-lg gap-2"
                      onClick={handleGenerateOutline}
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      Tạo dàn ý
                    </Button>
                  </div>
                </Fragment>
              )}
              {view === "content" && (
                <div className="flex flex-col max-h-[90vh] overflow-hidden rounded-2xl">
                  <div className="bg-primary px-6 py-4 flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => resetAll()}
                      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition"
                    >
                      <ArrowLeft className="size-4" />
                      Quay lại
                    </button>
                    <h2 className="text-white font-bold text-lg tracking-wide">
                      NỘI DUNG BÀI VIẾT
                    </h2>
                  </div>

                  {error && (
                    <div className="mx-6 mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive shrink-0">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-1 min-h-0 overflow-hidden">
                    <div className="w-85 shrink-0 border-r border-border flex flex-col overflow-hidden bg-muted">
                      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                        <span className="font-bold text-sm tracking-wide text-foreground">
                          DÀN Ý BÀI VIẾT
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Chỉnh sửa dàn ý
                          </span>
                          <Switch
                            checked={editOutline}
                            onCheckedChange={setEditOutline}
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {outline.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Chưa có dàn ý
                          </p>
                        ) : (
                          outline.map((item, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "flex items-start gap-2 py-1.5 px-2 rounded-md text-sm",
                                item.level === "H3" && "pl-6",
                              )}
                            >
                              <GripVertical className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                              <span
                                className={cn(
                                  "text-xs font-bold shrink-0",
                                  item.level === "H2"
                                    ? "text-red-600"
                                    : "text-blue-600",
                                )}
                              >
                                {item.level}
                              </span>
                              {editOutline ? (
                                <input
                                  value={item.title}
                                  onChange={(e) => {
                                    const next = [...outline];
                                    next[idx] = {
                                      ...item,
                                      title: e.target.value,
                                    };
                                    setOutline(next);
                                  }}
                                  className="flex-1 min-w-0 text-sm bg-transparent border-b border-border outline-none focus:border-destructive"
                                />
                              ) : (
                                <span className="text-sm text-foreground wrap-break-word min-w-0">
                                  {item.title}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="border-t border-border p-4 shrink-0">
                        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                          Ghi chú thêm
                        </label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Thêm ghi chú cho AI..."
                          rows={3}
                          className="text-sm resize-none border-input"
                        />
                      </div>

                      <div className="border-t border-border p-4 flex gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={loading || !generatedContent}
                          className="flex-1 gap-1.5 rounded-lg"
                          onClick={handleGenerateContent}
                        >
                          {loading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="size-3.5" />
                          )}
                          Viết lại
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          disabled={!generatedContent}
                          className="flex-1 gap-1.5 rounded-lg"
                          onClick={handleApply}
                        >
                          <ClipboardList className="size-3.5" />
                          Áp dụng
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden bg-card">
                      <div className="p-4 border-b border-border shrink-0">
                        <span className="font-bold text-sm tracking-wide text-foreground">
                          NỘI DUNG BÀI VIẾT
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6">
                        {!generatedContent && !loading && (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <PenLine className="size-10 mb-3 opacity-30" />
                            <p className="text-sm">
                              Nhấn &quot;Viết bài&quot; để tạo nội dung
                            </p>
                          </div>
                        )}

                        {loading && !generatedContent && (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="size-8 animate-spin mb-3" />
                            <p className="text-sm">AI đang tạo nội dung...</p>
                          </div>
                        )}

                        {generatedContent && (
                          <div
                            className="ai-content-preview blog-content"
                            dangerouslySetInnerHTML={{
                              __html: generatedContent.content,
                            }}
                          />
                        )}
                      </div>

                      {!generatedContent && !loading && (
                        <div className="border-t border-border p-4 shrink-0">
                          <Button
                            type="button"
                            size="lg"
                            className="gap-2 rounded-lg bg-invert hover:bg-invert/90 text-invert-foreground"
                            disabled={loading}
                            onClick={handleGenerateContent}
                          >
                            <PenLine className="size-4" />
                            Viết bài
                          </Button>
                        </div>
                      )}

                      {loading && !generatedContent && (
                        <div className="border-t border-border p-4 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogPrimitive.Popup>
          </DialogViewport>
        </DialogPortal>
      </Dialog>
    </Fragment>
  );
}
