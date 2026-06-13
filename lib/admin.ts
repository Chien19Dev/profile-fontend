export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
}

export function isAdminEmail(email?: string | null): boolean {
  const adminEmail = getAdminEmail();
  return !!email && !!adminEmail && email === adminEmail;
}
export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN";
}
export async function checkAdmin() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}
