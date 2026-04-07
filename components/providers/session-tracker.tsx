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

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/auth',
  '/activate-account',
  '/forgot-password'
];

const isProtectedRoute = (path: string) => {
  if (path === '/') return false;
  return !PUBLIC_ROUTES.some(route => path.startsWith(route));
};

// Evita advertencias de SSR en NextJS al usar useLayoutEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SessionTracker = ({ isAuthenticated }: SessionTrackerProps) => {
  const isLoggingOut = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Escudo bloqueador ANTES del repintado (Paint): si Next.js intenta retroceder
  // aplicando su memoria caché (Router Cache), interceptamos el render antes de que 
  // aparezca visualmente gracias a useLayoutEffect.
  useIsomorphicLayoutEffect(() => {
    if (localStorage.getItem(LOGOUT_SIGNAL) && isProtectedRoute(pathname)) {
      document.body.style.display = 'none'; // Pantalla negra antes de existir el fantasma
      window.location.href = '/';
    }
  }, [pathname]);

  useEffect(() => {
    // 2. Blindaje de montaje primario
    if (localStorage.getItem(LOGOUT_SIGNAL) && isProtectedRoute(window.location.pathname)) {
      document.body.style.display = 'none';
      window.location.href = '/';
      return;
    }

    const channel = new BroadcastChannel('ai_platform_session');

    const forceRedirectToHome = () => {
      if (isProtectedRoute(window.location.pathname)) {
        window.location.replace('/');
      } else if (window.location.pathname === '/') {
        window.location.reload();
      }
    };

    // 3. Fuente de verdad estricta de Autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session && isAuthenticated)) {
        localStorage.setItem(LOGOUT_SIGNAL, '1');
        forceRedirectToHome();
      } else if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
        // Solo aquí (verificación REAL en el servidor de Supabase) podemos confiar en que la 
        // sesión está activa. ¡Nunca confiar en el 'isAuthenticated' cacheado en la memoria SPA 
        // para destrabar el candado de logsout!
        localStorage.removeItem(LOGOUT_SIGNAL);
      }
    });

    // Control BFCache nativo de hardware
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && localStorage.getItem(LOGOUT_SIGNAL)) {
        forceRedirectToHome();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // Control History API para SPA
    const handlePopState = () => {
      if (localStorage.getItem(LOGOUT_SIGNAL)) {
        document.body.style.display = 'none';
        forceRedirectToHome();
      }
    };
    window.addEventListener("popstate", handlePopState);

    // Detección inter-pestañas confiable pasiva
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOGOUT_SIGNAL && event.newValue === '1') {
        forceRedirectToHome();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Rescate para Memory Saver feature (Chrome/Edge hibernan la pestaña)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (localStorage.getItem(LOGOUT_SIGNAL)) {
          forceRedirectToHome();
          return;
        }

        if (isAuthenticated && !isLoggingOut.current) {
          const lastActivityStr = localStorage.getItem(STORAGE_KEY);
          if (lastActivityStr) {
            const lastActivity = parseInt(lastActivityStr, 10);
            if (Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
              performLogout();
            }
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const performLogout = async () => {
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;
      localStorage.setItem(LOGOUT_SIGNAL, '1');
      localStorage.removeItem(STORAGE_KEY);
      channel.postMessage('FORCE_LOGOUT');
      
      // Destruimos la caché de enrutamiento interno
      router.refresh();

      await supabase.auth.signOut();
      forceRedirectToHome();
    };

    const updateActivityInfo = () => {
      if (!isLoggingOut.current) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    updateActivityInfo();

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    let throttleTimer: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivityInfo();
        throttleTimer = null;
      }, 1000);
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    let checkInterval: NodeJS.Timeout | null = null;

    if (isAuthenticated) {
      checkInterval = setInterval(async () => {
        if (isLoggingOut.current) return;

        if (localStorage.getItem(LOGOUT_SIGNAL)) {
          forceRedirectToHome();
          return;
        }

        const lastActivityStr = localStorage.getItem(STORAGE_KEY);
        if (lastActivityStr) {
          const lastActivity = parseInt(lastActivityStr, 10);
          if (Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
            await performLogout();
          }
        }
      }, 3000);
    }

    return () => {
      channel.close();
      authListener.subscription.unsubscribe();
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isAuthenticated, supabase]);

  return null;
};
