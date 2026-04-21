"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  Layout as ConsoleIcon,
  FileText,
  AlertCircle,
  Eye,
  Video
} from "lucide-react";
import { Activity } from "../types/academy.types";

interface PromptLabProps {
  activity: Activity;
  onClose: () => void;
  onComplete: (userResponse: string) => void;
}

export const PromptLab = ({ activity, onClose, onComplete }: PromptLabProps) => {
  const [userResponse, setUserResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'none', message: string }>({ type: 'none', message: '' });
  const [activeTab, setActiveTab] = useState<'study' | 'practice'>(
    activity.video_url || activity.guide_content ? 'study' : 'practice'
  );

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // --- Limpiador de URL de YouTube Mejorado ---
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      // Manejar youtu.be/ID
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      // Manejar youtube.com/watch?v=ID
      if (url.includes('v=')) {
        const id = url.split('v=')[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      // Manejar youtube.com/embed/ID
      if (url.includes('embed/')) {
        const id = url.split('embed/')[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const validateResponse = (response: string) => {
    const userWords = response.toLowerCase().trim();
    const expectedWords = activity.expected_output.toLowerCase().trim().split(/\s+/);
    const stopWords = ['el', 'la', 'un', 'una', 'y', 'o', 'que', 'en', 'para', 'de', 'con'];
    const keywords = expectedWords.filter(w => w.length > 3 && !stopWords.includes(w));
    const matches = keywords.filter(w => userWords.includes(w));
    const score = matches.length / keywords.length;

    if (response.length < 15) return { valid: false, message: "Respuesta demasiado corta." };
    if (score < 0.15) return { valid: false, message: "No detecto las palabras clave necesarias. Revisa la guía." };
    return { valid: true, message: "¡Muy bien! Has captado la esencia." };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim() || isSubmitted) return;
    const validation = validateResponse(userResponse);
    if (!validation.valid) {
      setAttempts(prev => prev + 1);
      setFeedback({ type: 'error', message: validation.message });
      return;
    }
    setIsSubmitted(true);
    setFeedback({ type: 'success', message: validation.message });
    setTimeout(() => {
      onComplete(userResponse);
      setShowExpected(true);
    }, 1000);
  };

  if (!mounted) return null;

  const content = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 flex flex-col h-screen w-screen overflow-hidden"
    >
      {/* Header Fijo */}
      <div className="h-20 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 md:px-12 bg-white dark:bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors group">
            <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Salir de Clase</span>
          </button>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
             <button onClick={() => setActiveTab('study')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'study' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>1. Teoría</button>
             <button onClick={() => setActiveTab('practice')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'practice' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>2. Práctica</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Progreso Actual: <span className="text-blue-600">{activeTab === 'study' ? '50%' : '90%'}</span></span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'study' ? (
            <motion.div 
               key="study-tab" 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.98 }} 
               className="absolute inset-0 flex flex-col lg:flex-row"
            >
              {/* VIDEO - Izquierda */}
              <div className="flex-1 bg-black flex items-center justify-center p-6 md:p-12">
                 {activity.video_url ? (
                   <div className="w-full h-full max-h-[80vh] aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900 bg-zinc-900 relative">
                     <iframe 
                       src={getEmbedUrl(activity.video_url)!} 
                       className="w-full h-full" 
                       allowFullScreen 
                       title="Contenido Educativo"
                     />
                   </div>
                 ) : (
                   <div className="text-center space-y-4">
                      <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto">
                         <Video className="h-8 w-8 text-zinc-700" />
                      </div>
                      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Sin video para este reto</p>
                   </div>
                 )}
              </div>

              {/* TEORÍA - Derecha */}
              <div className="w-full lg:w-[500px] xl:w-[600px] border-l border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-hidden shadow-2xl">
                 <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">LECCIÓN ACTUAL</span>
                       <h1 className="text-4xl xl:text-5xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">{activity.title}</h1>
                    </div>

                    <div className="h-1 w-20 bg-blue-600 rounded-full" />

                    <div className="prose dark:prose-invert max-w-none">
                       <p className="text-lg xl:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap font-outfit">
                         {activity.guide_content || "No hay contenido de guía para esta actividad."}
                       </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-6">
                       <div className="flex items-center gap-3 text-blue-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest">Lo que aprenderás hoy</h4>
                       </div>
                       <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm text-zinc-500 font-medium italic">
                             <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                             Entenderás la lógica de la petición inicial del cliente.
                          </li>
                          <li className="flex items-start gap-2 text-sm text-zinc-500 font-medium italic">
                             <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                             Aprenderás a estructurar respuestas de IA eficientes.
                          </li>
                       </ul>
                    </div>
                 </div>

                 {/* Footer de Navegación */}
                 <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-center shrink-0">
                    <button 
                      onClick={() => setActiveTab('practice')} 
                      className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
                    >
                      Continuar al Taller <Zap className="h-4 w-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="practice-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950">
              <div className="w-full lg:w-[500px] border-r border-zinc-100 dark:border-zinc-800 p-12 space-y-12 bg-white dark:bg-zinc-950 shadow-2xl z-20 overflow-y-auto">
                 <div className="space-y-10">
                    <section className="space-y-4">
                       <div className="flex items-center gap-3 text-blue-600"><MessageSquare className="h-5 w-5" /><h3 className="text-[10px] font-black uppercase tracking-widest">Entrada del Usuario</h3></div>
                       <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 italic shadow-inner">
                          <p className="text-xl font-medium text-zinc-800 dark:text-zinc-200">"{activity.prompt_input}"</p>
                       </div>
                    </section>
                    <section className="space-y-4">
                       <div className="flex items-center gap-3 text-amber-500"><Zap className="h-5 w-5 fill-amber-500" /><h3 className="text-[10px] font-black uppercase tracking-widest">Tu Instrucción</h3></div>
                       <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10">
                          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-relaxed">{activity.instruction}</p>
                       </div>
                    </section>
                 </div>
              </div>

              <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 relative">
                 <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8 max-w-5xl mx-auto w-full pb-20">
                    <div className="flex-1 flex flex-col space-y-4 relative">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-zinc-400"><ConsoleIcon className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">Consola de IA</span></div>
                          {attempts > 0 && <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-3 py-1 rounded-full">Intento #{attempts}</span>}
                       </div>
                       <textarea value={userResponse} onChange={(e) => { setUserResponse(e.target.value); if (feedback.type !== 'none') setFeedback({ type: 'none', message: '' }); }} disabled={isSubmitted} placeholder="Escribe aquí tu respuesta técnica..." className="flex-1 w-full bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3.5rem] p-10 md:p-14 text-2xl font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 shadow-xl min-h-[400px]" />
                       <AnimatePresence>
                          {feedback.type !== 'none' && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute -bottom-16 left-12 right-12 p-5 rounded-2xl border flex items-center gap-4 ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}>
                                {feedback.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
                                <p className="text-sm font-bold">{feedback.message}</p>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">
                       <button type="button" disabled={isSubmitted} onClick={() => setUserResponse("")} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Reiniciar</button>
                       <div className="flex items-center gap-4">
                          {attempts >= 3 && !showExpected && (
                             <button type="button" onClick={() => setShowExpected(true)} className="flex items-center gap-2 px-6 py-4 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"><Eye className="h-4 w-4" /> Ver Solución</button>
                          )}
                          <button disabled={isSubmitted || !userResponse.trim()} className={`px-16 py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 transition-all active:scale-[0.98] shadow-2xl ${isSubmitted ? 'bg-green-600 text-white opacity-50' : 'bg-blue-600 text-white hover:scale-105 shadow-blue-600/30'}`}>
                             {isSubmitted ? 'Completado' : 'Finalizar Reto'}<Send className="h-5 w-5" />
                          </button>
                       </div>
                    </div>
                 </form>

                 <AnimatePresence>
                   {(showExpected || (isSubmitted && showExpected)) && (
                     <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className="mt-10 mb-20 p-12 md:p-16 rounded-[4.5rem] bg-zinc-950 border border-zinc-800 shadow-[0_-20px_80px_rgba(0,0,0,0.4)] space-y-10 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                       <div className="flex justify-between items-center">
                          <h3 className="text-3xl font-black font-outfit uppercase tracking-tighter text-white">Respuesta Maestra</h3>
                          <button onClick={onClose} className="px-10 py-4 bg-white text-zinc-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Siguiente Reto</button>
                       </div>
                       <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-2xl text-zinc-300 italic leading-relaxed font-outfit">{activity.expected_output}</div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
};
