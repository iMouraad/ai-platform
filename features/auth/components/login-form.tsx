"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "../schemas/login-schema";
import Link from "next/link";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (loginError) {
      setError("Credenciales inválidas o cuenta no activada.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-12 max-w-[400px]">
      <div className="flex flex-col space-y-3 text-center">
        <h1 className="text-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
          Bienvenido <br /> <span className="text-blue-600">De Nuevo</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-tight px-4">
          Identifícate para acceder a tu área de aprendizaje y herramientas.
        </p>
      </div>

      <div className="grid gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Email</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              className={`flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
            />
            {errors.email && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-1">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
             <div className="flex justify-between items-center px-1">
               <label htmlFor="password" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Contraseña</label>
               <Link href="/forgot-password" title="¿Olvidaste tu contraseña?" className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">
                 ¿Olvidaste tu contraseña?
               </Link>
             </div>
             <div className="relative">
               <input
                 {...register("password")}
                 id="password"
                 type={showPassword ? "text" : "password"}
                 placeholder="••••••••"
                 className={`flex h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-5 pr-14 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-5 top-4 text-zinc-400 hover:text-blue-600 transition-colors"
               >
                 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
               </button>
             </div>
             {errors.password && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-1">{errors.password.message}</span>}
          </div>

          {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-2">
               <AlertCircle className="h-4 w-4 shrink-0" />
               {error}
             </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full inline-flex items-center justify-center p-0.5 rounded-2xl overflow-hidden font-black text-xs uppercase tracking-[0.25em] transition-all active:scale-95 shadow-xl shadow-blue-600/20"
          >
            <span className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700 transition-colors" />
            <span className="relative w-full py-5 bg-zinc-900 dark:bg-zinc-950 text-white group-hover:bg-transparent transition-all rounded-[0.9rem] flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Iniciar Sesión"}
            </span>
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em]">
            <span className="bg-white dark:bg-zinc-950 px-5 text-zinc-400">Alternativas</span>
          </div>
        </div>

        <button 
          type="button"
          className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-4 group"
        >
          <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-2 5.12-7.84 5.12-5.08 0-9.2-4.24-9.2-9.2s4.12-9.2 9.2-9.2c2.8 0 4.72 1.16 5.8 2.2l2.6-2.6C19.12 1.68 15.96.68 12.48.68 5.84.68.48 6.04.48 12.68s5.36 12 12 12c6.88 0 11.44-4.84 11.44-11.64 0-.8-.08-1.4-.24-2.12h-11.2z" />
          </svg>
          Acceder con Google
        </button>
      </div>

      <p className="text-center text-[11px] font-black uppercase tracking-widest text-zinc-400 pt-8">
        ¿Aún no tienes cuenta? <Link href="/register" className="text-blue-600 hover:text-blue-700 ml-2">Crea una aquí</Link>
      </p>
    </div>
  );
};
