"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  BookOpen, 
  Award,
  ArrowRight,
  TrendingUp,
  Zap,
  Globe,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tool } from "@/features/directory/types/directory.types";
import { ToolDetailModal } from "@/features/directory/components/tool-detail-modal";

interface AITrendingProps {
  featuredTool?: Tool;
}

export const AITrending = ({ featuredTool }: AITrendingProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Si no hay herramienta destacada, usamos una por defecto pero con la estructura correcta
  const tool = featuredTool || {
    name: "Claude 3.5 Sonnet",
    description: "La nueva frontera del razonamiento y la creatividad. Ideal para programadores y creativos.",
    developer: "Anthrophic",
    website_url: "https://claude.ai",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    tags: ['Codificación Pro', 'Visión Avanzada', 'Razonamiento'],
    is_active: true
  } as Tool;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">IA DESTACADA DE LA SEMANA</span>
          </div>

          <div className="relative group">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="grid lg:grid-cols-2 gap-0 overflow-hidden">
                {/* Content Side */}
                <div className="p-12 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-900 shadow-xl overflow-hidden">
                      {tool.image_url ? (
                        <img src={tool.image_url} alt={tool.name} className="h-full w-full object-cover" />
                      ) : (
                        <Zap className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 leading-tight uppercase tracking-tighter">{tool.name}</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">POR {tool.developer || 'Desarrollador Desconocido'}</p>
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-12 italic">
                    "{tool.description}"
                  </p>

                  <div className="flex flex-wrap gap-4 mb-12">
                    {(tool.tags || ['IA', 'Destacada']).map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <a 
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-10 py-5 bg-blue-600 text-white font-black font-outfit uppercase tracking-widest text-[12px] rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    >
                      Usar Herramienta
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </a>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-10 py-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-black font-outfit uppercase tracking-widest text-[12px] rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
                    >
                      Detalles Técnicos
                    </button>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative h-[400px] lg:h-auto overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 z-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 opacity-20 blur-[100px] z-0 animate-pulse" />
                  
                  <div className="relative h-full w-full flex items-center justify-center p-12 z-20">
                    <motion.div 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative h-full w-full flex items-center justify-center"
                    >
                      <img 
                        src={tool.image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"} 
                        alt={tool.name} 
                        className="rounded-3xl shadow-2xl border border-white/20 scale-110 object-cover aspect-video lg:aspect-square"
                      />
                      <div className="absolute -top-6 -right-6 h-16 w-16 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-2xl rotate-12">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Detalles Reutilizado */}
      {isModalOpen && (
        <ToolDetailModal 
          tool={tool} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </section>
  );
};
