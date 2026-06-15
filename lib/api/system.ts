import { crud, request } from "./client";
import type { AnalyticsData, Navigation, Notification } from "./types";

export const navigationApi = crud<
  Navigation,
  Omit<Navigation, "id">,
  Partial<Navigation>
>("/navigation");

export const analyticsApi = {
  overview: () => request<AnalyticsData>("/analytics"),
  pageview: (data: { path: string; referrer?: string }) =>
    request<void>("/analytics/pageview", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const notificationsApi = {
  list: () => request<Notification[]>("/notifications"),
  markRead: (id: string) =>
    request<Notification>(`/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    }),
  markAllRead: () =>
    request<void>("/notifications", {
      method: "PATCH",
      body: JSON.stringify({ allRead: true }),
    }),
};
