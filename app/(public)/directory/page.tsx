import { createClient } from "@/lib/supabase/server";
import { DirectoryClient } from "@/features/directory/components/directory-client";
import { Tool, Category } from "@/features/directory/types/directory.types";

export default async function PublicDirectoryPage() {
  const supabase = await createClient();
  
  // 1. Cargar Herramientas
  const { data: tools } = await supabase
    .schema("directory")
    .from("tools")
    .select("*, category:category_id(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // 2. Cargar Categorías
  const { data: categories } = await supabase
    .schema("directory")
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="container mx-auto px-6 py-24 lg:py-32 max-w-7xl">
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-600/20 mb-6">
            ✨ EL UNIVERSO DE LA IA
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 mb-8 uppercase leading-tight">
            Directorio <span className="text-blue-600">Inteligente</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Descubre y filtra las herramientas de IA más potentes del mercado. Potenciamos tu productividad con la mejor selección tecnológica.
          </p>
        </div>

        <DirectoryClient 
          initialTools={(tools as Tool[]) || []} 
          categories={(categories as Category[]) || []} 
        />
      </div>
    </div>
  );
}
