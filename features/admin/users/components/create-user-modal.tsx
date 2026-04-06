"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserData } from "../schemas/create-user-schema";
import { createUserByAdmin } from "../actions/create-user-admin";
import { Plus, X, Loader2, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

export const CreateUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "student",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateUserData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await createUserByAdmin(data);
      if (response.success) {
        setSuccess(response.message);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
          reset();
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all outline-none"
      >
        <Plus className="h-4 w-4" />
        Nuevo Humano
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-10">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => !isLoading && setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-900/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <UserPlus className="h-5 w-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Crear Humano</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Control de Comunidad Pro</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl transition-all disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Primer Nombre</label>
                    <input 
                      {...register("firstName")}
                      placeholder="Ej. Marina"
                      className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                    />
                    {errors.firstName && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.firstName.message}</span>}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Primer Apellido</label>
                    <input 
                      {...register("lastName")}
                      placeholder="Ej. López"
                      className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                    />
                    {errors.lastName && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.lastName.message}</span>}
                  </div>
               </div>

               {/* Email */}
               <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Correo Electrónico</label>
                  <input 
                    {...register("email")}
                    type="email"
                    placeholder="humano@ejemplo.com"
                    className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                  />
                  {errors.email && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.email.message}</span>}
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {/* Role Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Rol de Acceso</label>
                    <select 
                      {...register("role")}
                      className="flex h-12 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1.25rem_center] bg-no-repeat"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Account Status */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">Estado de Cuenta</label>
                    <label className="flex items-center gap-3 h-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 cursor-pointer group">
                       <input 
                         {...register("isActive")}
                         type="checkbox"
                         className="h-5 w-5 rounded-lg border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-600 outline-none transition-all"
                       />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 transition-colors">Activo</span>
                    </label>
                  </div>
               </div>

               {/* Feedback UI */}
               {error && (
                 <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                 </div>
               )}
               {success && (
                 <div className="p-4 bg-emerald-600/5 border border-emerald-600/20 rounded-2xl flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                 </div>
               )}

               {/* Action Button */}
               <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading || !!success}
                    className="relative w-full inline-flex items-center justify-center p-0.5 rounded-2xl overflow-hidden font-black text-[10px] uppercase tracking-[0.25em] transition-all active:scale-[0.98] shadow-2xl shadow-blue-600/30 disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-blue-600" />
                    <span className="relative w-full py-5 bg-zinc-900 dark:bg-zinc-950 text-white rounded-[0.9rem] flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generando Humano...
                        </>
                      ) : success ? "Enviando Activación..." : "Registrar Humano"}
                    </span>
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
