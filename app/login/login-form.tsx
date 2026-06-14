"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lock, Mail, Shield, Sparkles, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { LoginFormAnimation } from "./login-form-animation";

interface LoginFormProps {
  googleEnabled: boolean;
}

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");

  const initialError =
    authError === "AccessDenied"
      ? "Chỉ email admin được phép đăng nhập bằng Google."
      : authError
        ? "Đăng nhập thất bại. Vui lòng thử lại."
        : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError("");
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="deco-page relative min-h-screen flex items-start justify-center px-4">
      <div className="relative z-10 w-full max-w-md">
        <LoginFormAnimation>
          <DecoFrame accent className="p-4 md:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full border border-border bg-muted/40 text-primary">
                  <Lock className="size-7" />
                </div>
                <div>
                  <p className="deco-eyebrow mb-2">Xác thực</p>
                  <h1 className="deco-title text-3xl md:text-4xl text-foreground">
                    Đăng nhập
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Đăng nhập để truy cập trang quản trị và quản lý hồ sơ của bạn
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                    <Shield className="size-3" />
                  </div>
                  <span className="text-muted-foreground">
                    Bảo mật với mật khẩu mã hóa hoặc Google OAuth
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                    <Sparkles className="size-3" />
                  </div>
                  <span className="text-muted-foreground">
                    Chỉ email admin được ủy quyền truy cập quản trị
                  </span>
                </div>
              </div>

              {googleEnabled && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-12"
                    disabled={googleLoading || loading}
                    onClick={handleGoogleSignIn}
                  >
                    {googleLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <>
                        <FaGoogle className="size-4" />
                        Đăng nhập với Google
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      hoặc
                    </span>
                    <Separator className="flex-1" />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      size="lg"
                      placeholder="email@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <PasswordInput id="password" name="password" required />
                {(error || initialError) && (
                  <div className="text-sm text-destructive">
                    {error || initialError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-4"
                  size="lg"
                  disabled={loading || googleLoading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  Bằng cách đăng nhập, bạn đồng ý với điều khoản dịch vụ và
                  chính sách bảo mật của chúng tôi
                </p>
                <div className="text-center">
                  <Link
                    href="/register"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    <UserPlus className="size-3.5" />
                    Chưa có tài khoản? Đăng ký
                  </Link>
                </div>
              </div>
            </div>
          </DecoFrame>
        </LoginFormAnimation>
      </div>
    </div>
  );
}
