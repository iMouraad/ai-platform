"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileUpdateData } from "../schemas/profile-schema";
import { updateProfile } from "../actions/update-profile";
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Code, // Cambiado de Github
  Link as LinkIcon, // Cambiado de Linkedin
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Flag
} from "lucide-react";
import { clsx } from "clsx";

interface ProfileFormProps {
  initialData: any; // User profile from server
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: initialData.display_name || "",
      bio: initialData.bio || "",
      phone: initialData.phone || "",
      city: initialData.city || "",
      country: initialData.country || "",
      website_url: initialData.website_url || "",
      github_url: initialData.github_url || "",
      linkedin_url: initialData.linkedin_url || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await updateProfile(data);
      if (response.success) {
        setSuccess(response.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Error inesperado al guardar los cambios.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                 <User className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Configuración Personal</span>
           </div>
           <h1 className="text-5xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
             Mi <span className="text-blue-600">Perfil</span>
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm max-w-md">
             Gestiona tu identidad digital en la plataforma. Algunos datos protegidos solo pueden ser actualizados por administradores.
           </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-32">
        {/* --- SECCIÓN 1: IDENTIDAD PROTEGIDA (SOLO LECTURA) --- */}
        <section className="space-y-8 bg-zinc-100 dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lock className="h-20 w-20" />
           </div>

           <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="h-6 w-6 text-zinc-400" />
              <div>
                 <h2 className="text-sm font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">Identidad Legal Protegida</h2>
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inmodificable por seguridad</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Nombres Completos</label>
                 <div className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 items-center text-sm font-bold text-zinc-500">
                    <User className="h-4 w-4 mr-3 opacity-40" />
                    {initialData.first_name} {initialData.middle_name} {initialData.last_name} {initialData.second_last_name}
                 </div>
              </div>

              {/* Email */}
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Correo Institucional</label>
                 <div className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 items-center text-sm font-bold text-zinc-500">
                    <Mail className="h-4 w-4 mr-3 opacity-40" />
                    {initialData.email}
                 </div>
              </div>

              {/* Document ID */}
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Cédula / Documento</label>
                 <div className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 items-center text-sm font-bold text-zinc-500 uppercase">
                    <CreditCard className="h-4 w-4 mr-3 opacity-40" />
                    {initialData.document_type}: {initialData.document_number}
                 </div>
              </div>

              {/* Role */}
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Rol en la Plataforma</label>
                 <div className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 items-center gap-3">
                    <div className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                       {initialData.role}
                    </div>
                    <span className="text-xs font-bold text-zinc-400">Miembro desde {new Date(initialData.created_at).getFullYear()}</span>
                 </div>
              </div>
           </div>

           <div className="mt-4 p-4 bg-zinc-200/40 dark:bg-zinc-900/80 rounded-2xl border border-zinc-300/30 flex items-center gap-4">
              <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0" />
              <p className="text-[9px] font-black uppercase tracking-widest leading-tight text-zinc-400">
                 Dato legal protegido según políticas institucionales. Si crees que hay un error, contacta a soporte.
              </p>
           </div>
        </section>

        {/* --- SECCIÓN 2: PERSONALIZACIÓN (EDITABLE) --- */}
        <section className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                 <Globe className="h-4 w-4" />
              </div>
              <div>
                 <h2 className="text-sm font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">Información Pública y Social</h2>
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Personaliza cómo te ven los demás</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Display Name */}
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Nombre Visible (Display Name)</label>
                 <input 
                   {...register("display_name")}
                   placeholder="Ej. Marina López"
                   className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400"
                 />
                 {errors.display_name && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.display_name.message}</span>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Teléfono de contacto</label>
                 <input 
                   {...register("phone")}
                   placeholder="+593 ..."
                   className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400"
                 />
              </div>

              {/* Bio */}
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Biografía Breve</label>
                 <textarea 
                   {...register("bio")}
                   rows={4}
                   placeholder="Cuéntanos un poco sobre ti y tus intereses en la IA..."
                   className="flex w-full rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 resize-none"
                 />
              </div>

              {/* Location */}
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Ciudad</label>
                 <input 
                   {...register("city")}
                   placeholder="Quevedo"
                   className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">País</label>
                 <input 
                   {...register("country")}
                   placeholder="Ecuador"
                   className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400"
                 />
              </div>
           </div>

           {/* Social Links */}
           <div className="space-y-8 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Github</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors">
                          <Code className="h-4 w-4" />
                       </div>
                       <input 
                         {...register("github_url")}
                         placeholder="URL Perfil"
                         className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">LinkedIn</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors">
                          <LinkIcon className="h-4 w-4" />
                       </div>
                       <input 
                         {...register("linkedin_url")}
                         placeholder="URL Perfil"
                         className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Website</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors">
                          <Globe className="h-4 w-4" />
                       </div>
                       <input 
                         {...register("website_url")}
                         placeholder="URL Sitio"
                         className="flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- FEEDBACK Y ACCIONES --- */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-10 z-40">
           <div className="bg-zinc-900/90 dark:bg-white/90 backdrop-blur-2xl p-4 md:p-6 rounded-3xl border border-zinc-800 dark:border-zinc-200 shadow-2xl flex items-center justify-between gap-6 overflow-hidden relative">
              
              {/* Decorative gradient for success/error */}
              <div className={clsx(
                "absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-700",
                success ? "w-full bg-emerald-500" : error ? "w-full bg-red-500" : "w-0"
              )} />

              <div className="flex items-center gap-3">
                 {isLoading ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                 ) : success ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                 ) : error ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                 ) : (
                    <Save className="h-5 w-5 text-zinc-400" />
                 )}
                 <div>
                    <span className={clsx(
                      "text-[10px] font-black uppercase tracking-[0.2em] block",
                      success ? "text-emerald-500" : error ? "text-red-500" : "text-zinc-500"
                    )}>
                       {success || error || "Pendiente de Guardar"}
                    </span>
                    {!success && !error && <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest opacity-60">Cambios no guardados</span>}
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                  type="button"
                  onClick={() => window.location.reload()}
                  disabled={isLoading}
                  className="px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors disabled:opacity-50"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit"
                   disabled={isLoading}
                   className="px-8 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                   Guardar Cambios
                 </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};
