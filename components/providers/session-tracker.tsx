"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";

interface SessionTrackerProps {
  isAuthenticated: boolean;
}

// 10 segundos de prueba
const INACTIVITY_TIMEOUT_MS = 10 * 1000;
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
  if (path === "/") return false;
  return !PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

// Evita advertencias de SSR en NextJS al usar useLayoutEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SessionTracker = ({ isAuthenticated }: SessionTrackerProps) => {
  const isLoggingOut = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Escudo bloqueador ANTES del repintado (Paint):
  // Si Next.js intenta navegar usando su caché interna (Router Cache), 
  // interceptamos el render antes de que aparezca visualmente.
  useIsomorphicLayoutEffect(() => {
    const isLoggedOut = localStorage.getItem(LOGOUT_SIGNAL);
    if (isLoggedOut && isProtectedRoute(pathname)) {
      console.log("[SessionTracker] Blocking render: Session already expired");
      document.body.style.display = 'none';
      window.location.href = '/';
    }
  }, [pathname]);

  useEffect(() => {
    const channel = new BroadcastChannel('ai_platform_session');

    // Fuente de verdad: Si ya hay señal de cierre, fuera.
    if (localStorage.getItem(LOGOUT_SIGNAL) && isProtectedRoute(window.location.pathname)) {
      window.location.replace('/');
      return;
    }

    const forceRedirectToHome = () => {
      const path = window.location.pathname;
      if (isProtectedRoute(path)) {
        console.log("[SessionTracker] Redirecting to home...");
        window.location.replace('/');
      }
    };

    const performLogout = async (reason: string) => {
      if (isLoggingOut.current) return;
      
      console.log(`[SessionTracker] LOGOUT TRIGGERED: ${reason}`);
      isLoggingOut.current = true;
      
      localStorage.setItem(LOGOUT_SIGNAL, Date.now().toString());
      localStorage.removeItem(STORAGE_KEY);
      channel.postMessage('FORCE_LOGOUT');

      // Invalidamos la caché de Next.js
      router.refresh();

      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("SignOut error:", e);
      } finally {
        forceRedirectToHome();
      }
    };

    // 2. Listener de Supabase: La autoridad máxima
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session && isAuthenticated)) {
        // Solo marcamos logout si estábamos protegidos o autenticados
        if (isProtectedRoute(window.location.pathname) || isAuthenticated) {
          localStorage.setItem(LOGOUT_SIGNAL, '1');
          forceRedirectToHome();
        }
      } else if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
        localStorage.removeItem(LOGOUT_SIGNAL);
      }
    });

    // 3. Control de Inactividad
    const updateActivity = () => {
      if (!isLoggingOut.current) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    // Solo inicializamos actividad si estamos autenticados y no hay bloqueo
    if (isAuthenticated && !localStorage.getItem(LOGOUT_SIGNAL)) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        updateActivity();
      }
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    let throttleTimer: NodeJS.Timeout | null = null;
    
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 1000); 
    };

    if (isAuthenticated) {
      events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
    }

    // 4. Verificación proactiva (Intervalo y Eventos de ventana)
    const checkSession = () => {
      if (isLoggingOut.current) return;

      if (localStorage.getItem(LOGOUT_SIGNAL)) {
        forceRedirectToHome();
        return;
      }

      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      if (lastActivityStr && isAuthenticated) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
          void performLogout("Inactivity threshold exceeded");
        }
      }
    };

    // Intervalo para cerrar automáticamente incluso sin interacción
    const interval = setInterval(checkSession, 2000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        console.log("[SessionTracker] Restored from BFCache, checking session...");
        checkSession();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOGOUT_SIGNAL && e.newValue) {
        forceRedirectToHome();
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data === "FORCE_LOGOUT") {
        forceRedirectToHome();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", checkSession);
    channel.addEventListener("message", handleMessage);

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
      channel.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkSession);
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isAuthenticated, supabase, router]);

  return null;
};
