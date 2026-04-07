import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserAccountDropdown } from "./user-account-dropdown";

export const PrivateNavbar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Obtener el rol del perfil
  const { data: profile } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 pointer-events-none">
      <header className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/20 bg-white/60 backdrop-blur-3xl dark:border-zinc-800/50 dark:bg-zinc-950/60 shadow-2xl shadow-blue-500/5 transition-all duration-500 pointer-events-auto">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 group">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg md:text-xl leading-none group-hover:scale-110 transition-all shadow-lg shadow-blue-600/30">
                A
              </div>
              <span className="hidden sm:block text-lg md:text-xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">AI PLATFORM</span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:gap-8">
              <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Panel</Link>
              <Link href="/directory" className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Directorio</Link>
              <Link href="/academy" className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Mi Academia</Link>
            </nav>
          </div>

          <div className="flex items-center">
            <UserAccountDropdown user={user} role={profile?.role || 'user'} />
          </div>
        </div>
      </header>
    </div>
  );
};
