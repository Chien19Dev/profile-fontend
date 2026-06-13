import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Quá nhiều tin nhắn. Vui lòng thử lại sau." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const contact = await prisma.contactMessage.create({
      data: body,
    });

    await createNotification({
      type: "NEW_CONTACT",
      title: "Tin nhắn liên hệ mới",
      message: `${body.name} đã gửi tin nhắn: ${body.subject || body.message?.slice(0, 50)}`,
      link: "/admin",
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
