"use client";

import Link from "next/link";
import { BookOpen, Award, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  return (
    <section className={`relative overflow-hidden ${isAuthenticated ? 'pt-24 pb-12 lg:pt-32' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
      {/* Animated Glow Background (Focused on the Title) */}
      <div className="absolute top-20 left-1/2 -z-10 -translate-x-1/2 w-full max-w-4xl h-[400px]">
        <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] rounded-full animate-bounce duration-[12000ms]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        {!isAuthenticated && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-600/20 mb-8 animate-in fade-in slide-in-from-bottom-4">
            EL FUTURO DE LA IA ESTÁ AQUÍ
          </div>
        )}

        <h1 className={`mx-auto max-w-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-500 ${isAuthenticated ? 'text-5xl md:text-7xl mb-12' : 'text-5xl md:text-7xl lg:text-8xl mb-8'}`}>
          Domina la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Inteligencia Artificial</span> como un experto.
        </h1>

        {isAuthenticated ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 px-4">
            {[
              { 
                title: "MI ACADEMIA", 
                desc: "Continúa tu aprendizaje", 
                icon: BookOpen, 
                href: "/academy",
                color: "from-blue-600/20 to-blue-600/5",
                iconColor: "text-blue-600"
              },
              { 
                title: "CERTIFICADOS", 
                desc: "Valida tus habilidades", 
                icon: Award, 
                href: "/certificates",
                color: "from-purple-600/20 to-purple-600/5",
                iconColor: "text-purple-600"
              },
              { 
                title: "DIRECTORIO IA", 
                desc: "Explora herramientas", 
                icon: Globe, 
                href: "/directory",
                color: "from-indigo-600/20 to-indigo-600/5",
                iconColor: "text-indigo-600"
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className="group relative p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600/50 transition-all overflow-hidden shadow-xl hover:-translate-y-2 flex flex-col items-center"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`h-20 w-20 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center ${item.iconColor} mb-8 group-hover:scale-110 transition-transform shadow-2xl`}>
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-[12px] font-black font-outfit uppercase tracking-[0.4em] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors mb-2">{item.title}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{item.desc}</p>
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
              La plataforma definitiva para aprender, descubrir herramientas y escalar tus habilidades en la era de la IA. Todo en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black font-outfit uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
              >
                Comenzar Gratis
              </Link>
              <Link
                href="/directory"
                className="w-full sm:w-auto px-10 py-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-black font-outfit uppercase tracking-wider rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                Ver Directorio
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
