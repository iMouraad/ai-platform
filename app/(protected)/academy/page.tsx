import { AcademyRoadmap } from "@/features/academy/components/academy-roadmap";
import { Sparkles, Trophy, Users, Clock } from "lucide-react";

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: "ESTUDIANTES ACTUANDO", value: "+1,200", icon: Users, color: "text-blue-600" },
            { label: "LECCIONES TOTALES", value: "48", icon: Sparkles, color: "text-amber-500" },
            { label: "NIVEL ACTUAL", value: "Arquitecto", icon: Trophy, color: "text-purple-600" },
            { label: "TIEMPO ESTIMADO", value: "24h", icon: Clock, color: "text-emerald-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-2">
                 <stat.icon className={`h-4 w-4 ${stat.color}`} />
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</span>
               </div>
               <p className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* The Main Learning Roadmap */}
        <AcademyRoadmap />

        {/* Bottom Banner - CTA for Certification */}
        <div className="mt-32 p-10 md:p-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3.5rem] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-black font-outfit mb-6 tracking-tighter leading-none uppercase">
                Obtén tu Certificación Profesional
              </h3>
              <p className="text-xl text-blue-100/80 font-medium leading-relaxed">
                Al completar los 5 niveles de maestría, desbloquearás el examen final para obtener tu Certificado Oficial de PDIA con validez internacional.
              </p>
            </div>
            <div className="shrink-0">
               <div className="h-32 w-32 md:h-48 md:w-48 rounded-full border-8 border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Trophy className="h-16 w-16 md:h-24 md:w-24 text-white" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
