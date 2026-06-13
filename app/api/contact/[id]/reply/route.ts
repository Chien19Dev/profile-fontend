import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Verify contact exists
    const contact = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 },
      );
    }

    const reply = await prisma.contactReply.create({
      data: {
        contactId: id,
        adminId: session.user.id,
        message: message.trim(),
      },
      include: {
        admin: { select: { name: true, email: true } },
      },
    });

    // Mark contact as read
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 },
    );
  }
}
