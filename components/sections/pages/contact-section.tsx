"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import SendIcon from "@mui/icons-material/Send";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "../admin/admin-section-heading";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { alertSuccess } from "@/lib/alerts";

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
        alertSuccess("Tin nhắn đã được gửi thành công.");
        setSending(false);
      }, 1000);
      return;
    }

    try {
      await api.contacts.create(form);
      setForm(emptyForm);
      alertSuccess("Tin nhắn đã được gửi thành công.");
    } finally {
      setSending(false);
    }
  }

  return (
    <DecoFrame accent className="p-6 md:p-8" id="contact">
      <SectionHeading label="Kết nối" title="Liên hệ" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="sr-only" aria-hidden="true">
          <Input
            size="lg"
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
            <TextField
              label="Họ và tên"
              variant="outlined"
              value={form.name}
              onChange={field("name")}
              required
              fullWidth
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={form.email}
              onChange={field("email")}
              required
              fullWidth
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <TextField
              label="Tiêu đề"
              variant="outlined"
              value={form.subject}
              onChange={field("subject")}
              fullWidth
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <TextField
              label="Nội dung tin nhắn"
              variant="outlined"
              value={form.message}
              onChange={field("message")}
              required
              fullWidth
              multiline
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="contained"
            type="submit"
            disabled={sending}
            startIcon={
              sending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <SendIcon fontSize="small" />
              )
            }
          >
            {sending ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </div>
      </form>
    </DecoFrame>
  );
}
