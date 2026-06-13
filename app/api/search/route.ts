import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!q.trim()) {
      return NextResponse.json({ posts: [], projects: [] });
    }

    const searchQuery = q.trim();

    const [posts, projects] = await Promise.all([
      type === "projects"
        ? []
        : prisma.post.findMany({
            where: {
              published: true,
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { summary: { contains: searchQuery, mode: "insensitive" } },
                { category: { contains: searchQuery, mode: "insensitive" } },
                { tags: { has: searchQuery } },
              ],
            },
            orderBy: { publishedAt: "desc" },
            take: 20,
          }),
      type === "posts"
        ? []
        : prisma.project.findMany({
            where: {
              published: true,
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
                { technologies: { has: searchQuery } },
              ],
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          }),
    ]);

    return NextResponse.json({ posts, projects });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 },
    );
  }
}
