import { PublicNavbar } from "@/components/layout/navigation/public-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
