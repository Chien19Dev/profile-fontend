import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    const blob = await put(`cv/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: "application/pdf",
    });

    let profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { cvUrl: blob.url },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          fullName: "Nguyễn Đình Chiến",
          title: "Developer",
          bio: "Professional developer",
          cvUrl: blob.url,
        },
      });
    }

    return NextResponse.json({ success: true, cvUrl: profile.cvUrl });
  } catch (error) {
    console.error("Error uploading CV:", error);
    return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "desc" },
      select: { cvUrl: true },
    });

    if (!profile?.cvUrl) {
      return NextResponse.json({ error: "No CV found" }, { status: 404 });
    }

    return NextResponse.json({ cvUrl: profile.cvUrl });
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 });
  }
}
