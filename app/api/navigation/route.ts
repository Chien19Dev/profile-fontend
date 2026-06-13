import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.navigation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.label || !body.href) {
      return NextResponse.json(
        { error: "Label and href are required" },
        { status: 400 },
      );
    }

    const item = await prisma.navigation.create({
      data: {
        label: body.label,
        href: body.href,
        icon: body.icon || null,
        order: Number(body.order || 0),
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating navigation:", error);
    return NextResponse.json(
      { error: "Failed to create navigation" },
      { status: 500 },
    );
  }
}
