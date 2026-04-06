import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight font-outfit">Recuperar Contraseña</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Introduce tu email y te enviaremos un enlace para restablecer tu acceso.
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase">Email</label>
            <input
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <Button variant="primary" className="w-full">Enviar Instrucciones</Button>
        </form>
        <p className="text-center text-sm text-zinc-500">
          <Link href="/login" className="text-blue-600 hover:underline font-semibold font-outfit">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
