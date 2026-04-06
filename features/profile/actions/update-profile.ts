"use server";

import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileUpdateData } from "../schemas/profile-schema";
import { revalidatePath } from "next/cache";

export type ProfileActionResponse = {
  success: boolean;
  message: string;
};

export async function updateProfile(data: ProfileUpdateData): Promise<ProfileActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "No autorizado." };

  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Validación de datos fallida." };
  }

  // Update only allowed fields (validation.data contains only schema fields)
  const { error } = await supabase
    .schema("accounts")
    .from("profiles")
    .update({ 
      ...validation.data, 
      updated_at: new Date().toISOString() 
    })
    .eq("auth_user_id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Error técnico al actualizar el perfil." };
  }

  revalidatePath("/profile");
  return { success: true, message: "Perfil actualizado correctamente." };
}
