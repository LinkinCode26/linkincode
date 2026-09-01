import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = 'lc-theme';
const DEFAULT_THEME = 'dark';

export const ThemeContext = createContext(null);

const isValidTheme = (theme) => theme === 'dark' || theme === 'light';

const readStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage puede fallar en modo privado o si está deshabilitado.
    return null;
  }
};

const getInitialTheme = () => {
  const stored = readStoredTheme();
  if (isValidTheme(stored)) return stored;
  return DEFAULT_THEME;
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Aplica el atributo data-theme al <html> y persiste en localStorage
  // cada vez que el tema cambia.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Si no se puede persistir, el tema queda igual solo durante la sesión.
    }
  }, [theme]);

  const setTheme = (nextTheme) => {
    if (!isValidTheme(nextTheme) || nextTheme === theme) return;
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = { theme, setTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;