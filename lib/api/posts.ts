import { crud, request } from "./client";
import type { Bookmark, Comment, Like, Post, SearchResult } from "./types";

export const postsApi = {
  ...crud<Post, Omit<Post, "id">, Partial<Post>>("/posts"),
  get: (id: string) => request<Post>(`/posts/${id}`),
};

export const commentsApi = {
  ...crud<Comment, Omit<Comment, "id">, Partial<Comment>>("/comments"),
  byPost: (postId: string) => request<Comment[]>(`/comments?postId=${postId}`),
};

export const likesApi = {
  list: () => request<Like[]>("/likes"),
  toggle: (postId: string) =>
    request<Like | { deleted: true }>("/likes", {
      method: "POST",
      body: JSON.stringify({ postId }),
    }),
  check: (postId: string) =>
    request<{ liked: boolean }>(`/likes?postId=${postId}`),
};

export const bookmarksApi = {
  list: () => request<Bookmark[]>("/bookmarks"),
  toggle: (postId: string) =>
    request<Bookmark | { deleted: true }>("/bookmarks", {
      method: "POST",
      body: JSON.stringify({ postId }),
    }),
  check: (postId: string) =>
    request<{ bookmarked: boolean }>(`/bookmarks?postId=${postId}`),
};

export const searchApi = {
  query: (q: string, type?: string) => {
    const params = new URLSearchParams({ q });
    if (type) params.set("type", type);
    return request<SearchResult>(`/search?${params.toString()}`);
  },
};
