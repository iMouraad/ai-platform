import { PrivateNavbar } from "@/components/layout/navigation/private-navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950" suppressHydrationWarning>
      <PrivateNavbar />
      <main className="flex-1 flex flex-col pt-24 pb-8" suppressHydrationWarning>{children}</main>
    </div>
  );
}
