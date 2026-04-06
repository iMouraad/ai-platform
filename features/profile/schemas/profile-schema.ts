import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().min(2, "Mínimo 2 caracteres").max(50).optional(),
  bio: z.string().max(300, "Máximo 300 caracteres").optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  website_url: z.string().url("URL no válida").optional().or(z.literal("")),
  github_url: z.string().url("URL no válida").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL no válida").optional().or(z.literal("")),
});

export type ProfileUpdateData = z.infer<typeof profileSchema>;
