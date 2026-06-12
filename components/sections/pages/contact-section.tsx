"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "../admin/admin-section-heading";

const emptyForm = { name: "", email: "", subject: "", message: "" };

export function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  function field(key: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setNotice("");

    if (honeypot) {
      setTimeout(() => {
        setForm(emptyForm);
        setNotice("Tin nhắn đã được gửi thành công.");
        setSending(false);
      }, 1000);
      return;
    }

    try {
      await api.contacts.create(form);
      setForm(emptyForm);
      setNotice("Tin nhắn đã được gửi thành công.");
    } finally {
      setSending(false);
    }
  }

  return (
    <DecoFrame accent className="p-6 md:p-8" id="contact">
      <SectionHeading label="Kết nối" title="Liên hệ" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="sr-only" aria-hidden="true">
          <input
              type="text"
              name="system_mail_honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Họ tên</Label>
            <Input
              id="contact-name"
              size="lg"
              value={form.name}
              onChange={field("name")}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              size="lg"
              type="email"
              value={form.email}
              onChange={field("email")}
              required
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contact-subject">Tiêu đề</Label>
            <Input
              id="contact-subject"
              size="lg"
              value={form.subject}
              onChange={field("subject")}
              placeholder="Chủ đề tin nhắn"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contact-message">Nội dung</Label>
            <Textarea
              id="contact-message"
              size="lg"
              value={form.message}
              onChange={field("message")}
              required
              rows={4}
              placeholder="Nội dung tin nhắn..."
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={sending}>
            {sending ? <Loader2 className="animate-spin" /> : <Send />}
            Gửi tin nhắn
          </Button>

          {notice && (
            <Alert variant="success" className="flex-1 min-w-50">
              <AlertDescription>{notice}</AlertDescription>
            </Alert>
          )}
        </div>
      </form>
    </DecoFrame>
  );
}
