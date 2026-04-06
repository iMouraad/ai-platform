import Link from "next/link";

export const Hero = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  return (
    <section className={`relative overflow-hidden ${isAuthenticated ? 'pt-24 pb-4 lg:pt-32' : 'pt-32 pb-20 lg:pt-48 lg:pb-32'}`}>
      {/* Animated Glow Background (Focused on the Title) */}
      <div className="absolute top-20 left-1/2 -z-10 -translate-x-1/2 w-full max-w-4xl h-[400px]">
        <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] rounded-full animate-bounce duration-[12000ms]" />
      </div>
      
      <div className="container mx-auto px-6 text-center">
        {!isAuthenticated && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-600/20 mb-8 animate-in fade-in slide-in-from-bottom-4">
            ✨ EL FUTURO DE LA IA ESTÁ AQUÍ
          </div>
        )}
        
        <h1 className={`mx-auto max-w-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-500 ${isAuthenticated ? 'text-4xl md:text-6xl mb-4' : 'text-5xl md:text-7xl lg:text-8xl mb-8'}`}>
          Domina la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 animate-pulse">Inteligencia Artificial</span> como un experto.
        </h1>
        
        {!isAuthenticated && (
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
