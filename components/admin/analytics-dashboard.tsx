"use client";

import { useState, useEffect } from "react";
import { Eye, Users, Globe, TrendingUp } from "lucide-react";
import type { AnalyticsData } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Đang tải phân tích...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Không thể tải dữ liệu phân tích
      </div>
    );
  }

  const maxViews = Math.max(...data.viewsOverTime.map((d) => d.count), 1);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="size-4" />}
          label="Lượt xem (30 ngày)"
          value={data.totalViews.toLocaleString()}
        />
        <StatCard
          icon={<Users className="size-4" />}
          label="Người truy cập duy nhất"
          value={data.uniqueVisitors.toLocaleString()}
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Trang phổ biến nhất"
          value={data.topPages[0]?.path || "—"}
          small
        />
        <StatCard
          icon={<Globe className="size-4" />}
          label="Quốc gia hàng đầu"
          value={data.countries[0]?.country || "—"}
          small
        />
      </div>

      {/* Views Over Time Chart */}
      <DecoFrame className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Lượt xem 7 ngày qua
        </h3>
        <div className="flex items-end gap-1 h-32">
          {data.viewsOverTime.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/70 rounded-t-sm transition-all"
                style={{ height: `${(d.count / maxViews) * 100}%`, minHeight: "4px" }}
                title={`${d.count} lượt xem`}
              />
              <span className="text-[0.5rem] text-muted-foreground">
                {d.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </DecoFrame>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Pages */}
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Trang phổ biến
          </h3>
          <div className="space-y-2">
            {data.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate mr-2">
                  {i + 1}. {page.path}
                </span>
                <span className="tabular-nums text-primary font-medium shrink-0">
                  {page.count}
                </span>
              </div>
            ))}
            {data.topPages.length === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </DecoFrame>

        {/* Referrers */}
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Nguồn truy cập
          </h3>
          <div className="space-y-2">
            {data.referrers.map((ref, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate mr-2">
                  {ref.referrer}
                </span>
                <span className="tabular-nums text-primary font-medium shrink-0">
                  {ref.count}
                </span>
              </div>
            ))}
            {data.referrers.length === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </DecoFrame>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <DecoFrame className="p-4 space-y-2">
      <div className="flex items-center gap-2 text-primary">{icon}</div>
      <p className={small ? "text-sm font-medium truncate" : "text-2xl font-bold tabular-nums"}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </DecoFrame>
  );
}
