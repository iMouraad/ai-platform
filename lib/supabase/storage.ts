import { createClient } from "./client";

/**
 * Sube una imagen al bucket de Supabase Storage.
 * @param file Archivo a subir
 * @param bucket Nombre del bucket (ej: 'directory')
 * @returns La URL pública de la imagen
 */
export async function uploadImage(file: File, bucket: string = "directory") {
  const supabase = createClient();
  
  // Generar un nombre único para evitar colisiones
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  // 1. Subir el archivo
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  // 2. Obtener la URL pública
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
