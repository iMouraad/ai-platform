"use client";

import { useState, useEffect, useCallback } from "react";
import { Tool, Category } from "../types/directory.types";
import { ToolCard } from "./tool-card";
import { Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { embeddingService } from "@/lib/search/embedding-service";

interface DirectoryClientProps {
  initialTools: Tool[];
  categories: Category[];
}

export const DirectoryClient = ({ initialTools, categories }: DirectoryClientProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [results, setResults] = useState<Tool[]>(initialTools);
  const [isSearching, setIsSearching] = useState(false);
  const supabase = createClient();

  // Función para realizar la búsqueda semántica
  const performSemanticSearch = useCallback(async (query: string, category: string) => {
    if (query.trim().length < 3) {
      // Si la búsqueda es corta, volvemos al filtro local (opcional)
      setResults(initialTools);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // 1. Generar el embedding localmente (Gratis!)
      const vector = await embeddingService.generate(query);

      // 2. Llamar a la función inteligente de Supabase
      const { data, error } = await (supabase as any).schema("directory")
        .rpc("match_tools_variant", {
          query_embedding: vector,
          match_threshold: 0.2, // Umbral de similitud (ajustable)
          match_count: 12
        });

      if (error) throw error;

      let finalResults = (data as Tool[]) || [];

      // 3. Filtrar por categoría si no es "all"
      if (category !== "all") {
        finalResults = finalResults.filter(t => t.category_id === category);
      }

      setResults(finalResults);
    } catch (error) {
      console.error("Error en búsqueda semántica:", error);
      // Fallback a filtro local en caso de error
    } finally {
      setIsSearching(false);
    }
  }, [initialTools, supabase]);

  // Debounce para no saturar de llamadas
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        setResults(initialTools);
        setIsSearching(false);
      } else {
        performSemanticSearch(search, selectedCategory);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, performSemanticSearch, initialTools, selectedCategory]);

  // Filtrado local solo para categorías cuando no hay búsqueda activa
  const displayTools = search.trim() === "" 
    ? initialTools.filter(t => selectedCategory === "all" || t.category_id === selectedCategory)
    : results;

  return (
    <div className="space-y-12">
      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-blue-900/5">
        <div className="relative w-full lg:max-w-md group">
          {isSearching ? (
            <Loader2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 animate-spin" />
          ) : (
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
          )}
          <input
            type="text"
            placeholder="Intenta buscar algo como 'crear videos'..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity duration-300 ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
        {displayTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {displayTools.length === 0 && !isSearching && (
        <div className="py-24 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed animate-in fade-in duration-500">
          <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-zinc-300" />
          </div>
          <h3 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">No hay resultados</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Intenta con otros términos semánticos.</p>
        </div>
      )}
    </div>
  );
};
