"use client";

import { Tool } from "../types/directory.types";
import { ArrowUpRight, CheckCircle2, Copy, BarChart3, Plus } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  onOpenDetail?: (tool: Tool) => void;
  isCompareSelected?: boolean;
  onToggleCompare?: (tool: Tool) => void;
}

export const ToolCard = ({ 
  tool, 
  onOpenDetail, 
  isCompareSelected = false, 
  onToggleCompare 
}: ToolCardProps) => {
  return (
    <div 
      className={`group relative flex flex-col bg-white dark:bg-zinc-950 rounded-[2rem] border transition-all duration-500 ease-out shadow-sm hover:shadow-2xl dark:shadow-none overflow-hidden ${
        isCompareSelected 
          ? "border-blue-600 scale-[0.98] ring-4 ring-blue-600/10" 
          : "border-zinc-200 dark:border-zinc-800/50 hover:border-blue-600/30"
      }`}
    >
      {/* Visual Section */}
      <div 
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer"
        onClick={() => onOpenDetail?.(tool)}
      >
        {tool.video_url ? (
          <video 
            src={tool.video_url} 
            poster={tool.logo_url}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : tool.logo_url ? (
          <img 
            src={tool.logo_url} 
            alt={tool.name} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
            <span className="text-5xl font-black font-outfit text-zinc-400 dark:text-zinc-800">AI</span>
          </div>
        )}
        
        {/* Category & Stats Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {tool.is_verified && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/20">
              <CheckCircle2 className="h-3 w-3" />
              <span className="text-[8px] font-black uppercase tracking-wider">Verificado</span>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-full shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
              {tool.category?.name || "AI Tool"}
            </span>
          </div>
        </div>

        {/* Compare Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare?.(tool);
          }}
          className={`absolute bottom-4 right-4 z-30 h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
            isCompareSelected 
              ? "bg-blue-600 text-white rotate-45" 
              : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          }`}
          title={isCompareSelected ? "Remover de la comparación" : "Añadir a comparar"}
        >
          <Plus className={`h-5 w-5 transition-transform ${isCompareSelected ? "rotate-0" : ""}`} />
        </button>

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-8 -mt-8 relative z-20 flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 
            className="text-2xl font-black text-zinc-900 dark:text-white font-outfit tracking-tighter group-hover:text-blue-600 transition-colors leading-none cursor-pointer"
            onClick={() => onOpenDetail?.(tool)}
          >
            {tool.name}
          </h3>
          <button 
            onClick={() => onOpenDetail?.(tool)}
            className="h-8 w-8 rounded-full border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-medium mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
          {tool.short_description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tool.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer / Stats */}
        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <BarChart3 className="h-3.5 w-3.5" />
                {tool.popularity || 0}
             </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(tool.official_url, '_blank');
            }}
            className="group/btn flex items-center gap-3 py-2 pl-4 pr-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-white/5 active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/btn:text-blue-600 transition-colors">USAR AHORA</span>
            <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
};
