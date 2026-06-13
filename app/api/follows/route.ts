import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (type === "followers") {
      const followers = await prisma.userFollow.findMany({
        where: { followingId: userId },
        include: { follower: { select: { id: true, name: true, image: true } } },
      });
      return NextResponse.json(followers);
    } else {
      const following = await prisma.userFollow.findMany({
        where: { followerId: userId },
        include: { following: { select: { id: true, name: true, image: true } } },
      });
      return NextResponse.json(following);
    }
  } catch (error) {
    console.error("Error fetching follows:", error);
    return NextResponse.json(
      { error: "Failed to fetch follows" },
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

    const { followingId } = await request.json();
    if (!followingId) {
      return NextResponse.json(
        { error: "followingId required" },
        { status: 400 },
      );
    }

    if (followingId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 },
      );
    }

    const existing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    if (existing) {
      await prisma.userFollow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    } else {
      const follow = await prisma.userFollow.create({
        data: { followerId: session.user.id, followingId },
      });
      return NextResponse.json({ following: true, id: follow.id });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 },
    );
  }
}
