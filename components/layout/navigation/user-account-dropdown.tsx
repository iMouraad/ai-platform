"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/features/auth/actions/sign-out";

interface UserAccountDropdownProps {
  user: {
    email?: string;
    user_metadata?: {
      username?: string;
      full_name?: string;
    };
  };
  role?: string;
}

export const UserAccountDropdown = ({ user, role }: UserAccountDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const username = user?.user_metadata?.username || user?.email?.split("@")[0];
  const initial = user?.email?.[0].toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 group focus:outline-none"
        suppressHydrationWarning
      >
        <div className="hidden md:flex flex-col items-end px-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
            {username}
          </span>
          <span className={`text-[10px] font-bold leading-tight uppercase ${role === 'admin' ? 'text-red-500' : 'text-zinc-500'}`}>
            {role === 'admin' ? 'Administrador' : 'Estudiante'}
          </span>
        </div>
        
        <div className="relative">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md transition-transform group-hover:scale-105 ${role === 'admin' ? 'bg-gradient-to-br from-red-600 to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            {initial}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm"></div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-[60] animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Tu Cuenta</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user?.email}</p>
          </div>
          
          <div className="space-y-1">
            {role === 'admin' && (
              <Link
                href="/admin/directory"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                </svg>
                Panel Administrador
              </Link>
            )}

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Configurar Perfil
            </Link>
          </div>

          <div className="mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <form action={signOut}>
              <button
                type="submit"
                onClick={() => localStorage.setItem('ai_platform_logout_signal', '1')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
