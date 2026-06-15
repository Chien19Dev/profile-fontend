import { crud } from "./client";
import type { Project, ProjectCategory } from "./types";

export const projectsApi = crud<Project, Omit<Project, "id">, Partial<Project>>("/projects");

export const categoriesApi = crud<
  ProjectCategory,
  Omit<ProjectCategory, "id">,
  Partial<ProjectCategory>
>("/categories");
