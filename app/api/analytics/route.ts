import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const totalViews = await prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const uniqueVisitorsResult = await prisma.pageView.groupBy({
      by: ["ip"],
      where: { createdAt: { gte: thirtyDaysAgo }, ip: { not: null } },
      _count: true,
    });
    const uniqueVisitors = uniqueVisitorsResult.length;
    const topPagesRaw = await prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });
    const topPages = topPagesRaw.map((p) => ({
      path: p.path,
      count: p._count.path,
    }));
    const viewsRaw = await prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const viewsByDay: Record<string, number> = {};
    viewsRaw.forEach((v) => {
      const day = new Date(v.createdAt).toISOString().split("T")[0];
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });
    const viewsOverTime = Object.entries(viewsByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
    const referrersRaw = await prisma.pageView.groupBy({
      by: ["referrer"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        referrer: { not: null },
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    });
    const referrers = referrersRaw.map((r) => ({
      referrer: r.referrer || "(direct)",
      count: r._count.referrer,
    }));
    const countriesRaw = await prisma.pageView.groupBy({
      by: ["country"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        country: { not: null },
      },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    });
    const countries = countriesRaw.map((c) => ({
      country: c.country || "Unknown",
      count: c._count.country,
    }));
    const devicesRaw = await prisma.pageView.groupBy({
      by: ["device"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        device: { not: null },
      },
      _count: { device: true },
      orderBy: { _count: { device: "desc" } },
    });
    const devices = devicesRaw.map((d) => ({
      device: d.device || "Unknown",
      count: d._count.device,
    }));
    const browsersRaw = await prisma.pageView.groupBy({
      by: ["browser"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        browser: { not: null },
      },
      _count: { browser: true },
      orderBy: { _count: { browser: "desc" } },
    });
    const browsers = browsersRaw.map((b) => ({
      browser: b.browser || "Unknown",
      count: b._count.browser,
    }));

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      topPages,
      viewsOverTime,
      referrers,
      countries,
      devices,
      browsers,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
