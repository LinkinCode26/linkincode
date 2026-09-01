import useTheme from '../hooks/useTheme';

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
        <i className={isDark ? 'fas fa-moon' : 'fas fa-sun'} />
      </span>
    </button>
  );
};

export default ThemeToggle;