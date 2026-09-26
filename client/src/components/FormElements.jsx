/**
 * Componente Input base con estado de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {string} id - ID del input (necesario para asociar el label).
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Input({ id, label, hasError = false, className = "", ...props }) {
  const baseInput =
    "w-full bg-surface border rounded-xl px-5 py-4 text-ink outline-none transition-all";
  const borderState = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-line focus:border-brand";

  // Fallback a props.name si no viene id (útil cuando el form usa name).
  const inputId = id ?? props.name;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-errormessage={hasError ? `${inputId}-error` : undefined}
        className={`${baseInput} ${borderState}`}
        {...props}
      />
    </div>
  );
}

/**
 * Componente Select base con estado de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {string} id - ID del select.
 * @param {Array} options - Opciones disponibles [{ value: '1', label: 'Opción 1' }].
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Select({
  id,
  label,
  options = [],
  hasError = false,
  placeholder,
  className = "",
  ...props
}) {
  const baseInput =
    "w-full bg-surface border rounded-xl px-5 py-4 text-ink outline-none transition-all";
  const borderState = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-line focus:border-brand";

  const selectId = id ?? props.name;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={hasError || undefined}
        aria-errormessage={hasError ? `${selectId}-error` : undefined}
        className={`${baseInput} ${borderState}`}
        {...props}
      >
        <option value="">{placeholder ?? "Seleccioná una opción"}</option>
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
 * @param {string} id - ID del textarea.
 * @param {boolean} hasError - Si es true, el borde se vuelve rojo.
 */
export function Textarea({
  id,
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

  const textareaId = id ?? props.name;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mute mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-invalid={hasError || undefined}
        aria-errormessage={hasError ? `${textareaId}-error` : undefined}
        className={`${baseInput} ${borderState}`}
        {...props}
      />
    </div>
  );
}