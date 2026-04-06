"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const RegisterForm = () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight font-outfit">Crear Cuenta</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Únete a la mejor comunidad de IA hoy mismo
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1" htmlFor="full-name">
                Nombre Completo
              </label>
              <input
                id="full-name"
                placeholder="Juan Pérez"
                type="text"
                autoComplete="name"
                disabled={false}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                placeholder="nombre@ejemplo.com"
                type="email"
                autoComplete="email"
                disabled={false}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                placeholder="••••••••"
                type="password"
                disabled={false}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
              />
            </div>
            <Button className="mt-2" variant="primary">
              Registrar cuenta
            </Button>
          </div>
        </form>
      </div>
      <p className="px-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Si continúas, aceptas nuestros Términos de Servicio y Política de Privacidad.
      </p>
      <p className="px-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/login" className="hover:text-blue-600 underline underline-offset-4 font-semibold">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </p>
    </div>
  );
};
