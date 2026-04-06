import { createClient } from "@/lib/supabase/server";
import { CreateToolForm } from "@/features/admin/directory/components/create-tool-form";
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
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold font-outfit text-zinc-900 dark:text-zinc-50 tracking-tight">Gestión de Directorio</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Administra las herramientas de Inteligencia Artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AdminToolTable 
            initialTools={(tools as Tool[]) || []} 
            categories={(categories as Category[]) || []} 
          />
        </div>

        <div>
          <h2 className="text-xl font-bold font-outfit mb-6 text-zinc-900 dark:text-zinc-50">Nueva Herramienta</h2>
          <CreateToolForm categories={(categories as Category[]) || []} />
        </div>
      </div>
    </div>
  );
}
