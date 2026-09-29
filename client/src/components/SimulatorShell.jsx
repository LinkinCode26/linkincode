import { useEffect } from "react";
import { useSimulator } from "../hooks/useSimulator";
import useLanguage from "../hooks/useLanguage";

export function SimulatorShell({ title, children, onExit }) {
  const { isFullscreen, toggleFullscreen, resetSimulator, resetKey } =
    useSimulator();
  const { t } = useLanguage();

  const defaultTitle = t("solutions.simulator.liveEditing", "SIMULANDO EN VIVO");
  const resetLabel = t("solutions.simulator.resetLabel") || "Reiniciar";
  const fullscreenLabel = t("solutions.simulator.fullscreenLabel", "Pantalla completa");
  const exitFullscreenLabel = t("solutions.simulator.exitFullscreenLabel", "Salir de pantalla completa");
  const exitLabel = t("solutions.simulator.exitLabel") || "Salir del simulador";

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") toggleFullscreen();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFullscreen, toggleFullscreen]);

  const handleExit = () => {
    onExit?.();
  };

  // Sin createPortal: ahora que el panel padre ya no atrapa los
  // position:fixed (ver .reveal.in en index.css), alcanza con cambiar las
  // clases de este mismo div. Es el mismo nodo siempre — nunca cambia de
  // tipo ni de contenedor — así que React nunca lo desmonta al entrar o
  // salir de pantalla completa, y el estado de cada simulador se conserva.
  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[100] bg-bg flex flex-col overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-10"
          : "relative bg-surface rounded-2xl border border-line p-6 flex flex-col h-full shadow-lg transition-all duration-300"
      }
      style={isFullscreen ? { minHeight: "100dvh" } : undefined}
    >
      <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-line shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shrink-0"></span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-text truncate">
            {isFullscreen
              ? t("solutions.simulator.fullscreenTitle", "SIMULANDO EN PANTALLA COMPLETA")
              : title || defaultTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-mute shrink-0">
          <button
            type="button"
            onClick={resetSimulator}
            aria-label={resetLabel}
            className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
          >
            <i className="fas fa-rotate-right text-[10px]" aria-hidden="true" />
            <span className="hidden sm:inline" aria-hidden="true">
              {resetLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? exitFullscreenLabel : fullscreenLabel}
            className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
          >
            <i
              className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"} text-[10px]`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline" aria-hidden="true">
              {isFullscreen ? exitFullscreenLabel : fullscreenLabel}
            </span>
          </button>

          {onExit && (
            <button
              type="button"
              onClick={handleExit}
              aria-label={exitLabel}
              className="flex items-center gap-1.5 text-mute hover:text-red-400 transition-colors cursor-pointer pl-3 sm:pl-4 border-l border-line"
            >
              <i className="fas fa-xmark text-sm" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">
                {exitLabel}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0" key={resetKey}>
        {children}
      </div>
    </div>
  );
}

export default SimulatorShell;