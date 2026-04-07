import React from "react";

export default function AcademyPage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-zinc-50">
        Próximamente
      </h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto">
        El módulo de Mi Academia está en desarrollo. Pronto descubrirás una nueva forma de aprender sobre IA.
      </p>
    </div>
  );
}
