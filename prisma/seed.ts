import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

async function main() {
  const adminEmail = getEnv("ADMIN_EMAIL")
  const adminPassword = getEnv("ADMIN_PASSWORD")

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingUser) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    })
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Nguyễn Đình Chiến",
        role: "ADMIN",
      },
    })
  }
  const projectResult = await prisma.project.updateMany({
    data: { published: true },
  })
  const skillResult = await prisma.skill.updateMany({
    data: { published: true },
  })
  const testimonialResult = await prisma.testimonial.updateMany({
    data: { published: true },
  })
  const existingNav = await prisma.navigation.count()
  if (existingNav === 0) {
    await prisma.navigation.createMany({
      data: [
        { label: "Trang chủ", href: "/", icon: "Home", order: 0, isActive: true },
        { label: "Blog", href: "/blog", icon: "BookOpen", order: 1, isActive: true },
      ],
    })
  }
  const existingCategories = await prisma.projectCategory.count()
  if (existingCategories === 0) {
    await prisma.projectCategory.createMany({
      data: [
        { name: "Web App", slug: "web-app", order: 0 },
        { name: "Mobile App", slug: "mobile-app", order: 1 },
        { name: "UI/UX", slug: "ui-ux", order: 2 },
        { name: "Open Source", slug: "open-source", order: 3 },
      ],
    })
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
