"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { toolSchema } from "@/features/directory/schemas/tool-schema";
import { revalidatePath } from "next/cache";

export async function updateTool(id: string, formData: FormData) {
  // 1. Data Processing
  const data = {
    name: formData.get("name") as string,
    official_url: formData.get("official_url") as string,
    short_description: formData.get("short_description") as string,
    category_id: formData.get("category_id") as string,
    is_active: formData.get("is_active") === "true",
    logo_url: formData.get("logo_url") as string || "",
  };

  const validated = toolSchema.safeParse(data);
  if (!validated.success) return { success: false, message: "Datos inválidos" };

  const adminClient = await createAdminClient();
  const file = formData.get("logo_file") as File;
  let finalLogoUrl = data.logo_url;

  // 2. Handle Image Upload if file exists
  if (file && file.size > 0 && file.name !== "undefined") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${validated.data.name.toLowerCase()}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("directory")
      .upload(filePath, file);

    if (uploadError) return { success: false, message: `Error subiendo logo: ${uploadError.message}` };

    const { data: publicData } = adminClient.storage
      .from("directory")
      .getPublicUrl(filePath);
    
    finalLogoUrl = publicData.publicUrl;
  }

  // 3. Database Update
  const slug = validated.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { error } = await adminClient
    .schema("directory")
    .from("tools")
    .update({ 
      ...validated.data, 
      logo_url: finalLogoUrl,
      slug, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/directory");
  revalidatePath("/directory");
  return { success: true };
}
