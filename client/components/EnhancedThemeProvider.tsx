import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  systemTheme: "dark" | "light";
  actualTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  systemTheme: "light",
  actualTheme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function EnhancedThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "jobequal-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light");

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Calculate actual theme
  const actualTheme = theme === "system" ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);

    // Set CSS custom properties for theme
    if (actualTheme === "dark") {
      root.style.setProperty("--background", "222.2% 84% 4.9%");
      root.style.setProperty("--foreground", "210% 40% 98%");
      root.style.setProperty("--card", "222.2% 84% 4.9%");
      root.style.setProperty("--card-foreground", "210% 40% 98%");
      root.style.setProperty("--popover", "222.2% 84% 4.9%");
      root.style.setProperty("--popover-foreground", "210% 40% 98%");
      root.style.setProperty("--primary", "142.1% 76.2% 36.3%");
      root.style.setProperty("--primary-foreground", "355.7% 100% 97.3%");
      root.style.setProperty("--secondary", "217.2% 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210% 40% 98%");
      root.style.setProperty("--muted", "217.2% 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215% 20.2% 65.1%");
      root.style.setProperty("--accent", "217.2% 32.6% 17.5%");
      root.style.setProperty("--accent-foreground", "210% 40% 98%");
      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "210% 40% 98%");
      root.style.setProperty("--border", "217.2% 32.6% 17.5%");
      root.style.setProperty("--input", "217.2% 32.6% 17.5%");
      root.style.setProperty("--ring", "142.1% 76.2% 36.3%");
      root.style.setProperty("--radius", "0.5rem");
    } else {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--primary", "142.1% 76.2% 36.3%");
      root.style.setProperty("--primary-foreground", "355.7% 100% 97.3%");
      root.style.setProperty("--secondary", "210% 40% 96%");
      root.style.setProperty("--secondary-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--muted", "210% 40% 96%");
      root.style.setProperty("--muted-foreground", "215.4% 16.3% 46.9%");
      root.style.setProperty("--accent", "210% 40% 96%");
      root.style.setProperty("--accent-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210% 40% 98%");
      root.style.setProperty("--border", "214.3% 31.8% 91.4%");
      root.style.setProperty("--input", "214.3% 31.8% 91.4%");
      root.style.setProperty("--ring", "142.1% 76.2% 36.3%");
      root.style.setProperty("--radius", "0.5rem");
    }
  }, [actualTheme]);

  const value = {
    theme,
    systemTheme,
    actualTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      const newTheme = actualTheme === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
