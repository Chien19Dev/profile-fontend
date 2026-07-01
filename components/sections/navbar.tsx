"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Upload,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./button-theme";

const defaultNavLinks = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

interface NavbarProps {
  cvExistsInitial?: boolean;
  navItems?: { label: string; href: string; icon?: string | null }[];
  isAdmin?: boolean;
}

export default function Navbar({
  cvExistsInitial = false,
  navItems,
  isAdmin: serverIsAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cvExists, setCvExists] = useState(cvExistsInitial);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = serverIsAdmin ?? session?.user?.role === "ADMIN";

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await fetch("/api/profile/cv", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCvExists(true);
      } else {
        alert("Failed to upload CV");
      }
    } catch (error) {
      alert("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleViewCv = async () => {
    try {
      window.open("/cv", "_blank");
    } catch (error) {
      alert("Failed to view CV");
    }
  };

  const [dynamicNavLinks, setDynamicNavLinks] = useState<
    { href: string; label: string; icon: any }[]
  >([]);
  const [navLoaded, setNavLoaded] = useState(false);

  useEffect(() => {
    let links: { href: string; label: string; icon: any }[];
    if (navItems && navItems.length > 0) {
      const iconMap: Record<string, any> = { Home, BookOpen, LayoutDashboard };
      links = navItems.map((item) => ({
        href: item.href,
        label: item.label,
        icon: (item.icon && iconMap[item.icon]) || Home,
      }));
    } else {
      links = [...defaultNavLinks];
    }
    if (!links.find((l) => l.href === "/admin")) {
      links.push({ href: "/admin", label: "Quản trị", icon: LayoutDashboard });
    }
    setDynamicNavLinks(links);
    setNavLoaded(true);
  }, [navItems]);

  const navLinks = navLoaded ? dynamicNavLinks : defaultNavLinks;

  const visibleNavLinks = navLinks.filter(
    (link) => link.href !== "/admin" || isAdmin,
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/92 backdrop-blur-md supports-backdrop-filter:bg-background/75">
      <div className="deco-nav-line" />
      <nav className="container mx-auto max-w-330">
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
            {cvExists ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewCv}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                <span>Xem CV</span>
              </Button>
            ) : isAdmin ? (
              <Fragment>
                <input
                  type="file"
                  id="cv-upload-desktop"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    document.getElementById("cv-upload-desktop")?.click()
                  }
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? "Đang tải..." : "Tải CV lên"}</span>
                </Button>
              </Fragment>
            ) : null}
            {status === "loading" ? null : session ? (
              <Fragment>
                <Link
                  href={`/profile/${session.user?.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || "Hồ sơ"}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </Fragment>
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

          <Button
            variant="ghost"
            size="sm"
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
          </Button>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-80 pb-4" : "max-h-0",
          )}
        >
          <div className="space-y-3 pt-3 border-t border-border flex flex-col">
            {visibleNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {cvExists ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleViewCv();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-start gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-0 py-1 h-auto"
              >
                <FileText className="h-4 w-4" />
                <span>Xem CV</span>
              </Button>
            ) : isAdmin ? (
              <Fragment>
                <input
                  type="file"
                  id="cv-upload-mobile"
                  accept=".pdf"
                  onChange={(e) => {
                    handleCvUpload(e);
                    setMobileMenuOpen(false);
                  }}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    document.getElementById("cv-upload-mobile")?.click()
                  }
                  disabled={uploading}
                  className="flex items-center justify-start gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-0 py-1 h-auto"
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? "Đang tải..." : "Tải CV lên"}</span>
                </Button>
              </Fragment>
            ) : null}
            {status === "loading" ? null : session ? (
              <Fragment>
                <Link
                  href={`/profile/${session.user?.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || "Hồ sơ"}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-0 py-1 h-auto"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </Fragment>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground">Giao diện</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
      <div className="deco-nav-line opacity-60" />
    </header>
  );
}
