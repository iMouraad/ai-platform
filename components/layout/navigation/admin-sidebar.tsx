"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Database, Tags, Users } from "lucide-react";
import { clsx } from "clsx";

export const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Directorio",
      href: "/admin/directory",
      icon: <Database className="w-4 h-4" />,
    },
    {
      name: "Categorías",
      href: "/admin/categories",
      icon: <Tags className="w-4 h-4" />,
    },
    {
      name: "Usuarios",
      href: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-72 border-r border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0 transition-colors z-50">
      <div className="p-8 flex flex-col h-full">
        
        {/* Back to Portal Button */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-3 px-5 py-4 mb-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-3 h-3 text-white" />
          </div>
          Volver al Portal
        </Link>

        {/* Section Identifier */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Panel de Control
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 translate-x-2"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                )}
              >
                <div className={clsx(
                  "p-2 rounded-xl transition-colors",
                  isActive ? "bg-white/10" : "bg-zinc-100 dark:bg-zinc-900 group-hover:bg-white dark:group-hover:bg-zinc-800"
                )}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Subtle Footer */}
        <div className="pt-6 border-t border-zinc-50 dark:border-zinc-900/50 mt-auto">
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center opacity-40">
            AI Platform v1.0 • Power Access
          </p>
        </div>
      </div>
    </aside>
  );
};

