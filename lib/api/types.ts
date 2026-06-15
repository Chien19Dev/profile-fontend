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
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
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
