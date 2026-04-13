"use client";

import { Tool } from "../types/directory.types";
import { X, Check, Minus, ExternalLink, Zap, Info, ShieldCheck, Target, CreditCard, Star } from "lucide-react";

interface ToolComparatorProps {
  tools: Tool[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const ToolComparator = ({ tools, onRemove, onClose }: ToolComparatorProps) => {
  if (tools.length === 0) return null;

  const featuresList = Array.from(new Set(tools.flatMap(t => t.features || [])));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl max-h-[90vh] bg-zinc-50 dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900/50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Comparador de Inteligencia Artificial</span>
            <h2 className="text-3xl font-black font-outfit text-zinc-900 dark:text-white uppercase tracking-tighter">
              Análisis Comparativo ({tools.length})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all shadow-xl shadow-black/5"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 text-left min-w-[250px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Atributo</span>
                </th>
                {tools.map(tool => (
                  <th key={tool.id} className="p-8 min-w-[320px] border-l border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="h-20 w-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-lg shadow-black/5">
                        {tool.logo_url ? (
                          <img src={tool.logo_url} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-3xl font-black font-outfit text-zinc-200 dark:text-zinc-800">AI</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl font-outfit text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{tool.name}</h3>
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">{tool.category?.name}</span>
                      </div>
                      <button 
                        onClick={() => onRemove(tool.id)}
                        className="text-[10px] font-black text-zinc-400 hover:text-red-500 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Description Row */}
              <tr className="border-b border-zinc-100 dark:border-zinc-900/50">
                <td className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 font-black text-[10px] uppercase tracking-widest text-zinc-400 align-top">
                  <div className="flex items-center gap-2"><Info className="h-4 w-4 text-blue-600" /> Propósito</div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="p-8 border-l border-zinc-100 dark:border-zinc-900/50">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                      "{tool.short_description}"
                    </p>
                  </td>
                ))}
              </tr>

              {/* Pricing Row */}
              <tr className="border-b border-zinc-100 dark:border-zinc-900/50 bg-blue-50/20 dark:bg-blue-900/5">
                <td className="sticky left-0 z-20 bg-blue-50/50 dark:bg-zinc-950 p-8 font-black text-[10px] uppercase tracking-widest text-zinc-400">
                  <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-green-500" /> Plan de Precios</div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="p-8 text-center border-l border-zinc-100 dark:border-zinc-900/50">
                    <span className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest">
                      {tool.pricing || "Consultar sitio"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Audience Row */}
              <tr className="border-b border-zinc-100 dark:border-zinc-900/50">
                <td className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 font-black text-[10px] uppercase tracking-widest text-zinc-400">
                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-red-500" /> Público Objetivo</div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="p-8 text-center border-l border-zinc-100 dark:border-zinc-900/50">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {tool.target_audience || "General"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Pros Row */}
              <tr className="border-b border-zinc-100 dark:border-zinc-900/50">
                <td className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 font-black text-[10px] uppercase tracking-widest text-zinc-400 align-top">
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> Fortalezas</div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="p-8 border-l border-zinc-100 dark:border-zinc-900/50">
                    <div className="flex flex-col gap-2">
                       {tool.pros?.map((pro: string, i: number) => (
                         <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                           <Check className="h-3 w-3 text-green-500" /> {pro}
                         </div>
                       )) || <Minus className="h-5 w-5 text-zinc-300 mx-auto" />}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verified Row */}
              <tr className="border-b border-zinc-100 dark:border-zinc-900/50">
                <td className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 font-black text-[10px] uppercase tracking-widest text-zinc-400">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500" /> Verificación</div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="p-8 text-center border-l border-zinc-100 dark:border-zinc-900/50">
                    {tool.is_verified ? (
                      <Check className="h-6 w-6 text-blue-600 mx-auto" />
                    ) : (
                      <Minus className="h-6 w-6 text-zinc-300 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Features Rows */}
              {featuresList.length > 0 && featuresList.map(feature => (
                <tr key={feature} className="border-b border-zinc-100 dark:border-zinc-900/50">
                  <td className="sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-950 p-8 font-bold text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" /> {feature}
                  </td>
                  {tools.map(tool => (
                    <td key={tool.id} className="p-8 text-center border-l border-zinc-100 dark:border-zinc-900/50">
                      {tool.features?.includes(feature) ? (
                        <Check className="h-6 w-6 text-blue-600 mx-auto" />
                      ) : (
                        <Minus className="h-6 w-6 text-zinc-200 dark:text-zinc-800 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4">
           {tools.map(tool => (
             <a 
               key={tool.id}
               href={tool.official_url}
               target="_blank"
               className="px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-blue-600/30 transition-all shadow-sm"
             >
               Ver {tool.name} <ExternalLink className="h-3 w-3" />
             </a>
           ))}
        </div>
      </div>
    </div>
  );
};
