import { Tool } from "../types/directory.types";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export const ToolCard = ({ tool }: { tool: Tool }) => {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800/50 overflow-hidden hover:border-blue-600/30 transition-all duration-500 ease-out shadow-sm hover:shadow-xl dark:shadow-none">
      {/* Visual Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {tool.logo_url ? (
          <img 
            src={tool.logo_url} 
            alt={tool.name} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
            <span className="text-5xl font-black font-outfit text-zinc-400 dark:text-zinc-800">AI</span>
          </div>
        )}
        
        {/* Category Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-full shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
              {tool.category?.name || "Premium"}
            </span>
          </div>
        </div>

        {/* Bottom Fade - Responsive to theme */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-8 -mt-8 relative z-20 flex-1">
        {/* Title & Arrow */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white font-outfit tracking-tight group-hover:text-blue-600 transition-colors leading-none">
            {tool.name}
          </h3>
          <div className="h-8 w-8 rounded-full border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-medium mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
          {tool.short_description}
        </p>

        {/* Link / Action */}
        <a
          href={tool.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors"
        >
          <span className="group-hover:translate-x-1 transition-transform">Visitar sitio oficial</span>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-600/30 transition-colors" />
        </a>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
