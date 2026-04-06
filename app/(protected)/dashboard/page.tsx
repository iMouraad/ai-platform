import { ToolGrid } from "@/features/directory/components/tool-grid";
import { PrivateDashboardHeroSlider } from "@/features/dashboard/components/private-dashboard-hero-slider";
import { createClient } from "@/lib/supabase/server";
import { Tool } from "@/features/directory/types/directory.types";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Fetch Tools (All active ones for dashboard)
  const { data: tools } = await supabase
    .schema("directory")
    .from("tools")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("is_active", true)
    .order('created_at', { ascending: false });

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 max-w-7xl animate-in fade-in duration-1000">
      {/* Dynamic Slider Section */}
      <PrivateDashboardHeroSlider />
      
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-12">
        <div className="flex flex-col gap-2 mb-10">
           <h2 className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">Explora el Directorio</h2>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Herramientas actualizadas para potenciar tu flujo de trabajo.</p>
        </div>
        <ToolGrid tools={tools as Tool[] || []} />
      </div>
      
      <div className="mt-24 p-10 md:p-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[3rem] shadow-2xl shadow-blue-900/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] -z-10" />
         <div className="max-w-md relative z-10 text-center md:text-left">
           <h3 className="text-3xl font-black font-outfit mb-4 tracking-tighter uppercase leading-none">¿Necesitas ayuda?</h3>
           <p className="opacity-70 font-medium text-sm leading-relaxed">Nuestro equipo de expertos está disponible para guiarte en tu integración con la Inteligencia Artificial.</p>
         </div>
         <button className="relative z-10 px-10 py-5 bg-blue-600 text-white dark:bg-zinc-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/30 dark:shadow-zinc-900/20">
           Contactar Soporte
         </button>
      </div>
    </main>
  );
}
