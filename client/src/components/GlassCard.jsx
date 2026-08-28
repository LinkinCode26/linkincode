/**
 * Contenedor con efecto cristal (Glassmorphism) basado en el boceto original.
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
