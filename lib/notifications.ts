import { prisma } from "@/lib/prisma";

export async function createNotification({
  type,
  title,
  message,
  link,
}: {
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: { type, title, message, link },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}
