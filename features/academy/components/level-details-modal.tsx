"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Video, 
  FileText, 
  Zap,
  ChevronRight
} from "lucide-react";
import { AcademyLevel, Activity, UserActivityProgress } from "../types/academy.types";

interface LevelDetailsModalProps {
  level: AcademyLevel;
  userProgress: UserActivityProgress[];
  onClose: () => void;
  onStartActivity: (activity: Activity) => void;
}

export const LevelDetailsModal = ({ level, userProgress, onClose, onStartActivity }: LevelDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-8 md:p-12 border-b border-zinc-100 dark:border-zinc-800 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -z-10" />
          
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">ACADEMIA • CURRÍCULO</span>
              <h2 className="text-4xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
                {level.name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            {level.description}
          </p>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-4">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">LABORATORIOS DISPONIBLES ({level.activities.length})</h3>
          </div>

          {level.activities.map((activity) => (
            <button
               key={activity.id}
               onClick={() => onStartActivity(activity)}
               className="w-full p-6 rounded-[2rem] flex items-center justify-between group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border border-zinc-100 dark:border-zinc-800 hover:border-blue-600/30"
            >
               <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-colors ${
                    activity.video_url ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}>
                     {activity.video_url ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div className="text-left">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-600">RETO INTERACTIVO</span>
                        <div className="flex items-center gap-3">
                           {userProgress.some(p => p.activity_id === activity.id) && (
                              <div className="flex items-center gap-1 text-green-500">
                                 <CheckCircle2 className="h-2.5 w-2.5" />
                                 <span className="text-[8px] font-black uppercase tracking-[0.2em]">COMPLETADO</span>
                              </div>
                           )}
                           {activity.video_url && (
                              <div className="flex items-center gap-1 text-zinc-400">
                                 <Play className="h-2.5 w-2.5 fill-current" />
                                 <span className="text-[8px] font-black uppercase tracking-[0.2em]">VIDEO GUÍA</span>
                              </div>
                           )}
                        </div>
                     </div>
                     <h4 className="text-xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                        {activity.title}
                     </h4>
                     <p className="text-xs text-zinc-400 line-clamp-1">{activity.description}</p>
                  </div>
               </div>
               <div className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                  <ChevronRight className="h-5 w-5" />
               </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 flex justify-between items-center shrink-0">
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              NIVEL: <span className="text-blue-600">{level.level_type.toUpperCase()}</span>
           </p>
           <button 
             onClick={onClose}
             className="text-[10px] font-black text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors"
           >
             Cerrar Detalles
           </button>
        </div>
      </motion.div>
    </div>
  );
};
