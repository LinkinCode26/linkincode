import useTheme from '../hooks/useTheme';
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className={`theme-toggle-track ${className}`}
    >
      <span className="theme-toggle-dot">
        {isDark ? (
          <Moon className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Sun className="h-3 w-3" aria-hidden="true" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;