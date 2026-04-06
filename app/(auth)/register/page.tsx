import { RegisterForm } from "@/features/auth/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-white dark:bg-zinc-950">
      {/* Visual Section (Left) */}
      <div className="relative hidden lg:flex lg:w-1/3 flex-col bg-zinc-900 p-16 text-white overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2563eb_0%,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#4f46e5_0%,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
        
        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform">A</div>
            <span className="text-2xl font-black font-outfit tracking-tighter uppercase">AI Platform</span>
          </Link>
        </div>

        <div className="relative z-20 mt-auto max-w-sm">
          <div className="h-1 w-20 bg-blue-600 mb-8 rounded-full" />
          <blockquote className="space-y-6">
            <p className="text-3xl font-black font-outfit leading-[1.1] tracking-tighter uppercase italic opacity-80">
              &ldquo;Empezar mi camino en la IA fue abrumador hasta que encontré esta plataforma. Todo está organizado paso a paso.&rdquo;
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-blue-500 text-xs">ML</div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-white">Marina López</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Frontend Developer</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Section (Right) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <RegisterForm />
      </div>

      {/* Background Decorative Element for Mobile */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
    </div>
  );
}
