import { createClient } from "@/lib/supabase/client";
import { Activity, UserActivityProgress } from "../types/academy.types";

const supabase = createClient();

export const academyService = {
  // --- GESTIÓN DE ACTIVIDADES (ADMIN) ---

  /**
   * Obtener todas las actividades (para el admin, incluye borradores)
   */
  async getAllActivities() {
    const { data, error } = await supabase
      .from('academy_activities')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
    return data as Activity[];
  },

  /**
   * Crear o actualizar una actividad (Upsert)
   */
  async upsertActivity(activity: Partial<Activity>) {
    const { data, error } = await supabase
      .from('academy_activities')
      .upsert({
        ...activity,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error upserting activity:", error);
      throw error;
    }
    return data as Activity;
  },

  /**
   * Eliminar una actividad
   */
  async deleteActivity(id: string) {
    const { error } = await supabase
      .from('academy_activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
    return true;
  },

  // --- GESTIÓN DE PROGRESO (USUARIOS) ---

  /**
   * Obtener actividades publicadas (para alumnos)
   */
  async getPublishedActivities() {
    const { data, error } = await supabase
      .from('academy_activities')
      .select('*')
      .eq('status', 'published')
      .order('order', { ascending: true });

    if (error) {
      console.error("Error fetching published activities:", error);
      throw error;
    }
    return data as Activity[];
  },

  /**
   * Guardar el progreso de un usuario en una actividad
   */
  async saveUserProgress(progress: Partial<UserActivityProgress>) {
    const { data, error } = await supabase
      .from('user_academy_progress')
      .upsert({
        ...progress,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving user progress:", error);
      throw error;
    }
    return data;
  },

  /**
   * Obtener el progreso del usuario actual
   */
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_academy_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
    return data as UserActivityProgress[];
  }
};
