/**
 * Componente Input base con estado de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Input({ label, hasError = false, className = "", ...props }) {
  const baseInput =
    "w-full bg-surface border rounded-xl px-5 py-4 text-ink outline-none transition-all";
  const borderState = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-line focus:border-brand";

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2">
          {label}
        </label>
      )}
      <input className={`${baseInput} ${borderState}`} {...props} />
    </div>
  );
}

/**
 * Componente Select base con estado de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {Array} options - Opciones disponibles [{ value: '1', label: 'Opción 1' }].
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Select({
  label,
  options = [],
  hasError = false,
  className = "",
  ...props
}) {
  const baseInput =
    "w-full bg-surface border rounded-xl px-5 py-4 text-ink outline-none transition-all";
  const borderState = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-line focus:border-brand";

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2">
          {label}
        </label>
      )}
      <select className={`${baseInput} ${borderState}`} {...props}>
        <option value="">Seleccioná una opción</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Componente Textarea base con estado de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Textarea({
  label,
  hasError = false,
  className = "",
  ...props
}) {
  const baseInput =
    "w-full bg-surface border rounded-xl px-5 py-4 text-ink outline-none transition-all";
  const borderState = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-line focus:border-brand";

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2">
          {label}
        </label>
      )}
      <textarea className={`${baseInput} ${borderState}`} {...props} />
    </div>
  );
}
