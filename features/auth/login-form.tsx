"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight font-outfit">Iniciar Sesión</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Introduce tu email para entrar en tu cuenta
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                placeholder="nombre@ejemplo.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
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
                autoComplete="current-password"
                disabled={false}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
              />
            </div>
            <Button className="mt-2" variant="primary">
              Entrar
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-zinc-500 font-medium">O continúa con</span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={false}>
          {/* Simple Icon placeholder */}
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </span>
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/register" className="hover:text-blue-600 underline underline-offset-4 font-semibold">
          ¿No tienes cuenta? Regístrate
        </Link>
      </p>
    </div>
  );
};
