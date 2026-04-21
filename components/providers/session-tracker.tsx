"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";

interface SessionTrackerProps {
  isAuthenticated: boolean;
}

// 10 segundos de prueba
const INACTIVITY_TIMEOUT_MS = 10 * 1000;
const STORAGE_KEY = "ai_platform_last_activity";
const LOGOUT_SIGNAL = "ai_platform_logout_signal";
const BROADCAST_CHANNEL = "ai_platform_session";

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
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const SessionTracker = ({ isAuthenticated }: SessionTrackerProps) => {
  const isLoggingOut = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Escudo bloqueador ANTES del repintado (Paint):
  // Interceptamos el render antes de que aparezca visualmente.
  useIsomorphicLayoutEffect(() => {
    if (localStorage.getItem(LOGOUT_SIGNAL) && isProtectedRoute(pathname)) {
      console.log("[SessionTracker] Blocking render: Session already expired");
      document.body.style.display = "none";
      window.location.href = "/";
    }
  }, [pathname]);

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);

    // Fuente de verdad: Si ya hay señal de cierre, fuera.
    if (
      localStorage.getItem(LOGOUT_SIGNAL) &&
      isProtectedRoute(window.location.pathname)
    ) {
      window.location.replace("/");
      return;
    }

    const forceRedirectToHome = () => {
      if (isProtectedRoute(window.location.pathname)) {
        console.log("[SessionTracker] Redirecting to home...");
        window.location.replace("/");
      }
    };

    const performLogout = async (reason: string) => {
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;

      console.log(`[SessionTracker] LOGOUT TRIGGERED: ${reason}`);
      localStorage.setItem(LOGOUT_SIGNAL, Date.now().toString());
      localStorage.removeItem(STORAGE_KEY);

      // Notifica otras pestañas del mismo navegador
      channel.postMessage("FORCE_LOGOUT");

      // Invalida la caché de Next.js
      router.refresh();

      try {
        // scope:'global' invalida TODAS las sesiones en el servidor
        // (incluye otros navegadores como Chrome/Firefox simultáneamente)
        await supabase.auth.signOut({ scope: "global" });
      } catch (e) {
        console.error("SignOut error:", e);
      } finally {
        forceRedirectToHome();
      }
    };

    // 2. Listener de Supabase: autoridad máxima
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_OUT" ||
        (event === "INITIAL_SESSION" && !session && isAuthenticated)
      ) {
        if (isProtectedRoute(window.location.pathname) || isAuthenticated) {
          localStorage.setItem(LOGOUT_SIGNAL, "1");
          forceRedirectToHome();
        }
      } else if (
        event === "SIGNED_IN" ||
        (event === "INITIAL_SESSION" && session)
      ) {
        localStorage.removeItem(LOGOUT_SIGNAL);
      }
    });

    // 3. Control de inactividad
    const updateActivity = () => {
      if (!isLoggingOut.current) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    // FIX: Siempre resetear el timestamp al montar.
    // Navegar o refrescar la página ES una acción del usuario.
    // La lógica anterior solo inicializaba si no existía la clave, lo que
    // causaba que el timer continuara desde una sesión previa al hacer refresh.
    if (isAuthenticated && !localStorage.getItem(LOGOUT_SIGNAL)) {
      updateActivity();
    }

    // FIX: Sin 'mousemove' — demasiado sensible a micro-movimientos involuntarios.
    // Solo acciones deliberadas del usuario reinician el timer de inactividad.
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 1000);
    };

    if (isAuthenticated) {
      events.forEach((event) =>
        window.addEventListener(event, handleActivity, { passive: true })
      );
    }

    // Verificación de inactividad (sync, sin red) — usada por el intervalo
    const checkInactivity = () => {
      if (isLoggingOut.current || !isAuthenticated) return;

      if (localStorage.getItem(LOGOUT_SIGNAL)) {
        forceRedirectToHome();
        return;
      }

      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      if (lastActivityStr) {
        const elapsed = Date.now() - parseInt(lastActivityStr, 10);
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          void performLogout("Inactivity timeout");
        }
      }
    };

    // Verificación completa (async, con red) — usada al recuperar foco/visibilidad.
    // Detecta logout cross-browser: valida la sesión directamente contra Supabase.
    // Si Firefox cerró la sesión con scope:'global', getUser() devuelve error en Chrome.
    const checkSessionOnFocus = async () => {
      if (isLoggingOut.current || !isAuthenticated) return;

      if (localStorage.getItem(LOGOUT_SIGNAL)) {
        forceRedirectToHome();
        return;
      }

      // Primero verifica inactividad local (sin red)
      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      if (lastActivityStr) {
        const elapsed = Date.now() - parseInt(lastActivityStr, 10);
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          await performLogout("Inactivity timeout (on focus)");
          return;
        }
      }

      // Luego valida contra el servidor de Supabase.
      // getUser() siempre hace una petición al servidor (a diferencia de getSession()).
      const { error } = await supabase.auth.getUser();
      if (error) {
        await performLogout("Session invalidated on server");
      }
    };

    // 4. Intervalo local: cubre el caso del usuario en la misma pestaña sin interactuar.
    // También actúa como fallback para múltiples pestañas del mismo sitio
    // (localStorage es compartido, la pestaña activa actualiza el timestamp para todas).
    const interval = setInterval(checkInactivity, 2000);

    // Al recuperar visibilidad: cubre el caso de otra pestaña/otra app.
    // Los navegadores throttlean setInterval en pestañas ocultas, por eso
    // es crítico verificar aquí el tiempo transcurrido real.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSessionOnFocus();
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;

      console.log("[SessionTracker] Restored from BFCache");

      // Solo aplica en rutas protegidas
      if (!isProtectedRoute(window.location.pathname)) return;

      // Si el logout estaba en curso cuando la página fue congelada, o ya hay señal:
      // redirigir de inmediato sin mostrar nada (sin flash).
      if (isLoggingOut.current || localStorage.getItem(LOGOUT_SIGNAL)) {
        document.body.style.display = "none";
        window.location.replace("/");
        return;
      }

      // El ref puede estar obsoleto al restaurar del BFCache — resetear.
      isLoggingOut.current = false;

      // Ocultar contenido ANTES de la validación async para eliminar el flash.
      // Se restaura solo si la sesión sigue siendo válida.
      document.body.style.visibility = "hidden";

      checkSessionOnFocus().finally(() => {
        if (!isLoggingOut.current) {
          document.body.style.visibility = "visible";
        }
      });
    };

    // Sincronización entre pestañas del mismo navegador via localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOGOUT_SIGNAL && e.newValue) forceRedirectToHome();
    };

    // Sincronización entre pestañas del mismo navegador via BroadcastChannel
    const handleMessage = (e: MessageEvent) => {
      if (e.data === "FORCE_LOGOUT") forceRedirectToHome();
    };

    const handleFocus = () => void checkSessionOnFocus();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    channel.addEventListener("message", handleMessage);

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
      channel.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isAuthenticated, supabase, router]);

  return null;
};
