"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lock, Mail, Shield, Sparkles, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useActionState, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signInWithCredentials } from "./actions";

interface LoginFormProps {
  googleEnabled: boolean;
}

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    null,
  );
  const [googleLoading, setGoogleLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");

  const initialError =
    authError === "AccessDenied"
      ? "Chỉ email admin được phép đăng nhập bằng Google."
      : authError
        ? "Đăng nhập thất bại. Vui lòng thử lại."
        : "";

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="deco-page relative min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md space-y-8">
          <div className="inline-flex items-center justify-center size-20 rounded-full border border-border bg-muted/40 text-primary">
            <Lock className="size-9" />
          </div>
          <div>
            <p className="deco-eyebrow mb-2">Xác thực</p>
            <h1 className="deco-title text-4xl text-foreground">
              Đăng nhập
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Đăng nhập để truy cập trang quản trị và quản lý hồ sơ của bạn.
            Theo dõi bài viết, để lại bình luận và tương tác với nội dung.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                <Shield className="size-4" />
              </div>
              <span className="text-muted-foreground">
                Bảo mật với mật khẩu mã hóa hoặc Google OAuth
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <span className="text-muted-foreground">
                Chỉ email admin được ủy quyền truy cập quản trị
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-full border border-border bg-muted/40 text-primary">
              <Lock className="size-7" />
            </div>
            <div>
              <p className="deco-eyebrow mb-2">Xác thực</p>
              <h1 className="deco-title text-3xl text-foreground">Đăng nhập</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Đăng nhập để truy cập trang quản trị và quản lý hồ sơ của bạn
            </p>
          </div>

          {googleEnabled && (
            <Fragment>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12"
                disabled={googleLoading || isPending}
                onClick={handleGoogleSignIn}
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

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
            {(state?.error || initialError) && (
              <div className="text-sm text-destructive">
                {state?.error || initialError}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              size="lg"
              disabled={isPending || googleLoading}
            >
              {isPending ? (
                <Fragment>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Đang đăng nhập...
                </Fragment>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <div className="space-y-3">
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
      </div>
    </div>
  );
}
