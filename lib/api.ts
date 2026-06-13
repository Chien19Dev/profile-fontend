const API_BASE_URL = "/api";

export type Profile = {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatar?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  images?: string[];
  technologies?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  published?: boolean;
  categoryId?: string | null;
  category?: ProjectCategory | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Skill = {
  id: string;
  name: string;
  category?: string | null;
  icon?: string | null;
  level?: number | null;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  replies?: ContactReply[];
};

export type ContactReply = {
  id: string;
  contactId: string;
  adminId: string;
  admin?: { name?: string | null; email: string };
  message: string;
  createdAt?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  published: boolean;
  coverImage?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: { comments?: number; likes?: number; bookmarks?: number };
  likedByUser?: boolean;
  bookmarkedByUser?: boolean;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorTitle: string;
  content: string;
  avatar?: string | null;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  user?: { name?: string | null; image?: string | null };
  parentId?: string | null;
  replies?: Comment[];
  createdAt?: string;
  updatedAt?: string;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
  createdAt?: string;
};

export type Bookmark = {
  id: string;
  userId: string;
  postId: string;
  createdAt?: string;
};

export type UserFollow = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt?: string;
};

export type PageView = {
  id: string;
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  country?: string | null;
  createdAt?: string;
};

export type Navigation = {
  id: string;
  label: string;
  href: string;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  link?: string | null;
  createdAt?: string;
};

export type SearchResult = {
  posts: Post[];
  projects: Project[];
};

export type User = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  bio?: string | null;
  role: string;
  createdAt?: string;
  _count?: {
    comments?: number;
    likes?: number;
    bookmarks?: number;
    following?: number;
    followers?: number;
  };
};

export type PublicUser = {
  id: string;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  createdAt?: string;
  _count?: {
    comments?: number;
    likes?: number;
    following?: number;
    followers?: number;
  };
};

export type AnalyticsData = {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  viewsOverTime: { date: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  countries: { country: string; count: number }[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const crud = <T, C extends object, U extends object>(path: string) => ({
  list: () => request<T[]>(path),
  create: (data: C) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: U) =>
    request<T>(`${path}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<T>(`${path}/${id}`, { method: "DELETE" }),
});

export const api = {
  baseUrl: API_BASE_URL,
  profiles: {
    ...crud<Profile, Omit<Profile, "id">, Partial<Profile>>("/profile"),
    current: () => request<Profile | null>("/profile/current"),
  },
  projects: crud<Project, Omit<Project, "id">, Partial<Project>>("/projects"),
  skills: crud<Skill, Omit<Skill, "id">, Partial<Skill>>("/skills"),
  contacts: crud<
    ContactMessage,
    Omit<ContactMessage, "id" | "isRead">,
    Partial<ContactMessage>
  >("/contact"),
  posts: {
    ...crud<Post, Omit<Post, "id">, Partial<Post>>("/posts"),
    get: (id: string) => request<Post>(`/posts/${id}`),
  },
  testimonials: crud<
    Testimonial,
    Omit<Testimonial, "id">,
    Partial<Testimonial>
  >("/testimonials"),

  // Search
  search: {
    query: (q: string, type?: string) => {
      const params = new URLSearchParams({ q });
      if (type) params.set("type", type);
      return request<SearchResult>(`/search?${params.toString()}`);
    },
  },

  // Comments
  comments: {
    ...crud<Comment, Omit<Comment, "id">, Partial<Comment>>("/comments"),
    byPost: (postId: string) => request<Comment[]>(`/comments?postId=${postId}`),
  },

  // Likes
  likes: {
    list: () => request<Like[]>("/likes"),
    toggle: (postId: string) =>
      request<Like | { deleted: true }>("/likes", {
        method: "POST",
        body: JSON.stringify({ postId }),
      }),
    check: (postId: string) =>
      request<{ liked: boolean }>(`/likes?postId=${postId}`),
  },

  // Bookmarks
  bookmarks: {
    list: () => request<Bookmark[]>("/bookmarks"),
    toggle: (postId: string) =>
      request<Bookmark | { deleted: true }>("/bookmarks", {
        method: "POST",
        body: JSON.stringify({ postId }),
      }),
    check: (postId: string) =>
      request<{ bookmarked: boolean }>(`/bookmarks?postId=${postId}`),
  },

  // Follows
  follows: {
    toggle: (userId: string) =>
      request<UserFollow | { deleted: true }>("/follows", {
        method: "POST",
        body: JSON.stringify({ followingId: userId }),
      }),
    followers: (userId: string) =>
      request<UserFollow[]>(`/follows?userId=${userId}&type=followers`),
    following: (userId: string) =>
      request<UserFollow[]>(`/follows?userId=${userId}&type=following`),
  },

  // Categories
  categories: crud<ProjectCategory, Omit<ProjectCategory, "id">, Partial<ProjectCategory>>("/categories"),

  // Navigation
  navigation: crud<Navigation, Omit<Navigation, "id">, Partial<Navigation>>("/navigation"),

  // Analytics
  analytics: {
    overview: () => request<AnalyticsData>("/analytics"),
    pageview: (data: { path: string; referrer?: string }) =>
      request<void>("/analytics/pageview", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Notifications
  notifications: {
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
  },

  // Contact Reply
  contactReplies: {
    create: (contactId: string, message: string) =>
      request<ContactReply>(`/contact/${contactId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
  },

  // Registration
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      request<{ id: string; email: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Users (admin)
  users: {
    list: () => request<User[]>('/users'),
    get: (id: string) => request<User>(`/users/${id}`),
    remove: (id: string) => request<User>(`/users/${id}`, { method: 'DELETE' }),
    updateRole: (id: string, role: string) =>
      request<User>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
  },

  // Public users
  publicUsers: {
    list: () => request<PublicUser[]>('/users/public'),
  },
};
