/**
 * Indicador visual para etiquetas o estados.
 * @param {string} text - Texto a mostrar.
 * @param {string} color - 'brand' (azul) o 'accent' (cian).
 * @param {boolean} pulse - Si es true, el punto de color titila.
 */
export function Badge({ text, color = "accent", pulse = false }) {
  const colorMap = {
    brand: "bg-brand text-brand",
    accent: "bg-accent text-accent",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-2 h-2 rounded-full ${colorMap[color].split(" ")[0]} ${pulse ? "animate-pulse" : ""}`}
      ></span>
      <span className="text-xs font-bold uppercase tracking-widest text-mute">
        {text}
      </span>
    </div>
  );
}
