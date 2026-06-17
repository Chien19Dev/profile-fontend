"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { alertError, alertSuccess } from "@/lib/alerts";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  UserPlus,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { FaGoogle } from "react-icons/fa";

interface RegisterFormProps {
  googleEnabled?: boolean;
}

export default function RegisterForm({
  googleEnabled = false,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alertError("Mật khẩu không khớp");
      return;
    }
    if (password.length < 6) {
      alertError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        alertError(data.error || "Đăng ký thất bại");
        return;
      }
      alertSuccess("Đăng ký thành công! Đang đăng nhập...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/");
      }
    } catch {
      alertError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="deco-page relative min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md space-y-8">
          <div className="inline-flex items-center justify-center size-20 rounded-full border border-border bg-muted/40 text-primary">
            <UserPlus className="size-9" />
          </div>
          <div>
            <p className="deco-eyebrow mb-2">Tài khoản</p>
            <h1 className="deco-title text-4xl text-foreground">Đăng ký</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tạo tài khoản để bình luận, theo dõi bài viết và tương tác với nội
            dung trên trang cá nhân.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                <MessageSquare className="size-4" />
              </div>
              <span className="text-muted-foreground">
                Bình luận và tương tác với các bài viết
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                <Lock className="size-4" />
              </div>
              <span className="text-muted-foreground">
                Đăng ký bằng email hoặc tài khoản Google
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-full border border-border bg-muted/40 text-primary">
              <UserPlus className="size-7" />
            </div>
            <div>
              <p className="deco-eyebrow mb-2">Tài khoản</p>
              <h1 className="deco-title text-3xl text-foreground">Đăng ký</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Tạo tài khoản để bình luận và tương tác với nội dung.
            </p>
          </div>

          {googleEnabled && (
            <Fragment>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full h-12"
                disabled={googleLoading || loading}
                onClick={handleGoogleSignUp}
              >
                {googleLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Fragment>
                    <FaGoogle className="size-4" />
                    Đăng nhập với Google
                  </Fragment>
                )}
              </Button>
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  hoặc
                </span>
                <Separator className="flex-1" />
              </div>
            </Fragment>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Họ tên (tùy chọn)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Mật khẩu *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  variant="ghost"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Xác nhận mật khẩu *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  size="lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-medium"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <Fragment>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Đang đăng ký...
                </Fragment>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
