"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "vibrante" | "acolher";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isAcolher: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "vibrante",
  toggleTheme: () => {},
  setTheme: () => {},
  isAcolher: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

const THEME_COOKIE = "be-theme";
const THEME_STORAGE = "brincar-educando-theme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "vibrante",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const applyTheme = useCallback((newTheme: Theme) => {
    // Update <html> data-theme attribute
    document.documentElement.setAttribute("data-theme", newTheme);
    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE, newTheme);
    // Persist to cookie (so SSR reads correct theme on next request)
    document.cookie = `${THEME_COOKIE}=${newTheme};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, []);

  useEffect(() => {
    // On mount: reconcile server-rendered theme with localStorage
    const stored = localStorage.getItem(THEME_STORAGE) as Theme | null;
    const resolved = stored || defaultTheme;
    if (resolved !== theme) {
      setThemeState(resolved);
    }
    applyTheme(resolved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "vibrante" ? "acolher" : "vibrante");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, isAcolher: theme === "acolher" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
