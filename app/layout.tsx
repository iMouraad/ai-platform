"use client";

import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SessionTracker } from "@/components/providers/session-tracker";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, [supabase]);

  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      {/* Script de seguridad: corre sincrónicamente antes de que React hidrate.
          Bloquea el render si hay señal de logout activa en rutas protegidas.
          Cubre race conditions durante hidratación y restauración de BFCache. */}
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            try {
              if (!localStorage.getItem('ai_platform_logout_signal')) return;
              var p = window.location.pathname;
              if (p === '/') return;
              var pub = ['/login','/register','/auth','/activate-account','/forgot-password'];
              for (var i = 0; i < pub.length; i++) {
                if (p.indexOf(pub[i]) === 0) return;
              }
              document.documentElement.style.visibility = 'hidden';
              window.location.replace('/');
            } catch(e) {}
          })();
        `}} />
      </head>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
