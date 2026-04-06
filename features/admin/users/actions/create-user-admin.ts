"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createUserSchema, type CreateUserData } from "../schemas/create-user-schema";
import { revalidatePath } from "next/cache";

export type AdminActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createUserByAdmin(data: CreateUserData): Promise<AdminActionResponse> {
  // 1. Session and Role Validation
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "No autorizado." };
  }

  // Check if caller is admin
  const { data: profile } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, message: "Permisos de administrador requeridos." };
  }

  // 2. Input Validation
  const validatedFields = createUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validación fallida.",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, firstName, lastName, role, isActive } = validatedFields.data;
  const adminClient = createAdminClient();

  try {
    // 3. Create User in Supabase Auth via Admin Client (Invite Flow)
    // This creates the user and sends an invitation email automatically.
    const { data: inviteData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        role: role,
      },
      redirectTo: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/auth/callback?type=invite`,
    });

    if (authError) {
      if (authError.message.includes("already exists")) {
        return { success: false, message: "El correo electrónico ya está registrado." };
      }
      throw authError;
    }

    if (!inviteData.user) throw new Error("Error al invitar al usuario.");

    // 4. Create Profile in accounts schema
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;

    const { error: profileError } = await adminClient
      .schema("accounts")
      .from("profiles")
      .insert({
        id: crypto.randomUUID(), 
        auth_user_id: inviteData.user.id,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        username: uniqueUsername,
        email: email,
        role: role,
        is_active: isActive,
        is_verified: false,
        document_type: "temp",
        document_number: `ADMIN_${inviteData.user.id.substring(0, 8)}`,
        certificate_name: `${firstName} ${lastName}`,
        country_code: "EC"
      });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(inviteData.user.id);
      throw profileError;
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `Usuario ${email} creado correctamente. Se enviará un enlace de activación.`,
    };

  } catch (error: any) {
    console.error("Admin Creation Error:", error);
    return {
      success: false,
      message: error.message || "Error inesperado al crear el usuario.",
    };
  }
}
