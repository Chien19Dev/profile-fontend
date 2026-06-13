import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

const ADMIN_MUTATION_PREFIXES = [
  "/api/profile",
  "/api/projects",
  "/api/skills",
  "/api/contact",
  "/api/posts",
  "/api/testimonials",
  "/api/upload",
];

function isAdminMutation(pathname: string, method: string) {
  if (!MUTATING_METHODS.has(method)) return false;
  return ADMIN_MUTATION_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAdminRead(pathname: string, method: string) {
  if (method !== "GET") return false;
  return (
    pathname === "/api/contact" ||
    pathname === "/api/posts" ||
    pathname === "/api/profile"
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  if (pathname.startsWith("/api/auth")) {
    const { success } = rateLimit(`auth:${ip}`, 20, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429 },
      );
    }
  }

  if (pathname === "/api/contact" && req.method === "POST") {
    const { success } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Quá nhiều tin nhắn. Vui lòng thử lại sau." },
        { status: 429 },
      );
    }
  }

  if (pathname === "/api/upload" && req.method === "POST") {
    const { success } = rateLimit(`upload:${ip}`, 30, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Quá nhiều lần tải lên. Vui lòng thử lại sau." },
        { status: 429 },
      );
    }
  }

  const needsAdmin =
    pathname.startsWith("/admin") ||
    isAdminMutation(pathname, req.method) ||
    isAdminRead(pathname, req.method);

  if (needsAdmin && !isAdminEmail(req.auth?.user?.email)) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/contact",
    "/api/contact/:path*",
    "/api/upload",
    "/api/profile",
    "/api/profile/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/api/skills",
    "/api/skills/:path*",
    "/api/posts",
    "/api/posts/:path*",
    "/api/testimonials",
    "/api/testimonials/:path*",
  ],
};
