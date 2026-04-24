
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Award, ArrowLeft, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { academyService } from "@/features/academy/services/academy.service";
import { PrintButton } from "@/features/academy/components/print-button";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .schema('accounts')
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  // 2. Fetch Progress and Activities to verify completion
  const [activities, progress] = await Promise.all([
    academyService.getPublishedActivities(supabase),
    academyService.getUserProgress(user.id, supabase)
  ]);

  const totalActivities = activities.length;
  const completedActivities = progress.length;
  const isAllCompleted = totalActivities > 0 && completedActivities >= totalActivities;

  const userName = profile?.certificate_name || profile?.full_name || "ESTUDIANTE DE IA";
  const completionDate = progress.length > 0
    ? new Date(Math.max(...progress.map(p => new Date(p.completed_at).getTime()))).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">

        <div className="flex items-center justify-between mb-12 no-print">
          <Link href="/academy" className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors group">
            <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-zinc-900 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Volver a la Academia</span>
          </Link>

          {isAllCompleted && <PrintButton />}
        </div>

        {!isAllCompleted ? (
          <div className="py-32 px-12 rounded-[3.5rem] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center space-y-8 no-print">
            <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">Certificado Bloqueado</h2>
              <p className="text-zinc-500 font-medium">
                Debes completar los 5 niveles de la academia (25 clases en total) para desbloquear tu certificación profesional.
              </p>
              <div className="pt-4">
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
                  />
                </div>
                <p className="mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {completedActivities} de {totalActivities} CLASES COMPLETADAS
                </p>
              </div>
            </div>
            <Link href="/academy" className="px-10 py-5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
              Continuar Aprendiendo
            </Link>
          </div>
        ) : (
          <div className="certificate-container relative p-1 md:p-12 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 opacity-[0.03] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Certificate Frame */}
            <div className="relative border-[12px] border-double border-zinc-100 dark:border-zinc-800 p-8 md:p-16 text-center space-y-12 print:space-y-4 print:p-10 print:border-[10px]">

              {/* Logo & Header */}
              <div className="flex flex-col items-center gap-6 print:gap-3">
                <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-600/30 print:shadow-none print:h-14 print:w-14 print:text-2xl">
                  A
                </div>
                <div className="space-y-2 print:space-y-1">
                  <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.6em] print:text-xs">CERTIFICADO DE MAESTRÍA</h1>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest print:text-[8px]">OTORGADO POR PDIA ACADEMY</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-8 print:space-y-4">
                <p className="text-zinc-500 font-medium italic text-lg print:text-sm">Este documento certifica que</p>
                <h2 className="text-5xl md:text-7xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none break-words print:text-5xl">
                  {userName}
                </h2>
                <div className="h-1 w-32 bg-blue-600 mx-auto rounded-full print:w-24 print:h-0.5" />
                <p className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed print:text-base print:max-w-xl">
                  Ha completado con éxito el <span className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-lg print:text-base">Programa de Maestría en Ingeniería de Prompts</span>, dominando los 5 niveles de especialización técnica y estratégica en el uso de modelos de lenguaje de última generación.
                </p>
              </div>

              {/* Footer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 print:gap-4 print:pt-4">
                <div className="space-y-2 print:space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest print:text-[7px]">FECHA DE EMISIÓN</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase print:text-xs">{completionDate}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-4 border-blue-600/20 flex items-center justify-center relative print:h-16 print:w-16">
                    <Star className="h-10 w-10 text-blue-600 print:h-6 print:w-6" />
                    <Award className="absolute -bottom-2 -right-2 h-8 w-8 text-amber-500 fill-amber-500 print:h-5 print:w-5" />
                  </div>
                </div>
                <div className="space-y-2 print:space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest print:text-[7px]">ID DE VALIDACIÓN</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase print:text-xs">{user.id.substring(0, 8)}-{new Date().getFullYear()}</p>
                </div>
              </div>

              {/* Signature Area (Optional Visual) */}
              <div className="pt-12 flex justify-center print:pt-4">
                <div className="w-64 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4 print:w-48 print:pb-2">
                  <p className="font-outfit italic text-2xl text-zinc-400 opacity-50 select-none print:text-lg">PDIA Verification System</p>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2 print:text-[7px]">SISTEMA DE VERIFICACIÓN AUTÓNOMA</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          header, nav, .no-print, button, .ThemeToggle, .Toaster { display: none !important; }
          body, html { 
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          main { 
            padding: 0 !important; 
            margin: 0 !important;
            background: white !important;
          }
          .container { 
            max-width: 100% !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important; 
          }
          .certificate-container { 
            width: 297mm !important;
            height: 210mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 10mm !important;
            margin: 0 auto !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
          }
          .certificate-container > div {
            width: 100% !important;
            height: 100% !important;
            border-width: 15px !important;
            padding: 15mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .certificate-container * {
            color: black !important;
          }
          .certificate-container .bg-blue-600 {
            background-color: #2563eb !important;
            color: white !important;
          }
          .certificate-container .text-blue-600 {
            color: #2563eb !important;
          }
          .certificate-container .text-zinc-400, 
          .certificate-container .text-zinc-500,
          .certificate-container .text-zinc-600 {
            color: #71717a !important;
          }
        }
      `}} />
    </main>
  );
}
