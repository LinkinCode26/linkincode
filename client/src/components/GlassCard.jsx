/**
 * Contenedor con efecto cristal (Glassmorphism).
 * @param {React.ReactNode} children - Contenido interno de la card.
 * @param {string} className - Clases adicionales de Tailwind.
 */
export function GlassCard({ children, className = "", ...props }) {
  const glassStyles =
    "bg-surface/70 backdrop-blur-md border border-line shadow-2xl rounded-2xl";

  return (
    <div className={`${glassStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
