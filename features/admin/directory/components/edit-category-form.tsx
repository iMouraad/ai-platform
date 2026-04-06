"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/features/directory/schemas/tool-schema";
import { updateCategory } from "../actions/update-category";
import { useState } from "react";
import { Category } from "@/features/directory/types/directory.types";

export const EditCategoryForm = ({ 
  category, 
  onSuccess 
}: { 
  category: Category; 
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    const result = await updateCategory(category.id, data);
    if (result.success) {
      setMessage({ type: "success", text: "¡Categoría actualizada!" });
      setTimeout(onSuccess, 1000);
    } else {
      setMessage({ type: "error", text: result.message || "Error al actualizar" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Nombre</label>
          <input {...register("name")} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Descripción</label>
          <textarea {...register("description")} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent min-h-[100px]" />
        </div>
        <div className="flex items-center gap-2 py-2">
          <input type="checkbox" {...register("is_active")} id="is_active_cat" className="h-4 w-4 rounded border-zinc-300 text-blue-600" />
          <label htmlFor="is_active_cat" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Categoría Activa</label>
        </div>
      </div>

      {message && <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{message.text}</div>}

      <button type="submit" disabled={loading} className="w-full py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50">
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
};
