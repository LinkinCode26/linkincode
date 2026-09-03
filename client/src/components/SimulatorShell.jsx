import { useSimulator } from "../hooks/useSimulator";

export function SimulatorShell({ title = "SIMULANDO EN VIVO", children }) {
  const { isFullscreen, toggleFullscreen, resetSimulator, resetKey } =
    useSimulator();

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-bg p-6 sm:p-10 flex flex-col overflow-y-auto"
          : "relative bg-surface rounded-2xl border border-line p-6 flex flex-col h-full shadow-lg"
      }`}
    >
      {/* Header del Shell con botones estándar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
            {isFullscreen ? "EDITANDO EN VIVO" : title}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-mute">
          <button
            type="button"
            onClick={resetSimulator}
            className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
          >
            <i className="fas fa-rotate-right text-[10px]" /> Reiniciar
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
          >
            <i
              className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"} text-[10px]`}
            />
            {isFullscreen ? "Salir" : "Pantalla completa"}
          </button>
        </div>
      </div>

      {/* Contenedor del contenido del simulador (el key={resetKey} fuerza el reseteo del componente hijo) */}
      <div className="flex-1 flex flex-col" key={resetKey}>
        {children}
      </div>
    </div>
  );
}

export default SimulatorShell;
