import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("El correo no es válido"),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  role: z.enum(["student", "instructor", "admin"]),
  isActive: z.boolean(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
