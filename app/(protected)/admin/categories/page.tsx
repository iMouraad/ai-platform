import { createClient } from "@/lib/supabase/server";
import { CreateCategoryForm } from "@/features/admin/directory/components/create-category-form";
import { AdminCategoryList } from "@/features/admin/directory/components/admin-category-list";
import { Category } from "@/features/directory/types/directory.types";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .schema("directory")
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold font-outfit text-zinc-900 dark:text-zinc-50 tracking-tight">Gestión de Categorías</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Define las categorías que organizarán el directorio de IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AdminCategoryList initialCategories={(categories as Category[]) || []} />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-outfit text-zinc-900 dark:text-zinc-50 mb-2">Añadir Nueva</h2>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Organiza las herramientas por su función principal.</p>
          </div>
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  );
}
