"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Shield, Sparkles, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DecoFrame } from "@/components/sections/deco-frame";
import { LoginFormAnimation } from "./login-form-animation";
import { PasswordInput } from "@/components/ui/password-input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
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
                    Bảo mật với mật khẩu mã hóa
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center border border-border bg-primary/10 text-primary">
                    <Sparkles className="size-3" />
                  </div>
                  <span className="text-muted-foreground">
                    Truy cập quản trị cho email được ủy quyền
                  </span>
                </div>
              </div>
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
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-4"
                  size="lg"
                  disabled={loading}
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
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Bằng cách đăng nhập, bạn đồng ý với điều khoản dịch vụ và
                  chính sách bảo mật của chúng tôi
                </p>
              </div>
            </div>
          </DecoFrame>
        </LoginFormAnimation>
      </div>
    </div>
  );
}
