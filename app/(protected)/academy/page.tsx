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

      </div>
    </main>
  );
}
