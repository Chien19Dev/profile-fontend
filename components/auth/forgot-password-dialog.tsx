"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { alertError, alertSuccess } from "@/lib/alerts";
import { Loader2, Mail, Eye, EyeOff, UserPlus, UserCheck } from "lucide-react";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

type Step = "email" | "reset";

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  email: initialEmail = "",
}: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === "reset" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, step]);

  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail(initialEmail);
      setOtp("");
      setGeneratedOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setCountdown(60);
      setCanResend(false);
    }
  }, [open, initialEmail]);

  async function handleSendOTP() {
    if (!email) {
      alertError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alertError(data.error || "Có lỗi xảy ra");
        return;
      }

      alertSuccess(data.message);

      if (data.otp) {
        setGeneratedOtp(data.otp);
        setOtp(data.otp);
      }

      setStep("reset");
      setCountdown(60);
      setCanResend(false);
    } catch {
      alertError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    setOtp("");
    setCountdown(60);
    setCanResend(false);
    await handleSendOTP();
  }

  async function handleResetPassword() {
    if (!otp || otp.length !== 6) {
      alertError("Vui lòng nhập mã OTP 6 số");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      alertError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      alertError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        alertError(verifyData.error || "Mã OTP không hợp lệ");
        return;
      }
      const resetRes = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const resetData = await resetRes.json();

      if (!resetRes.ok) {
        alertError(resetData.error || "Có lỗi xảy ra");
        return;
      }

      alertSuccess(resetData.message);
      onOpenChange(false);
    } catch {
      alertError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-sm p-3">
        {step === "email" && (
          <div className="flex flex-col space-y-4 pt-6">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 border border-primary/20">
                  <Mail className="size-8 text-primary" />
                </div>

                <DialogTitle className="text-2xl font-semibold">
                  Quên mật khẩu
                </DialogTitle>
              </div>

              <p className="text-sm text-muted-foreground">
                Nhập email của bạn để nhận mã OTP
              </p>
            </div>
            <div className="w-full space-y-4">
              <Field>
                <InputGroup>
                  <InputGroupInput
                    size="lg"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                  />
                </InputGroup>
              </Field>
            </div>

            <div className="w-full">
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Fragment>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Đang xử lý...
                  </Fragment>
                ) : (
                  "Gửi mã OTP"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "reset" && (
          <div className="flex flex-col space-y-4 py-6">
            <div className="text-center space-y-2">
              <DialogTitle className="text-2xl">Đặt lại mật khẩu</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Nhập mã OTP và mật khẩu mới
              </p>
            </div>

            <div className="w-full space-y-6">
              <Field>
                <FieldLabel>Tài khoản</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    size="lg"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-muted/50"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Mã OTP</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    size="lg"
                    type="text"
                    value={otp}
                    readOnly
                    className="bg-muted/50"
                    placeholder="Mã OTP sẽ tự động điền"
                    maxLength={6}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Mật khẩu mới</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    size="lg"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Xác nhận mật khẩu</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    size="lg"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
              <div className="text-end text-sm">
                {canResend ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleResendOTP}
                    variant="link"
                    className="text-primary uppercase"
                  >
                    Gửi lại OTP
                  </Button>
                ) : (
                  <span className="text-muted-foreground">
                    Gửi lại sau {countdown}s
                  </span>
                )}
              </div>
              <div className="border-t border-border" />
              <div className="flex gap-2 justify-between">
                <Link href="/register">
                  <Button variant="link" className="text-primary" size="sm">
                    <UserPlus /> Đăng ký ngay
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="link" className="text-primary" size="sm">
                    <UserCheck /> Đăng nhập ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogPopup>
    </Dialog>
  );
}
