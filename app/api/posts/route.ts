import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin() {
  const session = await auth();
  return session?.user && session.user.role === "ADMIN";
}

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin();
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const authorId = searchParams.get("authorId");
    const published = searchParams.get("published");

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (!admin) where.published = true;
    if (published === "true") where.published = true;
    if (published === "false" && admin) where.published = false;

    // Filter by author: look up user name from authorId, then filter posts
    if (authorId) {
      const user = await prisma.user.findUnique({
        where: { id: authorId },
        select: { name: true },
      });
      if (user?.name) {
        where.author = user.name;
      } else {
        return NextResponse.json({ posts: [], total: 0, page: 1, totalPages: 0 });
      }
    }

    // Pagination: only when page param is provided (backward compatible)
    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1);
      const limit = Math.max(1, Math.min(50, parseInt(limitParam || "9", 10) || 9));
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.post.count({ where }),
      ]);

      return NextResponse.json({
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        summary: body.summary || null,
        published: !!body.published,
        coverImage: body.coverImage || null,
        author: body.author || "Nguyễn Đình Chiến",
        category: body.category || "General",
        tags: body.tags || [],
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
