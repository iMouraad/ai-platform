"use client";

import React, { useState } from "react";
import { resetPassword } from "@/features/auth/actions/reset-password";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError("Error al enviar las instrucciones.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 max-w-[450px] p-8 md:p-12 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-500">
        <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-3xl flex items-center justify-center border border-green-500/20 mx-auto shadow-inner">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">¡Correo Enviado!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Hemos enviado un enlace de recuperación a <span className="text-blue-600 font-bold">{email}</span>. Revisa tu bandeja de entrada y spam.
          </p>
        </div>
        <Link 
          href="/login" 
          className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-12 max-w-[450px]">
      <div className="flex flex-col space-y-3 text-center px-4">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors mb-6 mx-auto"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Regresar
        </Link>
        <h1 className="text-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
          ¿Olvidaste tu <br /> <span className="text-blue-600">Password?</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-tight mt-2">
          No te preocupes, nos pasa a los mejores. Introduce tu email para recuperar tu acceso.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tu Correo Electrónico</label>
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                className="w-full pl-12 pr-5 py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-sm"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full inline-flex items-center justify-center p-0.5 rounded-2xl overflow-hidden font-black text-xs uppercase tracking-[0.25em] transition-all active:scale-95 shadow-xl shadow-blue-600/30"
          >
            <span className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700 transition-colors" />
            <span className="relative w-full py-5 bg-zinc-900 dark:bg-zinc-950 text-white group-hover:bg-transparent transition-all rounded-[0.9rem] flex items-center justify-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Enviar Instrucciones"
              )}
            </span>
          </button>
        </form>
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 pt-4">
        ¿Recordaste tu password? <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-2 border-b border-blue-600/30">Inicia sesión</Link>
      </p>
    </div>
  );
}
