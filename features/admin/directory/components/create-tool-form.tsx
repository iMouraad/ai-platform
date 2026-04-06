"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toolSchema, ToolFormData } from "@/features/directory/schemas/tool-schema";
import { createTool } from "../actions/create-tool";
import { useState, useRef } from "react";
import { Category } from "@/features/directory/types/directory.types";

export const CreateToolForm = ({ categories }: { categories: Category[] }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      is_active: true,
      logo_url: "",
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ToolFormData) => {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("official_url", data.official_url);
    formData.append("short_description", data.short_description);
    formData.append("category_id", data.category_id);
    formData.append("is_active", String(data.is_active));
    formData.append("logo_url", data.logo_url || "");

    if (fileInputRef.current?.files?.[0]) {
      formData.append("logo_file", fileInputRef.current.files[0]);
    }

    const result = await createTool(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "¡Herramienta creada con éxito!" });
      reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setMessage({ type: "error", text: result.message || "Ocurrió un error" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-blue-500/5">
      <div className="flex items-center gap-6 mb-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <div className="h-20 w-20 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-blue-600">+</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Logo de la IA</label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600/10 file:text-blue-600 hover:file:bg-blue-600/20 transition-all cursor-pointer" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre de la IA</label>
          <input
            {...register("name")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: ChatGPT"
          />
          {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Enlace Oficial</label>
          <input
            {...register("official_url")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="https://..."
          />
          {errors.official_url && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.official_url.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descripción Corta</label>
          <textarea
            {...register("short_description")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm min-h-[120px]"
            placeholder="Explica qué hace esta IA..."
          />
          {errors.short_description && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.short_description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Categoría</label>
          <select
            {...register("category_id")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm appearance-none"
          >
            <option value="">Selecciona una...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">URL Alternativa (Opcional)</label>
          <input
            {...register("logo_url")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="https://..."
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          <div className={`h-2 w-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 h-16 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : "Registrar Herramienta"}
      </button>
    </form>
  );
};
