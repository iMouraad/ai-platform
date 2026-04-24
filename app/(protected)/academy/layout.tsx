import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessageCircle, Lock } from "lucide-react";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile || profile.role === "student") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-blue-600/10 flex items-center justify-center shadow-2xl shadow-blue-600/10">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
              Mi <span className="text-blue-600"> Academia</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-base leading-relaxed">
              Para acceder a{" "}
              <span className="font-black text-zinc-900 dark:text-zinc-50">MI ACADEMIA</span>{" "}
              y obtener su certificado profesional contáctese vía Whatsapp con el siguiente número:
            </p>
            <p className="text-2xl font-black text-blue-600 tracking-tight">+593 99 522 0227</p>
          </div>

          <a
            href="https://wa.me/593995220227"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-green-500/30 transition-all active:scale-95 hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            Contactar por Whatsapp
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
