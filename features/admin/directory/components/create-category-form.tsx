"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/features/directory/schemas/tool-schema";
import { createCategory } from "../actions/create-category";
import { useState } from "react";

export const CreateCategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setMessage(null);
    const result = await createCategory(data);
    
    if (result.success) {
      setMessage({ type: "success", text: "¡Categoría creada con éxito!" });
      reset();
    } else {
      setMessage({ type: "error", text: result.message || "Ocurrió un error" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nombre de la Categoría</label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          placeholder="Ej: Generación de Texto"
        />
        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Descripción (Opcional)</label>
        <textarea
          {...register("description")}
          className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[80px]"
          placeholder="Breve descripción..."
        />
        {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 text-sm"
      >
        {loading ? "Guardando..." : "Crear Categoría"}
      </button>
    </form>
  );
};
