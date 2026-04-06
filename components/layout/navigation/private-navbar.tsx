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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl leading-none">
              A
            </div>
            <span className="hidden sm:block text-xl font-bold font-outfit tracking-tight">AI Platform</span>
          </Link>
          
          <nav className="hidden md:ml-10 md:flex md:gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Panel</Link>
            <Link href="/directory" className="text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Directorio</Link>
            <Link href="/academy" className="text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">Mi Academia</Link>
          </nav>
        </div>

        <div className="flex items-center">
          <UserAccountDropdown user={user} role={profile?.role || 'user'} />
        </div>
      </div>
    </header>
  );
};
