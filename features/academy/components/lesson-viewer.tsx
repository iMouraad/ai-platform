"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Play,
  FileText,
  HelpCircle,
  Zap,
  MessageSquare
} from "lucide-react";
import { Lesson } from "../types/academy.types";

interface LessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LessonViewer = ({ lesson, onClose, onComplete, onNext, onPrev }: LessonViewerProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-white dark:bg-zinc-950 flex flex-col"
    >
      {/* Top Header Navigation */}
      <div className="h-20 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 md:px-12 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors group"
          >
            <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Volver</span>
          </button>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">LECCIÓN {lesson.order}</span>
            <h1 className="text-lg font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase truncate max-w-[300px] md:max-w-md">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {!isCompleted && (
             <button 
               onClick={handleComplete}
               className="hidden md:flex items-center gap-3 px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
             >
               <CheckCircle2 className="h-4 w-4" />
               Marcar como Completada
             </button>
           )}
           {isCompleted && (
             <div className="hidden md:flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px]">
               <CheckCircle2 className="h-5 w-5" />
               Lección Dominada
             </div>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto py-12 px-6 md:px-12">
          
          {/* Video Player Placeholder */}
          {lesson.content_type === 'video' && (
            <div className="aspect-video w-full rounded-[2.5rem] bg-zinc-900 overflow-hidden shadow-2xl relative group mb-12 border border-zinc-800">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl scale-110 group-hover:scale-125 transition-transform cursor-pointer">
                    <Play className="h-10 w-10 translate-x-1 fill-white" />
                  </div>
               </div>
               <img 
                 src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format" 
                 alt="Video Thumbnail" 
                 className="w-full h-full object-cover opacity-40"
               />
            </div>
          )}

          {/* Lesson Content Rendering */}
          <div className="prose dark:prose-invert max-w-none space-y-8">
             <div className="flex items-center gap-4 text-zinc-400 mb-8">
                <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   {lesson.content_type === 'video' ? <Play className="h-3 w-3 fill-zinc-400" /> : <FileText className="h-3 w-3" />}
                   {lesson.content_type.toUpperCase()}
                </div>
                <div className="h-1 w-1 rounded-full bg-zinc-300" />
                <span className="text-[10px] font-black tracking-widest uppercase">DOMINIO: INTELIGENCIA ARTIFICIAL</span>
             </div>

             <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
                  Explorando el potencial de la {lesson.title}
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  En esta lección vamos a profundizar en cómo la IA ha transformado la manera en que procesamos información. No se trata solo de herramientas, se trata de una nueva mentalidad de trabajo impulsada por agentes autónomos y razonamiento avanzado.
                </p>
                
                {/* Visual Accent */}
                <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-600/10 space-y-4">
                   <div className="flex items-center gap-3 text-blue-600">
                      <Zap className="h-5 w-5 fill-blue-600" />
                      <span className="font-black uppercase tracking-widest text-xs">Concepto Clave</span>
                   </div>
                   <p className="text-zinc-800 dark:text-zinc-200 font-bold text-lg">
                     "La IA no es un reemplazo de tu inteligencia, es un exoesquelo para tus capacidades cognitivas."
                   </p>
                </div>

                <div className="space-y-4">
                   <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                     A lo largo de este nivel, hemos visto cómo configurar prompts efectivos. Ahora, en el Nivel 2, estamos listos para escalar ese conocimiento hacia flujos de trabajo automatizados. Esta lección te preparará para entender la lógica detrás de los conectores inteligentes.
                   </p>
                </div>
             </div>
          </div>

          {/* Practical Area / Discussion Placeholder */}
          <div className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800 grid md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                 <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-600 shadow-xl mb-6">
                    <MessageSquare className="h-6 w-6" />
                 </div>
                 <h4 className="text-xl font-black font-outfit mb-3 text-zinc-900 dark:text-zinc-50 uppercase">Discusión de la Lección</h4>
                 <p className="text-sm text-zinc-500 font-medium mb-8">Únete a la conversación con otros estudiantes de este nivel en Ecuador.</p>
                 <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                    Ver Comentarios (12)
                 </button>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                 <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-amber-500 shadow-xl mb-6">
                    <HelpCircle className="h-6 w-6" />
                 </div>
                 <h4 className="text-xl font-black font-outfit mb-3 text-zinc-900 dark:text-zinc-50 uppercase">¿Tienes dudas?</h4>
                 <p className="text-sm text-zinc-500 font-medium mb-8">Consulta las preguntas frecuentes de este módulo o contacta a un tutor.</p>
                 <button className="text-xs font-black uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors">
                    Centro de Ayuda
                 </button>
              </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Control */}
      <div className="h-24 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 md:px-12 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-2">
            <button 
              disabled={!onPrev}
              onClick={onPrev}
              className="h-14 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
               <ChevronLeft className="h-5 w-5" />
               <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Anterior</span>
            </button>
            <button 
              disabled={!onNext}
              onClick={onNext}
              className="h-14 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
               <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Siguiente</span>
               <ChevronRight className="h-5 w-5" />
            </button>
         </div>

         <div className="flex-1 max-w-xs mx-8 hidden lg:block">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CURSO PROGRESO </span>
               <span className="text-[10px] font-black text-blue-600 tracking-widest">45%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-[45%]" />
            </div>
         </div>

         <button 
           onClick={handleComplete}
           className={`px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 shadow-xl ${
             isCompleted 
             ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 border border-green-600/30' 
             : 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white shadow-blue-600/20'
           }`}
         >
            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isCompleted ? 'Lección Completada' : 'Finalizar Lección'}
         </button>
      </div>
    </motion.div>
  );
};
