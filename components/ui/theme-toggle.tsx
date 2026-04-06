"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[1000] flex flex-col gap-4">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="group relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 dark:bg-zinc-900/10 backdrop-blur-3xl border border-white/20 dark:border-zinc-800/50 shadow-2xl flex items-center justify-center transition-all active:scale-90 hover:scale-110 hover:shadow-blue-600/20"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Glow */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500 ${isDark ? 'bg-yellow-500' : 'bg-blue-600'}`} />
      </button>
    </div>
  );
}
