import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

function parseUserAgent(ua: string | null) {
  if (!ua) return { browser: null, os: null, device: null };
  let browser: string | null = null;
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua) || /Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else browser = "Other";
  let os: string | null = null;
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else os = "Other";
  let device: string | null = null;
  if (/Mobile|Android.*Mobile|iPhone|iPod/.test(ua)) device = "mobile";
  else if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) device = "tablet";
  else device = "desktop";
  return { browser, os, device };
}

export async function POST(request: NextRequest) {
  try {
    const { path, referrer } = await request.json();

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || null;
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;
    const city =
      request.headers.get("x-vercel-ip-city") || null;
    const { browser, os, device } = parseUserAgent(userAgent);

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent,
        ip,
        country,
        city: city ? decodeURIComponent(city) : null,
        device,
        browser,
        os,
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
