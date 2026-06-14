import { isGoogleAuthEnabled } from "@/lib/auth";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm googleEnabled={isGoogleAuthEnabled} />
    </Suspense>
  );
}
