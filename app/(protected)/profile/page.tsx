import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the profile data
  const { data: profile, error } = await supabase
    .schema("accounts")
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching profile:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <h2 className="text-xl font-bold font-outfit uppercase tracking-tighter">Error al cargar perfil</h2>
        <p className="text-zinc-500 text-sm">No pudimos recuperar tu información personal.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 max-w-5xl">
       <ProfileForm initialData={profile} />
    </main>
  );
}
