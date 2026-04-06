"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { categorySchema, CategoryFormData } from "@/features/directory/schemas/tool-schema";
import { revalidatePath } from "next/cache";

export async function createCategory(data: CategoryFormData) {
  const validated = categorySchema.safeParse(data);
  if (!validated.success) return { success: false, message: "Datos inválidos" };

  const adminClient = await createAdminClient();
  const slug = validated.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { error } = await adminClient
    .schema("directory")
    .from("categories")
    .insert({ ...validated.data, slug });

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}
