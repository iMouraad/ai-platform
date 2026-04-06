"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activatePasswordSchema, type ActivatePasswordData } from "../schemas/activate-password-schema";
import { activateAccount } from "../actions/activate-account";
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export const ActivateAccountForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivatePasswordData>({
    resolver: zodResolver(activatePasswordSchema),
  });

  const onSubmit = async (data: ActivatePasswordData) => {
    if (!token) {
      setError("Token de activación no encontrado.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await activateAccount(token, data);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Error al activar la cuenta.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-3xl flex items-center justify-center border border-green-500/20 shadow-inner">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">¡Activado!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Tu cuenta ha sido verificada con éxito. Prepárate para entrar en segundos.
          </p>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full animate-progress rounded-full" style={{ animationDuration: '3s' }} />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-red-500/10 border border-zinc-200 dark:border-zinc-800">
        <div className="h-20 w-20 bg-red-500/10 text-red-600 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-inner">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black font-outfit tracking-tighter text-red-600 uppercase leading-none">Vínculo Roto</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Este enlace es inválido o ha expirado por seguridad.
          </p>
        </div>
        <Link href="/register" className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 transition-all">
          Registrarme de nuevo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h1 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">Último Paso</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">
          Estás a punto de dominar la IA
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border ${errors.password ? 'border-red-500/50' : 'border-zinc-200 dark:border-zinc-800'} focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirma tu Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Repite tu contraseña"
                className={`w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border ${errors.confirmPassword ? 'border-red-500/50' : 'border-zinc-200 dark:border-zinc-800'} focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm`}
              />
              {errors.confirmPassword && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide animate-shake">
               <AlertCircle className="h-5 w-5 shrink-0" />
               {error}
             </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Activar Acceso"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
