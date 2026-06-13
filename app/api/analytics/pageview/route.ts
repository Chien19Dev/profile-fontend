import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { path, referrer } = await request.json();

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || null;

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent,
        ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording pageview:", error);
    return NextResponse.json(
      { error: "Failed to record pageview" },
      { status: 500 },
    );
  }
}
