import { crud, request } from "./client";
import type { Profile } from "./types";

export const profilesApi = {
  ...crud<Profile, Omit<Profile, "id">, Partial<Profile>>("/profile"),
  current: () => request<Profile | null>("/profile/current"),
};
