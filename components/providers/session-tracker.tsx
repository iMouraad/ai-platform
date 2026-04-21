"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";

interface SessionTrackerProps {
  isAuthenticated: boolean;
}

// CONFIGURACIÓN DE PRODUCCIÓN: 30 minutos de inactividad
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; 
const STORAGE_KEY = "ai_platform_last_activity";
const LOGOUT_SIGNAL = "ai_platform_logout_signal";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/auth",
  "/activate-account",
  "/forgot-password",
];

const isProtectedRoute = (path: string) => {
  if (path === "/" || path === "") return false;
  return !PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

// Evita advertencias de SSR en NextJS al usar useLayoutEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SessionTracker = ({ isAuthenticated }: SessionTrackerProps) => {
  const isLoggingOut = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Escudo bloqueador antes del render (Paint)
  useIsomorphicLayoutEffect(() => {
    const isLoggedOut = localStorage.getItem(LOGOUT_SIGNAL);
    // Solo bloqueamos si hay señal de cierre Y estamos en ruta protegida
    if (isLoggedOut && isProtectedRoute(pathname)) {
      console.log("[SessionTracker] Bloqueando render: Sesión expirada");
      document.body.style.display = 'none';
      window.location.href = '/';
    }
  }, [pathname]);

  useEffect(() => {
    const channel = new BroadcastChannel('ai_platform_session');

    // SI ESTAMOS AUTENTICADOS, LIMPIAMOS LA SEÑAL DE CIERRE PREVIA
    if (isAuthenticated) {
      localStorage.removeItem(LOGOUT_SIGNAL);
    }

    const forceRedirectToHome = () => {
      const path = window.location.pathname;
      if (isProtectedRoute(path)) {
        console.log("[SessionTracker] Redirigiendo al home por inactividad...");
        window.location.replace('/');
      }
    };

    const performLogout = async (reason: string) => {
      if (isLoggingOut.current) return;
      
      console.log(`[SessionTracker] CERRANDO SESIÓN: ${reason}`);
      isLoggingOut.current = true;
      
      localStorage.setItem(LOGOUT_SIGNAL, Date.now().toString());
      localStorage.removeItem(STORAGE_KEY);
      channel.postMessage('FORCE_LOGOUT');

      // Intentar cerrar sesión en Supabase
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Error al cerrar sesión en Supabase:", e);
      } finally {
        forceRedirectToHome();
        router.refresh();
      }
    };

    // 2. Control de Actividad con Throttle
    const updateActivity = () => {
      if (!isLoggingOut.current && isAuthenticated) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    let throttleTimer: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 2000); // Solo escribimos en localStorage cada 2 segundos máximo
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    
    if (isAuthenticated) {
      events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
      updateActivity(); // Inicializar al entrar
    }

    // 3. Verificación periódica (Vigilante)
    const checkSession = () => {
      if (isLoggingOut.current || !isAuthenticated) return;

      if (localStorage.getItem(LOGOUT_SIGNAL)) {
        forceRedirectToHome();
        return;
      }

      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        const diff = Date.now() - lastActivity;

        if (diff >= INACTIVITY_TIMEOUT_MS) {
          void performLogout("Inactividad prolongada");
        }
      }
    };

    const interval = setInterval(checkSession, 5000); // Revisar cada 5 segundos

    // 4. Sincronización entre Pestañas y Visibilidad
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkSession();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOGOUT_SIGNAL && e.newValue) forceRedirectToHome();
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data === "FORCE_LOGOUT") forceRedirectToHome();
    };

    // 5. Escuchar cambios de autenticación externos
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        performLogout("Sesión terminada externamente");
      }
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", checkSession);
    channel.addEventListener("message", handleMessage);

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
      events.forEach(event => window.removeEventListener(event, handleActivity));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkSession);
      channel.close();
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isAuthenticated, supabase, router]);

  return null;
};
