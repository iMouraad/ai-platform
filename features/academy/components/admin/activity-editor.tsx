"use client";

import React, { useState } from "react";
import { 
  X, 
  Save, 
  Trash2, 
  Layout, 
  Terminal, 
  FileText, 
  Zap, 
  Target,
  Layers,
  CheckCircle,
  Video,
  Info
} from "lucide-react";
import { Activity } from "../../types/academy.types";

interface ActivityEditorProps {
  initialData?: Partial<Activity>;
  onSave: (data: Partial<Activity>) => void;
  onClose: () => void;
}

export const ActivityEditor = ({ initialData, onSave, onClose }: ActivityEditorProps) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    video_url: initialData?.video_url || "",
    guide_content: initialData?.guide_content || "",
    prompt_input: initialData?.prompt_input || "",
    instruction: initialData?.instruction || "",
    expected_output: initialData?.expected_output || "",
    level: initialData?.level || "basic",
    type: initialData?.type || "simulate_ai",
    status: initialData?.status || "draft",
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
      />

      {/* Editor Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 md:px-12 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">ADMINISTRADOR DE CLASES</span>
             </div>
             <h2 className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
               {initialData?.id ? 'Editar Clase Interactiva' : 'Crear Nueva Clase'}
             </h2>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Metadata & Guides */}
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <Layout className="h-3 w-3" /> TÍTULO DE LA CLASE
                  </label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Automatización con GPT-4"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-900 dark:text-zinc-50 font-bold focus:border-blue-600 transition-all outline-none"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <Video className="h-3 w-3 text-blue-600" /> URL DEL VIDEO GUÍA (YOUTUBE/VIMEO)
                  </label>
                  <input 
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-blue-600/5 border border-blue-600/20 rounded-2xl p-5 text-blue-600 font-medium focus:border-blue-600 transition-all outline-none"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <Info className="h-3 w-3" /> CONTENIDO DE LA GUÍA (TEORÍA)
                  </label>
                  <textarea 
                    name="guide_content"
                    value={formData.guide_content}
                    onChange={handleChange}
                    placeholder="Escribe la teoría o instrucciones previas para el alumno..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-500 dark:text-zinc-400 font-medium h-48 resize-none focus:border-blue-600 transition-all outline-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                       <Layers className="h-3 w-3" /> NIVEL DE DIFICULTAD
                    </label>
                    <select 
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-900 dark:text-zinc-50 font-bold focus:border-blue-600 transition-all outline-none appearance-none"
                    >
                      <option value="basic">Principiante (Nivel 1)</option>
                      <option value="intermediate">Intermedio (Nivel 2)</option>
                      <option value="advanced">Avanzado (Nivel 3)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                       <Zap className="h-3 w-3" /> TIPO DE RETO
                    </label>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-900 dark:text-zinc-50 font-bold focus:border-blue-600 transition-all outline-none appearance-none"
                    >
                      <option value="simulate_ai">Simular Respuesta de IA</option>
                      <option value="improve_prompt">Mejorar un Prompt Malo</option>
                      <option value="compare_responses">Comparar Resultados</option>
                      <option value="build_prompt">Construir Prompt desde Cero</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Right Column: Interactive Prompt Logic */}
            <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <Terminal className="h-3 w-3 text-blue-600" /> PROMPT QUE RECIBE LA IA (INPUT)
                  </label>
                  <textarea 
                    name="prompt_input"
                    value={formData.prompt_input}
                    onChange={handleChange}
                    placeholder="¿Qué le pediría un usuario a la IA en este ejercicio?"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-blue-400 font-mono text-sm h-40 resize-none focus:border-blue-600 transition-all outline-none"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <Target className="h-3 w-3 text-amber-500" /> INSTRUCCIÓN PARA EL ALUMNO
                  </label>
                  <input 
                    name="instruction"
                    value={formData.instruction}
                    onChange={handleChange}
                    placeholder="Ej: Responde usando un tono formal y JSON format..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-zinc-900 dark:text-zinc-50 font-bold focus:border-amber-500 transition-all outline-none"
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                     <CheckCircle className="h-3 w-3 text-green-600" /> RESULTADO IDEAL (RESPUESTA MAESTRA)
                  </label>
                  <textarea 
                    name="expected_output"
                    value={formData.expected_output}
                    onChange={handleChange}
                    placeholder="Describe cómo debería ser la respuesta perfecta del alumno..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-600 dark:text-zinc-300 font-medium h-48 resize-none focus:border-green-600 transition-all outline-none shadow-inner"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:px-12 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">VISIBILIDAD:</label>
                <select 
                   name="status"
                   value={formData.status}
                   onChange={handleChange}
                   className={`bg-transparent font-black uppercase tracking-widest text-[10px] outline-none ${
                     formData.status === 'published' ? 'text-green-600' : 'text-zinc-400'
                   }`}
                >
                   <option value="draft">Borrador (Oculto)</option>
                   <option value="published">Publicado (Visible)</option>
                   <option value="archived">Archivado</option>
                </select>
             </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <button 
               onClick={onClose}
               className="flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
             >
               Descartar
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex-1 md:flex-none px-12 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <Save className="h-4 w-4" /> Guardar Clase
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
