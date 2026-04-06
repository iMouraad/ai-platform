import React from "react";

const FeatureCard = ({ title, description, icon: Icon, id }: { title: string, description: string, icon: React.ReactNode, id?: string }) => (
  <div id={id} className="relative p-8 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
      {Icon}
    </div>
    <h3 className="text-xl font-bold font-outfit mb-3 text-zinc-900 dark:text-zinc-50">{title}</h3>
    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-6">{description}</p>
    <a href="#" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest gap-2">
      Saber más
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  </div>
);

export const Features = () => {
  return (
    <section className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16 sm:mb-24">
          <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Nuestra Plataforma</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 font-outfit">
            Todo lo que necesitas para dominar la IA
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 font-medium">
            Diseñamos una experiencia fluida desde el descubrimiento hasta la certificación profesional.
          </p>
        </div>
        
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            id="directory"
            title="Directorio IA"
            description="Explora cientos de herramientas categorizadas por casos de uso, coste y facilidad de aprendizaje. Encuentra siempre la opción adecuada."
            icon={(
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          />
          <FeatureCard 
            id="academy"
            title="Aprendizaje por Niveles"
            description="Desde lo básico hasta lo avanzado. Desbloquea niveles a medida que completas actividades y fortaleces tus habilidades prácticas."
            icon={(
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          />
          <FeatureCard 
            id="courses"
            title="Cursos y Certificados"
            description="Obtén certificados oficiales con validez para tu currículum. Nuestros cursos son creados por expertos en la industria tecnológica."
            icon={(
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          />
        </div>
      </div>
    </section>
  );
};
