import { isGoogleAuthEnabled } from "@/lib/auth";
import type { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản để bình luận và tương tác với nội dung.",
};

export default function RegisterPage() {
  return <RegisterForm googleEnabled={isGoogleAuthEnabled} />;
}
