/**
 * Campo de formulario para las pantallas de admin.
 * @param {string} id - Obligatorio: asocia label, input y mensaje de error.
 * @param {string} label - Texto de la etiqueta.
 * @param {string} error - Mensaje de error; si existe, marca el campo inválido.
 * @param {React.ReactNode} trailing - Acción a la derecha (ej: mostrar contraseña).
 *
 * En React 19 `ref` llega como prop común, así que se puede pasar directo.
 */
export function AuthField({ id, label, error, trailing, className = "", ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  const stateClasses = error
    ? "border-red-500 focus-visible:ring-red-500/30"
    : "border-line focus:border-brand focus-visible:ring-brand/30";

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          className={`w-full bg-surface border rounded-xl pl-4 ${
            trailing ? "pr-14" : "pr-4"
          } py-3.5 text-ink placeholder:text-mute/70 outline-none transition-colors focus-visible:ring-2 ${stateClasses}`}
          {...props}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1 flex items-center">
            {trailing}
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-red-400 [[data-theme=light]_&]:text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthField;
