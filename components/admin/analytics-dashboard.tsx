"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import type { AnalyticsData } from "@/lib/api";
import { Compass, Eye, Globe, Monitor, Users } from "lucide-react";
import { useEffect, useState } from "react";

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
  const topDevice = data.devices?.[0];
  const topBrowser = data.browsers?.[0];

  return (
    <div className="p-6 space-y-6">
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
          icon={<Monitor className="size-4" />}
          label="Thiết bị phổ biến"
          value={topDevice ? `${topDevice.device} (${topDevice.count})` : "—"}
          small
        />
        <StatCard
          icon={<Compass className="size-4" />}
          label="Trình duyệt phổ biến"
          value={topBrowser ? `${topBrowser.browser} (${topBrowser.count})` : "—"}
          small
        />
      </div>
      <DecoFrame className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Lượt xem 7 ngày qua
        </h3>
        <div className="flex items-end gap-1 h-32">
          {data.viewsOverTime.map((d) => (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full bg-primary/70 rounded-t-sm transition-all"
                style={{
                  height: `${(d.count / maxViews) * 100}%`,
                  minHeight: "4px",
                }}
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
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Trang phổ biến
          </h3>
          <div className="space-y-2">
            {data.topPages.map((page, i) => (
              <div
                key={page.path}
                className="flex items-center justify-between text-xs"
              >
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
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Nguồn truy cập
          </h3>
          <div className="space-y-2">
            {data.referrers.map((ref, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
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

      <div className="grid md:grid-cols-3 gap-4">
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Globe className="size-3.5" />
            Quốc gia
          </h3>
          <div className="space-y-2">
            {data.countries.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground truncate mr-2">
                  {c.country}
                </span>
                <span className="tabular-nums text-primary font-medium shrink-0">
                  {c.count}
                </span>
              </div>
            ))}
            {data.countries.length === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </DecoFrame>
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Monitor className="size-3.5" />
            Thiết bị
          </h3>
          <div className="space-y-2">
            {(data.devices || []).map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground truncate mr-2">
                  {d.device}
                </span>
                <span className="tabular-nums text-primary font-medium shrink-0">
                  {d.count}
                </span>
              </div>
            ))}
            {(!data.devices || data.devices.length === 0) && (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </DecoFrame>
        <DecoFrame className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Compass className="size-3.5" />
            Trình duyệt
          </h3>
          <div className="space-y-2">
            {(data.browsers || []).map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground truncate mr-2">
                  {b.browser}
                </span>
                <span className="tabular-nums text-primary font-medium shrink-0">
                  {b.count}
                </span>
              </div>
            ))}
            {(!data.browsers || data.browsers.length === 0) && (
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
    <DecoFrame
      className="p-4 space-y-2"
      bottomRightClassName="!bottom-0"
      bottomLeftClassName="!bottom-0"
    >
      <div className="flex items-center gap-2 text-primary">{icon}</div>
      <p
        className={
          small
            ? "text-sm font-medium truncate"
            : "text-2xl font-bold tabular-nums"
        }
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </DecoFrame>
  );
}
