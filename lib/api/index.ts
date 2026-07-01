import { API_BASE_URL } from "./client";
import { profilesApi } from "./profiles";
import { projectsApi, categoriesApi } from "./projects";
import { skillsApi } from "./skills";
import { servicesApi } from "./services";
import {
  postsApi,
  commentsApi,
  bookmarksApi,
  searchApi,
  likesApi,
} from "./posts";
import { usersApi, publicUsersApi, followsApi, authApi } from "./users";
import { contactsApi, contactRepliesApi } from "./contacts";
import { navigationApi, analyticsApi, notificationsApi } from "./system";
import { testimonialsApi } from "./testimonials";

export const api = {
  baseUrl: API_BASE_URL,
  profiles: profilesApi,
  projects: projectsApi,
  skills: skillsApi,
  services: servicesApi,
  testimonials: testimonialsApi,
  contacts: contactsApi,
  posts: postsApi,
  search: searchApi,
  comments: commentsApi,
  likes: likesApi,
  bookmarks: bookmarksApi,
  follows: followsApi,
  categories: categoriesApi,
  navigation: navigationApi,
  analytics: analyticsApi,
  notifications: notificationsApi,
  auth: authApi,
  users: usersApi,
  publicUsers: publicUsersApi,
  contactReplies: contactRepliesApi,
};
