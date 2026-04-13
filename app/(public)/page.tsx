import { Hero } from "@/features/home/hero";
import { ToolCarousel } from "@/features/directory/components/tool-carousel";
import { AITrending } from "@/features/home/ai-trending";
import { createClient } from "@/lib/supabase/server";
import { Tool } from "@/features/directory/types/directory.types";
import { AboutUs, OurServices, Testimonials, ContactUs } from "@/features/home/home-sections";

export default async function Home() {
  const supabase = await createClient();
  
  // 1. Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  // 2. Fetch all Tools with categories
  const { data: toolsData } = await supabase
    .schema("directory")
    .from("tools")
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const tools = (toolsData as Tool[]) || [];

  // 3. Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    const categoryName = tool.category?.name || "Sin Categoría";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categories = Object.keys(groupedTools);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Hero isAuthenticated={isAuthenticated} />
      
      <section className="container mx-auto px-6 pb-20 relative z-10">
        {/* Featured Section for Auth Users */}
        {isAuthenticated && (
          <div className="mb-20">
            <AITrending />
          </div>
        )}

        <div className="space-y-32">
          {categories.length > 0 ? (
            categories.slice(0, 5).map((categoryName) => (
              <ToolCarousel 
                key={categoryName} 
                tools={groupedTools[categoryName]} 
                categoryName={categoryName} 
              />
            ))
          ) : (
            <div className="text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
              <p className="text-zinc-500 uppercase tracking-widest font-black text-xs">No hay herramientas disponibles en este momento</p>
            </div>
          )}
        </div>

        {/* Action center - Refined */}
        <div className="mt-24 flex flex-col items-center">
          <div className="h-[1px] w-24 bg-zinc-200 dark:bg-zinc-800 mb-12" />
          <a 
            href="/directory" 
            className="group inline-flex items-center gap-4 px-12 py-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black font-outfit uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all shadow-2xl active:scale-95 translate-y-0 hover:-translate-y-1"
          >
            Explorar todas las herramientas
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-2 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {!isAuthenticated && (
        <div className="space-y-0">
          <AboutUs />
          <OurServices />
          <Testimonials />
          <ContactUs />
        </div>
      )}

      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-12 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm uppercase">A</div>
            <span className="text-lg font-black font-outfit tracking-tighter uppercase">AI Platform</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
            © 2026 AI Platform. Domina el futuro ahora.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">Términos</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
