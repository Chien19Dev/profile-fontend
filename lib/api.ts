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
}

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorTitle: string;
  content: string;
  avatar?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
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
  posts: crud<Post, Omit<Post, "id">, Partial<Post>>("/posts"),
  testimonials: crud<Testimonial, Omit<Testimonial, "id">, Partial<Testimonial>>("/testimonials"),
};
