import { z } from "zod";

export const activatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Una mayúscula al menos")
      .regex(/[0-9]/, "Un número al menos")
      .regex(/[^A-Za-z0-9]/, "Un carácter especial al menos"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ActivatePasswordData = z.infer<typeof activatePasswordSchema>;
