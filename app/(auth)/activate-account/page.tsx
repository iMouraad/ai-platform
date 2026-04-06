import { ActivateAccountForm } from "@/features/auth/components/activate-account-form";
import Link from "next/link";
import { Suspense } from "react";

export default function ActivateAccountPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[100px]" />
      
      <div className="absolute top-10 left-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl leading-none group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/20">
            A
          </div>
          <span className="text-xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
            AI Platform
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Suspense fallback={
          <div className="flex items-center justify-center p-12 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ActivateAccountForm />
        </Suspense>
      </div>
      
      <div className="absolute bottom-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Seguridad de grado militar • Cifrado de extremo a extremo
        </p>
      </div>
    </div>
  );
}
