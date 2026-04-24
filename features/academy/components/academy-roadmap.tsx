"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, Play, Award, Settings2, Loader2, ChevronRight, Clock, Trophy } from "lucide-react";
import { AcademyLevel, Activity, UserActivityProgress } from "../types/academy.types";
import { PromptLab } from "./prompt-lab";
import { LevelDetailsModal } from "./level-details-modal";
import { academyService } from "../services/academy.service";
import { toast } from "sonner";

export const AcademyRoadmap = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<AcademyLevel | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // --- CONFIGURACIÓN DE DESBLOQUEO ---
  // Para pruebas: 15 segundos
  // Para producción: 7 días
  const UNLOCK_TIME_SECONDS = 604800; // 7 días por nivel (7 * 24 * 60 * 60)
  // -----------------------------------

  const getLevelsFromActivities = (items: Activity[], userProgress: UserActivityProgress[], premiumStartDate: string | null, role?: string): AcademyLevel[] => {
    const levelsMap: Record<string, AcademyLevel> = {
      basic: { id: "l1", name: "Nivel 1: El Arquitecto de Prompts", description: "Domina las bases fundamentales y aprende a pensar como el modelo.", level_type: "basic", activities: [], total_activities: 0, completed_activities: 0, status: 'available' },
      intermediate: { id: "l2", name: "Nivel 2: Productividad de Élite", description: "Integra condiciones complejas y optimiza tus flujos de trabajo.", level_type: "intermediate", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
      advanced: { id: "l3", name: "Nivel 3: Agentes e IA Autónoma", description: "Configura sistemas dinámicos y roles de experto avanzados.", level_type: "advanced", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
      expert: { id: "l4", name: "Nivel 4: Ingeniería de Sistemas IA", description: "Diseña arquitecturas complejas y optimiza el rendimiento de los modelos.", level_type: "expert", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
      master: { id: "l5", name: "Nivel 5: Maestría en Prompt Engineering", description: "Domina las técnicas más avanzadas y lidera la revolución de la IA.", level_type: "master", activities: [], total_activities: 0, completed_activities: 0, status: 'locked' },
    };

    const completedIds = new Set(userProgress.map(p => p.activity_id));

    items.forEach(activity => {
      if (levelsMap[activity.level]) {
        levelsMap[activity.level].activities.push(activity);
        levelsMap[activity.level].total_activities++;
        if (completedIds.has(activity.id)) {
          levelsMap[activity.level].completed_activities++;
        }
      }
    });

    const levelOrder = ['basic', 'intermediate', 'advanced', 'expert', 'master'];
    const now = new Date();
    const startDate = premiumStartDate ? new Date(premiumStartDate) : now;
    const isSpecialRole = role === 'admin' || role === 'instructor';

    return levelOrder.map((key, index) => {
      const level = levelsMap[key];

      // Si ya está completado, siempre es 'completed'
      if (level.completed_activities === level.total_activities && level.total_activities > 0) {
        level.status = 'completed';
      } else if (index === 0) {
        // El Nivel 1 siempre está disponible
        level.status = 'available';
      } else {
        // Cálculo basado en tiempo transcurrido desde el inicio (startDate)
        // Nivel 2: startDate + 1 * UNLOCK_TIME
        // Nivel 3: startDate + 2 * UNLOCK_TIME
        // etc.
        const unlockTimeMs = index * UNLOCK_TIME_SECONDS * 1000;
        const canUnlock = isSpecialRole || (premiumStartDate && (now.getTime() - startDate.getTime()) >= unlockTimeMs);

        if (canUnlock) {
          level.status = 'available';
        } else {
          level.status = 'locked';
        }
      }

      return level;
    }).filter(l => l.activities.length > 0);
  };

  const [userProgress, setUserProgress] = useState<UserActivityProgress[]>([]);
  const [user, setUser] = useState<any>(null);

  const fetchAcademyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseClient = import("@/lib/supabase/client").then(m => m.createClient());
      const client = await supabaseClient;

      const [activitiesData, userData] = await Promise.all([
        academyService.getPublishedActivities(client),
        client.auth.getUser()
      ]);

      setActivities(activitiesData);

      if (userData.data.user) {
        setUser(userData.data.user);

        // Obtener progreso y perfil (para la fecha de creación)
        const [progressData, profileData] = await Promise.all([
          academyService.getUserProgress(userData.data.user.id, client),
          client.schema('accounts').from('profiles').select('created_at, premium_at, role').eq('auth_user_id', userData.data.user.id).single()
        ]);

        setUserProgress(progressData);
        if (profileData.data) {
          setProfile(profileData.data);
        }
      }
    } catch (error) {
      toast.error("Error al cargar la academia");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademyData();
  }, [fetchAcademyData]);

  const levels = getLevelsFromActivities(activities, userProgress, profile?.premium_at || null, profile?.role);
  const isAllCompleted = levels.length > 0 && levels.every(l => l.status === 'completed');

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
    <div className="space-y-12" suppressHydrationWarning>
      <AnimatePresence>
        {activeActivity && (
          <PromptLab
            activity={activeActivity}
            onClose={() => setActiveActivity(null)}
            onComplete={async (userResponse) => {
              if (user) {
                try {
                  const { createClient } = await import("@/lib/supabase/client");
                  const client = createClient();
                  await academyService.saveUserProgress({
                    user_id: user.id,
                    activity_id: activeActivity.id,
                    user_response: userResponse
                  }, client);
                  // Refresh progress
                  const progressData = await academyService.getUserProgress(user.id, client);
                  setUserProgress(progressData);
                  toast.success("¡Actividad completada y guardada!");
                } catch (error) {
                  toast.error("Error al guardar el progreso");
                }
              }
              setActiveActivity(null);
            }}
          />
        )}

        {selectedLevel && (
          <LevelDetailsModal
            level={selectedLevel}
            userProgress={userProgress}
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
        <>
          <div className="grid gap-12 relative pl-4 md:pl-12" suppressHydrationWarning>
            {levels.map((level, idx) => {
              const isLocked = level.status === 'locked';
              const isCompleted = level.status === 'completed';

              return (
                <div key={level.id} className="relative space-y-8">
                  {/* Connector Line to Next Level */}
                  {idx < levels.length - 1 && (
                    <div
                      className={`absolute left-6 md:left-12 top-6 bottom-[-48px] w-[2px] z-0 transition-all duration-700 ${isCompleted
                          ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                          : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                    />
                  )}

                  <div
                    onClick={() => !isLocked && setSelectedLevel(level)}
                    className={`absolute left-0 md:left-6 top-0 h-12 w-12 rounded-full border-4 flex items-center justify-center z-10 shadow-xl transition-all ${isLocked
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        : 'bg-white dark:bg-zinc-950 border-blue-600 text-blue-600 cursor-pointer hover:scale-110 shadow-blue-600/20'
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : isLocked ? <Lock className="h-4 w-4" /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>

                  <div className="space-y-2 pl-16 md:pl-24">
                    <h3 className={`text-2xl font-black font-outfit uppercase tracking-tighter transition-colors ${isLocked ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-900 dark:text-zinc-50 cursor-pointer hover:text-blue-600'
                      }`} onClick={() => !isLocked && setSelectedLevel(level)}>
                      {level.name}
                    </h3>
                    <p className="text-sm text-zinc-400 font-medium max-w-xl">{level.description}</p>
                  </div>

                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 pl-16 md:pl-24 ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                    {level.activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileHover={!isLocked ? { scale: 1.02 } : {}}
                        className={`group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all flex flex-col justify-between ${!isLocked ? 'cursor-pointer hover:shadow-2xl hover:border-blue-600/30' : ''
                          }`}
                        onClick={() => !isLocked && handleStartActivity(activity)}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                              RETO DE {activity.type.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              {userProgress.some(p => p.activity_id === activity.id) && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                              {activity.video_url && <Play className="h-4 w-4 text-blue-600" />}
                            </div>
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
          <div className="mt-32 p-10 md:p-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3.5rem] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-black font-outfit mb-6 tracking-tighter leading-none uppercase">
                  {isAllCompleted ? "¡Felicidades, Maestro!" : "Obtén tu Certificación Profesional"}
                </h3>
                <p className="text-xl text-blue-100/80 font-medium leading-relaxed">
                  {isAllCompleted
                    ? "Has completado los 5 niveles de maestría. Tu certificado oficial de PDIA ya está disponible para descargar."
                    : "Al completar los 5 niveles de maestría, desbloquearás el examen final para obtener tu Certificado Oficial de PDIA con validez internacional."
                  }
                </p>
                {isAllCompleted && (
                  <a
                    href="/certificates"
                    className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
                  >
                    Ver Mi Certificado <Award className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="shrink-0">
                <div className={`h-32 w-32 md:h-48 md:w-48 rounded-full border-8 border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700 ${isAllCompleted ? 'bg-green-500/20 border-green-500/40' : ''}`}>
                  <Trophy className={`h-16 w-16 md:h-24 md:w-24 ${isAllCompleted ? 'text-green-400' : 'text-white'}`} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
