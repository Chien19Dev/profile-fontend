import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ bookmarked: false });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    return NextResponse.json({ bookmarked: !!existing });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json({ bookmarked: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    } else {
      const bookmark = await prisma.bookmark.create({
        data: { userId: session.user.id, postId },
      });
      return NextResponse.json({ bookmarked: true, id: bookmark.id });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 },
    );
  }
}
