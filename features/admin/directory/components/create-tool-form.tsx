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
      is_verified: false,
      logo_url: "",
      video_url: "",
      content: "",
      pricing: "",
      target_audience: "",
      pros: "",
      features: "",
      suggested_prompts: "",
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
    formData.append("is_verified", String(data.is_verified));
    formData.append("logo_url", data.logo_url || "");
    formData.append("video_url", data.video_url || "");
    formData.append("content", data.content || "");
    formData.append("pricing", data.pricing || "");
    formData.append("target_audience", data.target_audience || "");
    formData.append("pros", data.pros || "");
    formData.append("features", data.features || "");
    formData.append("suggested_prompts", data.suggested_prompts || "");

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
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Plan de Precios</label>
          <input
            {...register("pricing")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: Gratis, Freemium, $20/m"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Público Objetivo</label>
          <input
            {...register("target_audience")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: Estudiantes, Programadores"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            Fortalezas <span className="text-[8px] opacity-50 lowercase tracking-normal">(separadas por coma)</span>
          </label>
          <input
            {...register("pros")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: Muy rápida, Interfaz limpia, Soporta PDF"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            Características Técnicas <span className="text-[8px] opacity-50 lowercase tracking-normal">(separadas por coma)</span>
          </label>
          <input
            {...register("features")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: Análisis de Datos, Generación de Imagen, API"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            Prompts Sugeridos <span className="text-[8px] opacity-50 lowercase tracking-normal">(separados por coma)</span>
          </label>
          <input
            {...register("suggested_prompts")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="Ej: Hazme un resumen, Explícame esto..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">URL de Video/GIF (Demo)</label>
          <input
            {...register("video_url")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">URL Alternativa Logo</label>
          <input
            {...register("logo_url")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descripción Detallada (Markdown)</label>
          <textarea
            {...register("content")}
            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm min-h-[150px]"
            placeholder="Escribe todo el detalle de la herramienta aquí..."
          />
        </div>

        <div className="flex items-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 md:col-span-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("is_verified")}
              className="w-5 h-5 rounded-lg border-zinc-300 text-blue-600 focus:ring-blue-600 bg-white"
            />
            <label className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Verificada por PDIA</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("is_active")}
              className="w-5 h-5 rounded-lg border-zinc-300 text-green-600 focus:ring-green-600 bg-white"
            />
            <label className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Visible en Directorio</label>
          </div>
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
