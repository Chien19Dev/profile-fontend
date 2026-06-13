import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial unread count
      async function sendUpdate() {
        try {
          const unreadCount = await prisma.notification.count({
            where: { isRead: false },
          });
          const data = `data: ${JSON.stringify({ unreadCount })}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch {
          // DB error, skip this update
        }
      }

      await sendUpdate();

      // Poll every 5 seconds for new notifications
      const interval = setInterval(async () => {
        await sendUpdate();
      }, 5000);

      // Clean up on close
      const closeHandler = () => {
        clearInterval(interval);
        controller.close();
      };

      // Keep connection alive with a heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
          clearInterval(interval);
        }
      }, 30000);

      // Close after 5 minutes to prevent memory leaks
      setTimeout(() => {
        clearInterval(interval);
        clearInterval(heartbeat);
        closeHandler();
      }, 5 * 60 * 1000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
