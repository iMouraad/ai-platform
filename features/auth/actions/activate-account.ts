"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { activatePasswordSchema, ActivatePasswordData } from "../schemas/activate-password-schema";
import crypto from "crypto";

export async function activateAccount(token: string, data: ActivatePasswordData) {
  // 1. Validation
  const validatedFields = activatePasswordSchema.safeParse(data);
  if (!validatedFields.success) throw new Error("Datos de contraseña inválidos");

  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find pending registration
  const { data: pending, error: findError } = await supabase
    .schema("accounts")
    .from("pending_registrations")
    .select("*")
    .eq("activation_token_hash", tokenHash)
    .single();

  if (findError || !pending) throw new Error("Enlace de activación inválido o expirado.");
  if (pending.status === "used") throw new Error("Este enlace ya ha sido utilizado.");
  if (new Date(pending.expires_at) < new Date()) throw new Error("El enlace ha expirado.");

  // 3. Create User in Supabase Auth (Using Admin Client)
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email: pending.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: pending.full_name,
      username: pending.generated_username,
    },
  });

  if (authError) throw new Error(authError.message);

  // 4. Create Profile
  const { error: profileError } = await supabase
    .schema("accounts")
    .from("profiles")
    .insert({
      id: crypto.randomUUID(),
      auth_user_id: authUser.user.id,
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
    });

  if (profileError) throw new Error(profileError.message);

  // 5. Update Registry & Audit
  await supabase
    .schema("accounts")
    .from("username_registry")
    .insert({
      username: pending.generated_username,
    });

  await supabase
    .schema("accounts")
    .from("pending_registrations")
    .update({ status: "used" })
    .eq("id", pending.id);

  // 6. Final success
  return { success: true };
}
