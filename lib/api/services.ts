import { crud } from "./client";
import type { Service } from "./types";

export const servicesApi = crud<Service, Omit<Service, "id">, Partial<Service>>(
  "/services",
);
