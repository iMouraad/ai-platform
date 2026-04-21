"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, Play, Award, Settings2, Loader2, ChevronRight, Clock } from "lucide-react";
import { AcademyLevel, Activity } from "../types/academy.types";
import { PromptLab } from "./prompt-lab";
import { LevelDetailsModal } from "./level-details-modal";
import { academyService } from "../services/academy.service";
import { toast } from "sonner";

export const AcademyRoadmap = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<AcademyLevel | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLevelsFromActivities = (items: Activity[]): AcademyLevel[] => {
    const levelsMap: Record<string, AcademyLevel> = {
      basic: { id: "l1", name: "Nivel 1: El Arquitecto de Prompts", description: "Domina las bases fundamentales y aprende a pensar como el modelo.", level_type: "basic", activities: [], total_activities: 0, completed_activities: 0, status: 'available' },
      intermediate: { id: "l2", name: "Nivel 2: Productividad de Élite", description: "Integra condiciones complejas y optimiza tus flujos de trabajo.", level_type: "intermediate", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
      advanced: { id: "l3", name: "Nivel 3: Agentes e IA Autónoma", description: "Configura sistemas dinámicos y roles de experto avanzados.", level_type: "advanced", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
    };

    items.forEach(activity => {
      if (levelsMap[activity.level]) {
        levelsMap[activity.level].activities.push(activity);
        levelsMap[activity.level].total_activities++;
      }
    });

    return Object.values(levelsMap).filter(l => l.activities.length > 0);
  };

  const fetchPublishedActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await academyService.getPublishedActivities();
      setActivities(data);
    } catch (error) {
      toast.error("Error al cargar la academia");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublishedActivities();
  }, [fetchPublishedActivities]);

  const levels = getLevelsFromActivities(activities);

  const handleStartActivity = (activity: Activity) => {
    setActiveActivity(activity);
    setSelectedLevel(null);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Sincronizando Academia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {activeActivity && (
          <PromptLab 
            activity={activeActivity}
            onClose={() => setActiveActivity(null)}
            onComplete={() => {
              setActiveActivity(null);
              toast.success("¡Actividad completada!");
            }}
          />
        )}

        {selectedLevel && (
          <LevelDetailsModal 
            level={selectedLevel}
            onClose={() => setSelectedLevel(null)}
            onStartActivity={handleStartActivity}
          />
        )}
      </AnimatePresence>

      {/* Academy Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-2 w-10 bg-blue-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">PROGRAMA DE MAESTRÍA ACTIVO</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
            Tu Camino <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Hacia la Maestría</span>
          </h2>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xl flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">CLASES DISPONIBLES</p>
            <p className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">{activities.length}</p>
          </div>
        </div>
      </div>

      {levels.length === 0 ? (
        <div className="py-24 px-12 rounded-[3.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center space-y-6">
           <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
              <Settings2 className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Academia en Preparación</h3>
              <p className="text-zinc-400 font-medium max-w-sm mx-auto">
                No hay clases publicadas todavía. El administrador está preparando los laboratorios de prompts para tu entrenamiento.
              </p>
           </div>
        </div>
      ) : (
        <div className="grid gap-12 relative pl-4 md:pl-12">
           <div className="absolute left-10 md:left-24 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-zinc-100 dark:via-zinc-800 to-transparent" />
           
           {levels.map((level, idx) => {
             const isLocked = level.level_type !== 'basic'; // Lógica simple para ahora
             
             return (
               <div key={level.id} className="relative space-y-8">
                 <div 
                   onClick={() => !isLocked && setSelectedLevel(level)}
                   className={`absolute -left-10 md:-left-12 top-0 h-12 w-12 rounded-full border-4 flex items-center justify-center z-10 shadow-xl transition-all ${
                     isLocked ? 'bg-zinc-100 border-zinc-200 text-zinc-400' : 'bg-white dark:bg-zinc-950 border-blue-600 text-blue-600 cursor-pointer hover:scale-110 shadow-blue-600/20'
                   }`}
                 >
                    {isLocked ? <Lock className="h-4 w-4" /> : <span className="text-xs font-black">{idx + 1}</span>}
                 </div>

                 <div className="space-y-2 pl-8 md:pl-20">
                    <h3 className={`text-2xl font-black font-outfit uppercase tracking-tighter transition-colors ${
                      isLocked ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-900 dark:text-zinc-50 cursor-pointer hover:text-blue-600'
                    }`} onClick={() => !isLocked && setSelectedLevel(level)}>
                      {level.name}
                    </h3>
                    <p className="text-sm text-zinc-400 font-medium max-w-xl">{level.description}</p>
                 </div>

                 <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 pl-8 md:pl-20 ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                    {level.activities.map((activity) => (
                      <motion.div 
                        key={activity.id}
                        whileHover={!isLocked ? { scale: 1.02 } : {}}
                        className={`group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all flex flex-col justify-between ${
                          !isLocked ? 'cursor-pointer hover:shadow-2xl hover:border-blue-600/30' : ''
                        }`}
                        onClick={() => !isLocked && handleStartActivity(activity)}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                               RETO DE {activity.type.replace('_', ' ')}
                             </span>
                             {activity.video_url && <Play className="h-4 w-4 text-blue-600" />}
                          </div>
                          <h4 className="text-xl font-black font-outfit text-zinc-900 dark:text-zinc-50 leading-tight uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {activity.description}
                          </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900/50 pt-6">
                           <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-zinc-300" />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Inicia la Clase ahora</span>
                           </div>
                           <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
                              <ChevronRight className="h-4 w-4" />
                           </div>
                        </div>
                      </motion.div>
                    ))}
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};
