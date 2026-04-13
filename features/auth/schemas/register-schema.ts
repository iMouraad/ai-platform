import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string()
    .min(2, "El nombre es muy corto")
    .max(50, "El nombre es muy largo")
    .regex(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/, "Solo se permiten letras y espacios"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string()
    .min(2, "El apellido es muy corto")
    .max(50, "El apellido es muy largo")
    .regex(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/, "Solo se permiten letras y espacios"),
  secondLastName: z.string().optional().or(z.literal("")),
  documentType: z.enum(["dni", "passport", "cedula", "other"], {
    message: "Selecciona un tipo de documento",
  }),
  documentNumber: z.string()
    .min(5, "El número de documento es inválido")
    .max(20, "El número de documento es muy largo")
    .regex(/^[a-zA-Z0-9]+$/, "Solo se permiten letras y números"),
  email: z.string().email("Introduce un correo electrónico válido"),
  countryCode: z.string().default("EC"),
});

export type RegisterData = z.infer<typeof registerSchema>;
