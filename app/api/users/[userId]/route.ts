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
        password: true,
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
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    // Add hasPassword field and remove password from response
    const userWithHasPassword = {
      ...user,
      hasPassword: !!user.password,
      password: undefined,
    };

    return NextResponse.json(userWithHasPassword);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
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
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    if (body.role !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Chỉ admin mới có thể thay đổi vai trò" }, { status: 403 });
      }
      if (targetUser.role === "ADMIN") {
        return NextResponse.json(
          { error: "Không thể thay đổi vai trò của người dùng Admin" },
          { status: 403 },
        );
      }
    }

    if (body.newPassword !== undefined) {
      if (!isSelf) {
        return NextResponse.json({ error: "Không thể thay đổi mật khẩu của người dùng khác" }, { status: 403 });
      }
      if (!body.currentPassword) {
        return NextResponse.json({ error: "Mật khẩu hiện tại là bắt buộc" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(body.currentPassword, targetUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Mật khẩu hiện tại không chính xác" }, { status: 400 });
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
    console.error("Lỗi khi cập nhật người dùng:", error);
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
        { error: "Không thể xóa tài khoản của chính bạn" },
        { status: 400 },
      );
    }
    const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (targetUser?.role === "ADMIN") {
      return NextResponse.json(
        { error: "Không thể xóa tài khoản của người dùng Admin" },
        { status: 403 },
      );
    }
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    return NextResponse.json(
      { error: "Không thể xóa người dùng" },
      { status: 500 },
    );
  }
}
