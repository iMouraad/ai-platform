"use server";

import { registerSchema, RegisterData } from "../schemas/register-schema";
import { createPendingRegistration } from "../services/auth-service";
import { sendActivationEmail } from "../services/mail-service";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function registerUser(data: RegisterData): Promise<ActionResponse> {
  // 1. Validation
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validación de datos fallida",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // 2. Database Pre-registration
    const { token, fullName } = await createPendingRegistration(validatedFields.data);

    // 3. Send Activation Email
    await sendActivationEmail(validatedFields.data.email, fullName, token);

    return {
      success: true,
      message: "Registro exitoso. Revisa tu correo para activar tu cuenta.",
    };
  } catch (error: any) {
    console.error("Registration Error:", error);
    if (error.message.includes("unique_document")) {
      return { success: false, message: "El número de documento ya está registrado." };
    }
    if (error.message.includes("unique_email")) {
      return { success: false, message: "El correo electrónico ya está registrado." };
    }
    return {
      success: false,
      message: "Ocurrió un error al procesar tu registro. Por favor, intenta de nuevo.",
    };
  }
}
