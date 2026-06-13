import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 },
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        user: { select: { name: true, image: true } },
        replies: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, postId, parentId } = await request.json();

    if (!content || !postId) {
      return NextResponse.json(
        { error: "Content and postId are required" },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    await createNotification({
      type: "NEW_COMMENT",
      title: "Bình luận mới",
      message: `${session.user.name || session.user.email} đã bình luận: ${content.slice(0, 50)}`,
      link: `/blog/${postId}`,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
