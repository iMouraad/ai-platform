"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(profileId: string, newRole: 'student' | 'student_premium' | 'instructor' | 'admin') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { data: currentUserProfile } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    throw new Error("No tienes permisos de administrador");
  }

  const updateData: any = { 
    role: newRole, 
    updated_at: new Date().toISOString() 
  };

  if (newRole === 'student_premium') {
    updateData.premium_at = new Date().toISOString();
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient
    .schema("accounts")
    .from("profiles")
    .update(updateData)
    .eq("id", profileId);

  if (error) {
    console.error("Error updating role:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserStatus(profileId: string, currentStatus: boolean) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { data: currentUserProfile } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    throw new Error("No tienes permisos de administrador");
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient
    .schema("accounts")
    .from("profiles")
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", profileId);

  if (error) {
    console.error("Error toggling status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
