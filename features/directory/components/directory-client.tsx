"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Tool, Category } from "../types/directory.types";
import { ToolCard } from "./tool-card";
import { ToolCarousel } from "./tool-carousel";
import { ToolDetailModal } from "./tool-detail-modal";
import { ToolComparator } from "./tool-comparator";
import { 
  Search, 
  Loader2, 
  LayoutGrid, 
  Layers, 
  Zap, 
  ArrowUpDown, 
  Filter,
  BarChart2,
  Trophy,
  History,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { embeddingService } from "@/lib/search/embedding-service";

interface DirectoryClientProps {
  initialTools: Tool[];
  categories: Category[];
}

type SortOption = "newest" | "popular" | "name";

export const DirectoryClient = ({ initialTools, categories }: DirectoryClientProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [results, setResults] = useState<Tool[]>(initialTools);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for detail modal & comparison
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [compareTools, setCompareTools] = useState<Tool[]>([]);
  const [showComparator, setShowComparator] = useState(false);

  const supabase = createClient();

  // Extract all tags from initialTools
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialTools.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [initialTools]);

  // Metrics (RF13)
  const metrics = useMemo(() => {
    return {
      total: initialTools.length,
      byCategory: categories.map(cat => ({
        name: cat.name,
        count: initialTools.filter(t => t.category_id === cat.id).length
      })).sort((a,b) => b.count - a.count)
    };
  }, [initialTools, categories]);

  const performSemanticSearch = useCallback(async (query: string, category: string) => {
    if (query.trim().length < 3) return;

    setIsSearching(true);
    try {
      const vector = await embeddingService.generate(query);
      const { data, error } = await (supabase as any).schema("directory")
        .rpc("match_tools_variant", {
          query_embedding: vector,
          match_threshold: 0.2,
          match_count: 50
        });

      if (error) throw error;
      let finalResults = (data as Tool[]) || [];
      if (category !== "all") {
        finalResults = finalResults.filter(t => t.category_id === category);
      }
      setResults(finalResults);
    } catch (error) {
      console.error("Error en búsqueda semántica:", error);
    } finally {
      setIsSearching(false);
    }
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        setResults(initialTools);
      } else {
        performSemanticSearch(search, selectedCategory);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, performSemanticSearch, initialTools, selectedCategory]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCompare = (tool: Tool) => {
    setCompareTools(prev => {
      const exists = prev.find(t => t.id === tool.id);
      if (exists) return prev.filter(t => t.id !== tool.id);
      if (prev.length >= 4) return prev; // Limit to 4 for comparison
      return [...prev, tool];
    });
  };

  // Filter and Sort results (Hybrid Logic: Keyword + Semantic)
  const processedTools = useMemo(() => {
    const query = search.toLowerCase().trim();

    // 1. Case: No search query
    if (query === "") {
      let filtered = initialTools.filter(t => selectedCategory === "all" || t.category_id === selectedCategory);
      
      // Apply Tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(t => 
          selectedTags.every(tag => t.tags?.includes(tag))
        );
      }

      return [...filtered].sort((a, b) => {
        if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "popular") return (b.popularity || 0) - (a.popularity || 0);
        return a.name.localeCompare(b.name);
      });
    }

    // 2. Case: Active search
    // Prioritize local text match (Instant feedback)
    const exactMatches = initialTools.filter(t => {
      const matchText = `${t.name} ${t.short_description} ${t.tags?.join(" ")} ${t.slug}`.toLowerCase();
      // Match query words (all words must be present)
      const matchesQuery = query.split(" ").every(word => matchText.includes(word));
      const matchesCategory = selectedCategory === "all" || t.category_id === selectedCategory;
      return matchesQuery && matchesCategory;
    });

    // Add semantic results from state (Results from Supabase RPC)
    const semanticMatches = results.filter(t => 
      !exactMatches.some(exact => exact.id === t.id) &&
      (selectedCategory === "all" || t.category_id === selectedCategory)
    );

    let combined = [...exactMatches, ...semanticMatches];

    // Apply Tags
    if (selectedTags.length > 0) {
      combined = combined.filter(t => 
        selectedTags.every(tag => t.tags?.includes(tag))
      );
    }

    // Sort combined results
    return combined.sort((a, b) => {
      // In search mode, we prioritize exactMatches first
      const aIsExact = exactMatches.some(e => e.id === a.id);
      const bIsExact = exactMatches.some(e => e.id === b.id);
      
      if (aIsExact && !bIsExact) return -1;
      if (!aIsExact && bIsExact) return 1;

      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "popular") return (b.popularity || 0) - (a.popularity || 0);
      return a.name.localeCompare(b.name);
    });
  }, [initialTools, results, search, selectedCategory, selectedTags, sortBy]);

  const isHomeView = search.trim() === "" && selectedCategory === "all" && selectedTags.length === 0;

  return (
    <div className="space-y-16">
      {/* Metrics Dashboard (RF13) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Layers className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50">{metrics.total}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">Total Herramientas</div>
        </div>
        {metrics.byCategory.slice(0, 3).map((cat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50">{cat.count}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Control Center */}
      <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:max-w-xl group">
            {isSearching ? (
              <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 animate-spin" />
            ) : (
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            )}
            <input
              type="text"
              placeholder="Busca por intención (ej. 'ayuda para programar')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium text-lg"
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
             <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button 
                  onClick={() => setSortBy("newest")}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-all ${sortBy === "newest" ? "bg-white dark:bg-zinc-950 text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                  title="Más recientes"
                >
                  <History className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setSortBy("popular")}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-all ${sortBy === "popular" ? "bg-white dark:bg-zinc-950 text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                  title="Más populares"
                >
                  <Trophy className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setSortBy("name")}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-all ${sortBy === "name" ? "bg-white dark:bg-zinc-950 text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                  title="Alfabético"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Categories & Tags (RF3, RF4) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  selectedTags.includes(tag)
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main View */}
      {isHomeView ? (
        <div className="space-y-24">
          {categories.slice(0, 3).map(cat => {
            const catTools = initialTools.filter(t => t.category_id === cat.id);
            if (catTools.length === 0) return null;
            return (
              <ToolCarousel 
                key={cat.id} 
                tools={catTools} 
                categoryName={cat.name} 
                onOpenDetail={setSelectedTool}
                onToggleCompare={toggleCompare}
                compareTools={compareTools}
                onViewAll={() => setSelectedCategory(cat.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity duration-300 ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
          {processedTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onOpenDetail={setSelectedTool}
              onToggleCompare={toggleCompare}
              isCompareSelected={compareTools.some(t => t.id === tool.id)}
            />
          ))}
        </div>
      )}

      {processedTools.length === 0 && !isSearching && !isHomeView && (
        <div className="py-32 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 border-dashed">
          <div className="h-24 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Filter className="h-10 w-10 text-zinc-300" />
          </div>
          <h3 className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">Sin coincidencias</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 font-medium max-w-md mx-auto">
            No encontramos herramientas con esos filtros. Intenta resetear tu búsqueda o explorar categorías populares.
          </p>
          <button 
            onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedTags([]); }}
            className="mt-10 px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Resetear Filtros
          </button>
        </div>
      )}

      {/* Floating Comparator Trigger (RF19) */}
      {compareTools.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-bottom-20 duration-500">
          <div className="bg-zinc-950 text-white p-4 pr-6 rounded-full flex items-center gap-6 shadow-2xl border border-white/10 backdrop-blur-xl">
             <div className="flex -space-x-3">
                {compareTools.map(t => (
                  <div key={t.id} className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                    <img src={t.logo_url} className="h-full w-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{compareTools.length} Seleccionados</span>
                <span className="text-xs font-bold">Listos para comparar</span>
             </div>
             <button 
               onClick={() => setShowComparator(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
             >
               Comparar ahora
             </button>
             <button 
               onClick={() => setCompareTools([])}
               className="p-2 hover:bg-white/10 rounded-full transition-colors"
             >
               <X className="h-4 w-4" />
             </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedTool && (
        <ToolDetailModal 
          tool={selectedTool} 
          isOpen={!!selectedTool} 
          onClose={() => setSelectedTool(null)}
          isCompareSelected={compareTools.some(t => t.id === selectedTool.id)}
          onToggleCompare={toggleCompare}
          onSelectTool={setSelectedTool}
          onViewCategory={(catId) => {
            setSelectedCategory(catId);
            setSelectedTool(null);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          relatedTools={initialTools.filter(t => t.category_id === selectedTool.category_id && t.id !== selectedTool.id)}
        />
      )}

      {showComparator && (
        <ToolComparator 
          tools={compareTools}
          onRemove={(id) => setCompareTools(prev => prev.filter(t => t.id !== id))}
          onClose={() => setShowComparator(false)}
        />
      )}
    </div>
  );
};
