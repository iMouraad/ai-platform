import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const PublicNavbar = async () => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4">
      <header className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/20 bg-white/60 backdrop-blur-3xl dark:border-zinc-800/50 dark:bg-zinc-950/60 shadow-2xl shadow-blue-500/5 transition-all duration-500">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg md:text-xl leading-none group-hover:scale-110 transition-all shadow-lg shadow-blue-600/30">
                A
              </div>
              <span className="hidden sm:block text-lg md:text-xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">AI PLATFORM</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="px-4 md:px-6 py-2 md:py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 transition-all active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-2 md:px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Ingresar
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 md:px-7 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
