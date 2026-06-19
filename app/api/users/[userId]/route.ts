import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await params;
    const isSelf = session.user.id === userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, password: true } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role change: ADMIN only, cannot change ADMIN role
    if (body.role !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only admin can change roles" }, { status: 403 });
      }
      if (targetUser.role === "ADMIN") {
        return NextResponse.json(
          { error: "Cannot change role of an Admin user" },
          { status: 403 },
        );
      }
    }

    // Password change: self only
    if (body.newPassword !== undefined) {
      if (!isSelf) {
        return NextResponse.json({ error: "Cannot change another user's password" }, { status: 403 });
      }
      if (!body.currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(body.currentPassword, targetUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.role !== undefined && isAdmin) updateData.role = body.role;
    if (body.newPassword !== undefined && isSelf) {
      updateData.password = await bcrypt.hash(body.newPassword, 12);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
            following: true,
            followers: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await params;
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }
    const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (targetUser?.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete an Admin user" },
        { status: 403 },
      );
    }
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
