import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        title: true,
        bio: true,
        avatar: true,
        email: true,
        phone: true,
        location: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        instagramUrl: true,
        facebookUrl: true,
        websiteUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(profile || null);
  } catch (error) {
    console.error("Error fetching current profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch current profile" },
      { status: 500 },
    );
  }
}
