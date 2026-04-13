"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, GraduationCap, Search, Filter, Edit3, Trash2, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Activity } from "@/features/academy/types/academy.types";
import { ActivityEditor } from "@/features/academy/components/admin/activity-editor";
import { academyService } from "@/features/academy/services/academy.service";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // Asumiendo que usas sonner para notificaciones

export default function AdminAcademyPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity> | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await academyService.getAllActivities();
      setActivities(data);
    } catch (error) {
      toast.error("Error al cargar las actividades");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleCreateNew = () => {
    setEditingActivity(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsEditorOpen(true);
  };

  const handleSave = async (data: Partial<Activity>) => {
    try {
      await academyService.upsertActivity(data);
      toast.success(data.id ? "Clase actualizada" : "Clase creada con éxito");
      setIsEditorOpen(false);
      fetchActivities();
    } catch (error) {
      toast.error("Error al guardar la actividad");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta clase?")) return;
    try {
      await academyService.deleteActivity(id);
      toast.success("Clase eliminada");
      fetchActivities();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-10 bg-blue-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">GESTIÓN DE CONTENIDO</span>
          </div>
          <h1 className="text-4xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
            Administrar <br /> <span className="text-blue-600">Academia y Clases</span>
          </h1>
        </div>

        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-xs"
        >
          <Plus className="h-5 w-5" /> Nueva Clase
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Clases Publicadas", value: activities.filter(a => a.status === 'published').length.toString(), icon: CheckCircle, color: "text-green-600" },
           { label: "Total Actividades", value: activities.length.toString(), icon: GraduationCap, color: "text-blue-600" },
           { label: "Borradores", value: activities.filter(a => a.status === 'draft').length.toString(), icon: Clock, color: "text-zinc-400" },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6">
              <div className={`h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center ${stat.color}`}>
                 <stat.icon className="h-7 w-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
         <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por título o nivel..."
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 ring-blue-600/20 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Main Activities Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-zinc-100 dark:border-zinc-900">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Título de la Clase</th>
                  <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Nivel</th>
                  <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado</th>
                  <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Acciones</th>
               </tr>
            </thead>
            <tbody>
               {isLoading ? (
                 <tr>
                   <td colSpan={5} className="px-10 py-32 text-center">
                     <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                   </td>
                 </tr>
               ) : filteredActivities.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <div className="max-w-xs mx-auto space-y-4">
                          <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-200 dark:text-zinc-800 mx-auto">
                             <GraduationCap className="h-10 w-10" />
                          </div>
                          <p className="text-zinc-400 font-medium text-sm">No se encontraron clases. ¡Crea la primera ahora!</p>
                       </div>
                    </td>
                 </tr>
               ) : (
                filteredActivities.map((activity) => (
                   <tr key={activity.id} className="border-b border-zinc-50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group">
                     <td className="px-10 py-6">
                        <p className="font-bold text-zinc-900 dark:text-zinc-50">{activity.title}</p>
                        <p className="text-xs text-zinc-400 truncate max-w-xs">{activity.description}</p>
                     </td>
                     <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          {activity.level}
                        </span>
                     </td>
                     <td className="px-6 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          activity.status === 'published' ? 'text-green-600' : 'text-zinc-400'
                        }`}>
                          {activity.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleEdit(activity)}
                             className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                           >
                              <Edit3 className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={() => handleDelete(activity.id)}
                             className="h-10 w-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <ActivityEditor 
            initialData={editingActivity}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
