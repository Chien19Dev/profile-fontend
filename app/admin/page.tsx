import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminContent from "./admin-content"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.email !== ADMIN_EMAIL) {
    redirect("/")
  }

  return <AdminContent />
}
