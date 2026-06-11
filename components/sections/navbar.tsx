"use client";

import { useState } from "react";
import { Home, LayoutDashboard, Menu, X, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./button-theme";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const navLinks = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/admin", label: "Quản trị", icon: LayoutDashboard },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const visibleNavLinks = navLinks.filter(
    (link) => link.href !== "/admin" || isAdmin
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/92 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="deco-nav-line" />
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex flex-col gap-0.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="deco-eyebrow text-[0.6rem]">Portfolio</span>
            <span className="deco-title text-lg md:text-xl text-foreground transition-colors group-hover:text-primary">
              Nguyễn Đình Chiến
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {visibleNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {status === "loading" ? null : session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <ModeToggle />
          </div>

          <button
            type="button"
            className="md:hidden p-2 border border-border text-foreground transition-colors hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0",
          )}
        >
          <div className="space-y-3 pt-3 border-t border-border">
            {visibleNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {status === "loading" ? null : session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </nav>
      <div className="deco-nav-line opacity-60" />
    </header>
  );
}
