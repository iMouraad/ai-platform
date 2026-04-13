"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Sparkles, GraduationCap, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    title: "Explora todas las herramientas de IA",
    subtitle: "Accede al directorio completo y descubre plataformas útiles para estudiar, investigar, crear y trabajar mejor.",
    buttonText: "Ver directorio",
    href: "/directory",
    icon: <Sparkles className="h-8 w-8 text-blue-600" />,
    gradient: "from-blue-600/5 to-indigo-600/5",
    accent: "bg-blue-600/10",
  },
  {
    title: "Aprende a usar la IA de forma correcta",
    subtitle: "Accede a clases y minijuegos para aprender a utilizar la inteligencia artificial de manera eficiente.",
    buttonText: "Ir a aprendizaje",
    href: "/academy",
    icon: <GraduationCap className="h-8 w-8 text-emerald-600" />,
    gradient: "from-emerald-600/5 to-teal-600/5",
    accent: "bg-emerald-600/10",
  },
  {
    title: "Obtén tu certificado",
    subtitle: "Completa tu formación y consigue tu Certificado en Uso Práctico de Inteligencia Artificial.",
    buttonText: "Ver certificación",
    href: "/certificates",
    icon: <Award className="h-8 w-8 text-amber-600" />,
    gradient: "from-amber-600/5 to-orange-600/5",
    accent: "bg-amber-600/10",
  },
];

export function PrivateDashboardHeroSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <div className="w-full mb-16 overflow-hidden select-none">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-1">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] min-w-0"
            >
              <div className={`h-full group relative p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800/50 bg-gradient-to-br ${slide.gradient} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5`}>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-zinc-800/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 h-full flex flex-col items-start translate-y-0 translate-x-0">
                  <div className={`p-4 rounded-2xl ${slide.accent} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {slide.icon}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[0.95] mb-4">
                    {slide.title}
                  </h2>
                  
                  <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mb-8 leading-snug">
                    {slide.subtitle}
                  </p>
                  
                  <Link
                    href={slide.href}
                    className="mt-auto group/btn inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white active:scale-95 shadow-xl shadow-black/5"
                  >
                    {slide.buttonText}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
