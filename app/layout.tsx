"use client";

import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SessionTracker } from "@/components/providers/session-tracker";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// Parche global para compatibilidad con Transformers.js / Turbopack
if (typeof window !== 'undefined') {
  if (!(window as any).process) (window as any).process = { env: {} };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // 1. Revisión inicial de sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // 2. Escuchar cambios de estado en tiempo real (Sincronización Total)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionTracker isAuthenticated={isAuthenticated} />
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <ThemeToggle />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
