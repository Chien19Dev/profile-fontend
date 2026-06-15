import { crud } from "./client";
import type { Skill } from "./types";

export const skillsApi = crud<Skill, Omit<Skill, "id">, Partial<Skill>>("/skills");
