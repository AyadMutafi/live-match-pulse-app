import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "fanpulse_theme";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-400 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground transition-transform" />
      )}
    </Button>
  );
}
