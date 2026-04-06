import { z } from "zod";

export const toolSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio").max(50),
  official_url: z.string().url("Debe ser una URL válida"),
  short_description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(200),
  category_id: z.string().uuid("Debes seleccionar una categoría válida"),
  logo_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type ToolFormData = z.infer<typeof toolSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio").max(30),
  description: z.string().max(100).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
