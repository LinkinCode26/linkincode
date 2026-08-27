/**
 * Componente Button reutilizable.
 * @param {string} variant - Define el estilo visual: 'brand', 'accent' u 'outline'.
 * @param {string} size - Define el tamaño. Por defecto hereda padding base.
 */
export function Button({
  children,
  variant = "brand",
  size = "normal",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-lg";

  const sizeStyles = {
    normal: "px-6 py-3.5 text-sm",
    small: "px-4 py-2 text-xs",
  };

  const variants = {
    brand: "bg-brand hover:bg-brand/90 text-white shadow-brand/25",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-accent/25",
    outline:
      "border border-line bg-surface/70 backdrop-blur-md hover:border-brand/50 text-mute hover:text-ink shadow-none",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
