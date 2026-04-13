import { ToolCarousel } from "@/features/directory/components/tool-carousel";
import { Hero } from "@/features/home/hero";
import { AITrending } from "@/features/home/ai-trending";
import { createClient } from "@/lib/supabase/server";
import { Tool } from "@/features/directory/types/directory.types";
import { Lightbulb, Info, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Fetch Tools with categories
  const { data: toolsData } = await supabase
    .schema("directory")
    .from("tools")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("is_active", true)
    .order('created_at', { ascending: false });

  const tools = (toolsData as Tool[]) || [];

  // 2. Select Featured Tool (The first one for now)
  const featuredTool = tools.length > 0 ? tools[0] : undefined;

  // 3. Group tools by category for the carousels
  const groupedTools = tools.reduce((acc, tool) => {
    const categoryName = tool.category?.name || "Sin Categoría";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categories = Object.keys(groupedTools);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden pb-20">
      {/* 1. Premium Navigation Hero */}
      <Hero isAuthenticated={true} />
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* 2. Featured Trending Section - DYNAMIC DATA */}
        <AITrending featuredTool={featuredTool} />

        {/* 3. Quick Info / Tip Section (Added Value) */}
        <div className="mb-24 grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[2.5rem] bg-blue-600 dark:bg-blue-600 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform">
              <Lightbulb className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-8 bg-blue-200 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">TIP DE PRODUCTIVIDAD</span>
              </div>
              <h3 className="text-2xl font-black font-outfit mb-4 leading-tight uppercase tracking-tighter">Optimiza tus Prompts</h3>
              <p className="text-blue-100/80 font-medium leading-relaxed max-w-sm">
                "Asigna siempre un ROL a la IA (ej. Actúa como un experto en marketing) para obtener respuestas mucho más precisas y profesionales."
              </p>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-white border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:-rotate-12 transition-transform">
              <Sparkles className="h-24 w-24 text-white dark:text-zinc-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-8 bg-blue-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ESTADO DEL DIRECTORIO</span>
              </div>
              <h3 className="text-2xl font-black font-outfit mb-4 leading-tight uppercase tracking-tighter text-white dark:text-zinc-900">Nuevas Herramientas</h3>
              <p className="text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed max-w-sm">
                Hemos añadido {tools.filter(t => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(t.created_at!) > oneWeekAgo;
                }).length} nuevas herramientas esta semana. ¡Dales un vistazo!
              </p>
            </div>
          </div>
        </div>

        {/* 4. Categorized Carousels */}
        <div className="space-y-32">
          {categories.slice(0, 3).map((categoryName) => (
            <ToolCarousel 
              key={categoryName} 
              tools={groupedTools[categoryName]} 
              categoryName={categoryName} 
            />
          ))}
        </div>

        {/* 5. Support CTA */}
        <div className="mt-32 p-10 md:p-16 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] -z-10 group-hover:bg-blue-600/30 transition-colors" />
          <div className="max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Info className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">SOPORTE PDIA</span>
            </div>
            <h3 className="text-4xl font-black font-outfit mb-4 tracking-tighter uppercase leading-none">¿Necesitas ayuda personalizada?</h3>
            <p className="opacity-70 font-medium leading-relaxed">Nuestro equipo está disponible vía WhatsApp para guiarte en tu camino con la Inteligencia Artificial.</p>
          </div>
          <a 
            href="https://wa.me/593995220227"
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-[12px] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/30"
          >
            Contactar ahora
          </a>
        </div>
      </div>
    </main>
  );
}
