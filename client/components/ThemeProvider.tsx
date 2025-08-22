import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const root = window.document.documentElement;

    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const applyTheme = (newTheme: Theme) => {
      let effectiveTheme: "dark" | "light";

      if (newTheme === "system") {
        effectiveTheme = getSystemTheme();
      } else {
        effectiveTheme = newTheme;
      }

      setCurrentTheme(effectiveTheme);

      root.classList.remove("light", "dark");
      root.classList.add(effectiveTheme);

      // Store in localStorage
      localStorage.setItem("theme", newTheme);
    };

    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme toggle component
export function ThemeToggle() {
  const { theme, setTheme, currentTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-jobequal-neutral-dark dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} theme`}
    >
      <div className="relative w-5 h-5">
        {currentTheme === "light" ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400 group-hover:-rotate-12 transition-transform duration-200" />
        )}

        {theme === "system" && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-jobequal-green rounded-full animate-pulse" />
        )}
      </div>
    </button>
  );
}
