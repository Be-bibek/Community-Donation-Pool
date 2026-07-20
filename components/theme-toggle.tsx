"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-muted" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
      title="Toggle visual theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={isDark ? "absolute" : "block"}
      >
        <Sun className="w-[18px] h-[18px] text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={isDark ? "block" : "absolute"}
      >
        <Moon className="w-[18px] h-[18px] text-primary" />
      </motion.div>
    </button>
  );
}
