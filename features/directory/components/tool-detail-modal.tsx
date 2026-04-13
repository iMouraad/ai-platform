"use client";

import { Tool } from "../types/directory.types";
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Play, 
  Zap,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";

interface ToolDetailModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
  onToggleCompare?: (tool: Tool) => void;
  isCompareSelected?: boolean;
  onViewCategory?: (categoryId: string) => void;
  relatedTools?: Tool[];
  onSelectTool?: (tool: Tool) => void;
}

export const ToolDetailModal = ({ 
  tool, 
  isOpen, 
  onClose, 
  onToggleCompare,
  isCompareSelected = false,
  onViewCategory,
  relatedTools = [],
  onSelectTool
}: ToolDetailModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    // Podríamos añadir un toast aquí
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header Actions */}
        <div className="absolute top-8 right-8 z-30 flex items-center gap-2">
          <button 
            onClick={onClose}
            className="h-14 w-14 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:scale-110 transition-all active:scale-90 shadow-xl"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Visuals */}
            <div className="relative aspect-square lg:aspect-auto bg-zinc-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              {tool.video_url ? (
                <video 
                  src={tool.video_url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : tool.logo_url ? (
                <img 
                  src={tool.logo_url} 
                  alt={tool.name} 
                  className="h-full w-full object-contain p-20 group-hover:scale-110 transition-transform duration-1000" 
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
                  <span className="text-9xl font-black font-outfit text-white/20">AI</span>
                </div>
              )}
              
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-10 left-10 right-10">
                {tool.is_verified && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-xl shadow-blue-600/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verificado por PDIA
                  </div>
                )}
                <h2 className="text-5xl md:text-6xl font-black font-outfit text-white tracking-tighter uppercase mb-4 drop-shadow-2xl">
                  {tool.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-10 md:p-14 flex flex-col gap-12">
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={tool.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 group hover:-translate-y-1 active:scale-95"
                >
                  Visitar Sitio Oficial
                  <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <button 
                  onClick={() => onToggleCompare?.(tool)}
                  className={`flex-1 px-8 py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 border-2 ${
                    isCompareSelected 
                      ? "bg-zinc-900 border-zinc-900 text-white" 
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border-zinc-100 dark:border-zinc-800 hover:border-blue-600/30"
                  }`}
                >
                  {isCompareSelected ? "En Comparación" : "Comparar"}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Info className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acerca de la herramienta</span>
                </div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                   {tool.short_description}
                </p>
                {tool.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-500 dark:text-zinc-400">
                    <p>{tool.content}</p>
                  </div>
                )}
              </div>

              {/* Pros */}
              {tool.pros && tool.pros.length > 0 && (
                 <div className="space-y-6">
                   <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                     <Sparkles className="h-5 w-5 text-yellow-500" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fortalezas</span>
                   </div>
                   <div className="grid grid-cols-1 gap-3">
                     {tool.pros.map((pro, i) => (
                       <div key={i} className="flex items-center gap-3 p-4 bg-green-500/5 rounded-2xl border border-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold">
                         <CheckCircle2 className="h-4 w-4" /> {pro}
                       </div>
                     ))}
                   </div>
                 </div>
              )}

              {/* Prompts */}
              {tool.suggested_prompts && tool.suggested_prompts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Zap className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intenta estos Prompts</span>
                  </div>
                  <div className="space-y-3">
                    {tool.suggested_prompts.map((prompt, i) => (
                      <div key={i} className="group p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-600/30 transition-all flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          "{prompt}"
                        </p>
                        <button 
                          onClick={() => handleCopyPrompt(prompt)}
                          className="px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 shadow-sm transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                        >
                          Copiar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="p-10 md:p-14 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Seguir Explorando</span>
                  <h3 className="text-3xl font-black font-outfit text-zinc-900 dark:text-white uppercase tracking-tighter">
                    IAs Similares que te pueden gustar
                  </h3>
                </div>
                <button 
                  onClick={() => onViewCategory?.(tool.category_id)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-600 transition-all group/all"
                >
                  Ver Todo de {tool.category?.name} 
                  <ArrowRight className="h-4 w-4 group-hover/all:translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.slice(0, 3).map(related => (
                  <div 
                    key={related.id} 
                    onClick={() => onSelectTool?.(related)}
                    className="p-6 bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/5 transition-all group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-600/20 transition-all">
                        {related.logo_url ? (
                          <img src={related.logo_url} className="h-full w-full object-cover p-2 group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-black text-zinc-300">AI</div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-lg text-zinc-900 dark:text-white font-outfit tracking-tight group-hover:text-blue-600 transition-colors truncate">
                          {related.name}
                        </h4>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest line-clamp-1">
                          {related.category?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
