import { createClient } from "@/lib/supabase/server";
import { AdminToolTable } from "@/features/admin/directory/components/admin-tool-table";
import { Tool, Category } from "@/features/directory/types/directory.types";

export default async function AdminDirectoryPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .schema("directory")
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const { data: tools } = await supabase
    .schema("directory")
    .from("tools")
    .select("*, category:category_id(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="h-1.5 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">DIRECTORIO MANAGER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">Gestión de Directorio</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Administra las herramientas de Inteligencia Artificial de la plataforma.</p>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <AdminToolTable 
          initialTools={(tools as Tool[]) || []} 
          categories={(categories as Category[]) || []} 
        />
      </div>
    </div>
  );
}
