import { createAdminClient } from "@/lib/supabase/server";
import { AdminUserTable } from "@/features/admin/users/components/admin-user-table";
import { CreateUserModal } from "@/features/admin/users/components/create-user-modal";
import { Profile } from "@/features/admin/users/types/user-management.types";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();

  // Fetch all profiles from accounts schema
  // Fetch all profiles and pending registrations to merge the correct document_number
  const [profilesRes, pendingRes] = await Promise.all([
    supabase.schema("accounts").from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.schema("accounts").from("pending_registrations").select("email, document_number, document_type")
  ]);

  const profiles = profilesRes.data || [];
  const pending = pendingRes.data || [];

  // Merge: If a profile has a placeholder document_number, try to find the real one in pending_registrations
  const mergedProfiles = profiles.map(profile => {
    const pendingMatch = pending.find(p => p.email.toLowerCase() === profile.email.toLowerCase());
    if (pendingMatch && (profile.document_number.includes('_') || profile.document_number === '0000000000' || !profile.document_number)) {
      return {
        ...profile,
        document_number: pendingMatch.document_number,
        document_type: pendingMatch.document_type
      };
    }
    return profile;
  });

  if (profilesRes.error) {
    console.error("Error fetching profiles:", profilesRes.error);
  }

  // Calculate stats
  const totalUsers = mergedProfiles?.length || 0;
  const admins = mergedProfiles?.filter(p => p.role === 'admin').length || 0;
  const activeUsers = mergedProfiles?.filter(p => p.is_active).length || 0;

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="h-8 w-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                <Users className="h-4 w-4" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Control de Usuarios</span>
          </div>
          <h1 className="text-5xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
            Gestión <br /> <span className="text-blue-600">Comunidad</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 font-medium text-sm max-w-md">
            Administra los roles, permisos y estados de todos los humanos registrados en la plataforma.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
           <CreateUserModal />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl group hover:border-blue-600/20 transition-all">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Total</span>
             <span className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">{totalUsers}</span>
          </div>
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl group hover:border-blue-600/20 transition-all">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Admins</span>
             <span className="text-2xl font-black font-outfit text-blue-600">{admins}</span>
          </div>
          <div className="hidden md:block bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl group hover:border-blue-600/20 transition-all">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Activos</span>
             <span className="text-2xl font-black font-outfit text-emerald-500">{activeUsers}</span>
          </div>
        </div>

      <div className="relative">
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-blue-600/5 blur-[120px] rounded-full -z-10" />
        <AdminUserTable initialUsers={(mergedProfiles as Profile[]) || []} />
      </div>

      <div className="p-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 mt-12 mb-20 shadow-2xl shadow-blue-600/10 border border-zinc-800 dark:border-zinc-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[40px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
         <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black font-outfit tracking-tighter uppercase italic leading-none">Seguridad Primero</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Solo tú puedes delegar el poder de administración.</p>
         </div>
      </div>
    </div>
  );
}
