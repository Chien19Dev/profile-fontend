import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    return NextResponse.json({ liked: !!existing });
  } catch (error) {
    console.error("Error checking like:", error);
    return NextResponse.json({ liked: false });
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

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    } else {
      const like = await prisma.like.create({
        data: { userId: session.user.id, postId },
      });
      return NextResponse.json({ liked: true, id: like.id });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 },
    );
  }
}
