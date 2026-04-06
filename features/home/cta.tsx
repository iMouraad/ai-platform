import React from "react";
import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-blue-600 px-6 pt-16 shadow-2xl rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-outfit">
              ¿Listo para dominar la IA? <br /> Empieza hoy mismo.
            </h2>
            <p className="mt-6 text-lg leading-8 text-blue-100 font-medium">
              Únete a miles de estudiantes y profesionales que ya están elevando su carrera técnica.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Button variant="secondary" size="lg" href="/register">
                Registrarse Gratis
              </Button>
              <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-blue-200 transition-colors">
                Prueba Demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
             {/* Simple visual placeholder for app screenshot */}
            <div className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10 p-4">
              <div className="h-full w-full bg-blue-900/30 rounded-md border border-white/10 blur-sm flex items-center justify-center text-blue-300 font-mono text-sm leading-6">
                Dashboard Overview [Visual Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
