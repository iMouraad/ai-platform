"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { toolSchema } from "@/features/directory/schemas/tool-schema";
import { revalidatePath } from "next/cache";

export async function createTool(formData: FormData) {
  // 1. Data Processing
  const data = {
    name: formData.get("name") as string,
    official_url: formData.get("official_url") as string,
    short_description: formData.get("short_description") as string,
    category_id: formData.get("category_id") as string,
    is_active: formData.get("is_active") === "true",
    is_verified: formData.get("is_verified") === "true",
    logo_url: formData.get("logo_url") as string || "",
    video_url: formData.get("video_url") as string || "",
    content: formData.get("content") as string || "",
    pricing: formData.get("pricing") as string || "",
    target_audience: formData.get("target_audience") as string || "",
    pros: formData.get("pros") as string || "",
    features: formData.get("features") as string || "",
    suggested_prompts: formData.get("suggested_prompts") as string || "",
  };

  const validated = toolSchema.safeParse(data);
  if (!validated.success) {
    console.error(validated.error);
    return { success: false, message: "Datos inválidos" };
  }

  const adminClient = await createAdminClient();
  const file = formData.get("logo_file") as File;
  let finalLogoUrl = data.logo_url;

  // 2. Handle Image Upload if file exists
  if (file && file.size > 0 && file.name !== "undefined") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${validated.data.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await adminClient.storage
      .from("directory")
      .upload(filePath, file);

    if (uploadError) return { success: false, message: `Error subiendo logo: ${uploadError.message}` };

    const { data: publicData } = adminClient.storage
      .from("directory")
      .getPublicUrl(filePath);
    
    finalLogoUrl = publicData.publicUrl;
  }

  // 3. Database Insertion
  const slug = validated.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Convert comma separated strings to arrays
  const prosArray = validated.data.pros ? validated.data.pros.split(",").map(s => s.trim()).filter(Boolean) : [];
  const featuresArray = validated.data.features ? validated.data.features.split(",").map(s => s.trim()).filter(Boolean) : [];
  const promptsArray = validated.data.suggested_prompts ? validated.data.suggested_prompts.split(",").map(s => s.trim()).filter(Boolean) : [];

  const { error } = await adminClient
    .schema("directory")
    .from("tools")
    .insert({
      ...validated.data,
      pros: prosArray,
      features: featuresArray,
      suggested_prompts: promptsArray,
      logo_url: finalLogoUrl,
      slug,
      is_active: data.is_active,
      is_verified: data.is_verified,
    });

  if (error) return { success: false, message: "Error al crear la herramienta: " + error.message };

  revalidatePath("/admin/directory");
  revalidatePath("/directory");
  return { success: true };
}
