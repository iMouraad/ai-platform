"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { activatePasswordSchema, ActivatePasswordData } from "../schemas/activate-password-schema";
import crypto from "crypto";

export async function activateAccount(token: string, data: ActivatePasswordData) {
  // 1. Validation
  const validatedFields = activatePasswordSchema.safeParse(data);
  if (!validatedFields.success) throw new Error("Datos de contraseña inválidos");

  // Use Admin Client for EVERYTHING to bypass RLS during this critical phase
  const adminSupabase = await createAdminClient();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find pending registration (Using Admin)
  const { data: pending, error: findError } = await adminSupabase
    .schema("accounts")
    .from("pending_registrations")
    .select("*")
    .eq("activation_token_hash", tokenHash)
    .single();

  if (findError || !pending) throw new Error("Enlace de activación inválido o expirado.");
  if (pending.status === "used") throw new Error("Este enlace ya ha sido utilizado.");
  if (new Date(pending.expires_at) < new Date()) throw new Error("El enlace ha expirado.");

  let userId: string;

  // 3. Create or Update User in Supabase Auth
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email: pending.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: pending.full_name,
      username: pending.generated_username,
    },
  });

  if (authError) {
    // If user already exists in Auth but activation failed before, let's try to get the existing ID
    if (authError.message.includes("already been registered")) {
      const { data: existingUser } = await adminSupabase.auth.admin.listUsers();
      const user = existingUser.users.find(u => u.email === pending.email);
      if (!user) throw new Error("Error crítico: El usuario existe pero no se pudo recuperar.");
      userId = user.id;
      
      // Also update password anyway to be sure it's the one the user just set
      await adminSupabase.auth.admin.updateUserById(userId, { password: data.password });
    } else {
      throw new Error(authError.message);
    }
  } else {
    userId = authUser.user.id;
  }

  // 4. Create Profile (Using Admin - This bypasses RLS)
  const { error: profileError } = await adminSupabase
    .schema("accounts")
    .from("profiles")
    .upsert({
      auth_user_id: userId,
      first_name: pending.first_name,
      middle_name: pending.middle_name,
      last_name: pending.last_name,
      second_last_name: pending.second_last_name,
      full_name: pending.full_name,
      certificate_name: pending.certificate_name,
      username: pending.generated_username,
      document_type: pending.document_type,
      document_number: pending.document_number,
      country_code: pending.country_code,
      email: pending.email,
      role: "student",
      is_active: true,
      is_verified: true,
    }, { onConflict: 'auth_user_id' });

  if (profileError) throw new Error("Error al crear perfil: " + profileError.message);

  // 5. Update Registry & Audit (Using Admin)
  await adminSupabase
    .schema("accounts")
    .from("username_registry")
    .upsert({
      username: pending.generated_username,
    }, { onConflict: 'username' });

  // 6. DEACTIVATE TOKEN IMMEDIATELY
  const { error: updateError } = await adminSupabase
    .schema("accounts")
    .from("pending_registrations")
    .update({ status: "used" })
    .eq("id", pending.id);

  if (updateError) console.error("Warning: Could not mark token as used", updateError);

  // Final success
  return { success: true };
}
