"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterData } from "../schemas/register-schema";
import { registerUser } from "../actions/register-user";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      countryCode: "EC",
      documentType: "cedula"
    }
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerUser(data);
      if (result.success) setSuccess(true);
      else setError(result.message);
    } catch (err: any) {
      setError(err.message || "Error al procesar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in zoom-in duration-800 max-w-[500px] mx-auto">
        <div className="h-24 w-24 rounded-full bg-blue-600/10 flex items-center justify-center mb-4 shadow-2xl shadow-blue-600/20">
          <CheckCircle2 className="h-12 w-12 text-blue-600" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
            ¡Casi listo, <br /> <span className="text-blue-600">Humano!</span> 🚀
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed">
            Hemos enviado un enlace de activación a tu correo. Por favor, revísalo para completar tu cuenta.
          </p>
        </div>
        <Link 
          href="/" 
          className="px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-12 lg:w-[650px]">
      <div className="flex flex-col space-y-3 text-center">
        <h1 className="text-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
          Crea tu <br /> <span className="text-blue-600">Cuenta Pro</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-tight px-4 max-w-md mx-auto">
          Únete a la mayor comunidad de aprendizaje en Inteligencia Artificial y domina el futuro.
        </p>
      </div>

      <div className="max-w-[600px] mx-auto w-full space-y-8">
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-4 group bg-white dark:bg-zinc-950 shadow-xl shadow-blue-500/5"
        >
          <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-2 5.12-7.84 5.12-5.08 0-9.2-4.24-9.2-9.2s4.12-9.2 9.2-9.2c2.8 0 4.72 1.16 5.8 2.2l2.6-2.6C19.12 1.68 15.96.68 12.48.68 5.84.68.48 6.04.48 12.68s5.36 12 12 12c6.88 0 11.44-4.84 11.44-11.64 0-.8-.08-1.4-.24-2.12h-11.2z" />
          </svg>
          Registrarme con Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.5em]">
            <span className="bg-zinc-50 dark:bg-zinc-950 px-5 text-zinc-400">O mediante formulario</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-white dark:bg-zinc-950 p-7 md:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-blue-500/5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Primer Nombre</label>
            <input
              {...register("firstName")}
              placeholder="Juan"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            {errors.firstName && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 mt-0.5">{errors.firstName.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Segundo Nombre (Opt.)</label>
            <input
              {...register("middleName")}
              placeholder="Alberto"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Primer Apellido</label>
            <input
              {...register("lastName")}
              placeholder="Pérez"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            {errors.lastName && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 mt-0.5">{errors.lastName.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Segundo Apellido (Opt.)</label>
            <input
              {...register("secondLastName")}
              placeholder="González"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Tipo de Documento</label>
            <select
              {...register("documentType")}
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1.25rem_center] bg-no-repeat"
            >
              <option value="cedula">Cédula</option>
              <option value="passport">Pasaporte</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Número de Documento</label>
            <input
              {...register("documentNumber")}
              placeholder="123456789"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Email Principal (Personal)</label>
            <input
              {...register("email")}
              type="email"
              placeholder="tu@ejemplo.com"
              className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            {errors.email && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 mt-0.5">{errors.email.message}</span>}
          </div>

          <div className="md:col-span-2 pt-2">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full inline-flex items-center justify-center p-0.5 rounded-2xl overflow-hidden font-black text-[10px] uppercase tracking-[0.25em] transition-all active:scale-95 shadow-xl shadow-blue-600/30"
            >
              <span className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700 transition-colors" />
              <span className="relative w-full py-4 bg-zinc-900 dark:bg-zinc-950 text-white group-hover:bg-transparent transition-all rounded-[0.9rem] flex items-center justify-center gap-3">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear mi cuenta gratuita"}
              </span>
            </button>
            
            <p className="mt-6 text-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
              ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-2">Inicia sesión aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
