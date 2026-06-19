import { request } from "./client";
import type { PublicUser, User, UserFollow } from "./types";

export const usersApi = {
  list: () => request<User[]>("/users"),
  get: (id: string) => request<User>(`/users/${id}`),
  remove: (id: string) => request<User>(`/users/${id}`, { method: "DELETE" }),
  updateRole: (id: string, role: string) =>
    request<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  updateProfile: (id: string, data: { name?: string; bio?: string; image?: string }) =>
    request<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const publicUsersApi = {
  list: () => request<PublicUser[]>("/users/public"),
};

export const followsApi = {
  toggle: (userId: string) =>
    request<UserFollow | { deleted: true }>("/follows", {
      method: "POST",
      body: JSON.stringify({ followingId: userId }),
    }),
  followers: (userId: string) =>
    request<UserFollow[]>(`/follows?userId=${userId}&type=followers`),
  following: (userId: string) =>
    request<UserFollow[]>(`/follows?userId=${userId}&type=following`),
};

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
