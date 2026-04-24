
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SessionTrackerWrapper } from "@/components/providers/session-tracker-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "PDIA AI Platform",
  description: "Plataforma avanzada de IA y Academia de Prompt Engineering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SessionTrackerWrapper />
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <ThemeToggle />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}