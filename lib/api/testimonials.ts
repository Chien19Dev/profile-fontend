import { crud } from "./client";
import type { Testimonial } from "./types";

export const testimonialsApi = crud<
  Testimonial,
  Omit<Testimonial, "id">,
  Partial<Testimonial>
>("/testimonials");
