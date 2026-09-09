import { useState } from "react";
import useLanguage from "../hooks/useLanguage";
import useScrollReveal from "../hooks/useScrollReveal";
import useContact from "../hooks/useContact";
import { SERVICES } from "../data/services";
import { ACCENT_STYLES } from "../utils/accentStyles";
import { SimulatorShell } from "../components/SimulatorShell";
import { EcommerceSimulatorContent } from "../components/EcommerceSimulatorContent";
import { DashboardSimulator } from "../components/DashboardSimulator";
import { StaffSimulatorContent } from "../components/StaffSimulatorContent";

function DemoSimulatorContent({ content }) {
  const [simTitle, setSimTitle] = useState("");
  const [simColor, setSimColor] = useState("brand");

  return (
    <div className="flex flex-col gap-5 py-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          Título principal
        </label>
        <input
          type="text"
          value={simTitle}
          onChange={(e) => setSimTitle(e.target.value)}
          placeholder="Escribí tu propio título..."
          className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          Color de marca
        </label>
        <div className="flex gap-3">
          {["brand", "accent", "indigo", "emerald"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSimColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                simColor === c
                  ? "scale-110 border-white shadow-lg"
                  : "border-transparent opacity-70"
              } bg-brand`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 p-4 rounded-xl bg-surface/60 border border-line text-center">
        <p className="text-xs text-mute italic">
          Vista previa activa para:{" "}
          <span className="font-bold text-ink">{content.heading}</span>
        </p>
        <h4 className="font-display font-bold text-xl mt-2 text-ink">
          {simTitle || "Impulsá tu negocio online"}
        </h4>
      </div>
    </div>
  );
}

export function Solutions() {
  const { t } = useLanguage();
  const { requestQuote } = useContact();
  const [activeId, setActiveId] = useState(SERVICES[0].id);

  // Estado para saber si el usuario hizo clic en "Simulá tu servicio"
  const [isSimulating, setIsSimulating] = useState(false);

  const headerRef = useScrollReveal();
  const tabsRef = useScrollReveal({ delay: 0.05 });
  const panelRef = useScrollReveal({ delay: 0.1 });

  const activeService =
    SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];
  const accent = ACCENT_STYLES[activeService.accent];
  const content = t(`solutions.services.${activeService.id}`);

  const handleRequestQuote = () => {
    requestQuote(activeService.id, t(`solutions.tabs.${activeService.id}`));
  };

  // Cada vez que cambia de tab, reseteamos la vista de simulación
  const handleTabChange = (id) => {
    setActiveId(id);
    setIsSimulating(false);
  };

  // Función para renderizar el simulador correspondiente según la tab activa
  const renderSimulatorContent = () => {
    switch (activeService.id) {
      case "ecommerce":
        return <EcommerceSimulatorContent />;
      case "dashboard":
        return <DashboardSimulator />;
      case "staff":
        return <StaffSimulatorContent />;  
      default:
        return <DemoSimulatorContent content={content} />;
    }
  };

  return (
    <section
      id="soluciones"
      className="py-24 sm:py-32 bg-surface/40 border-y border-line"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
            {t("solutions.eyebrow")}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-4 mb-6 text-ink">
            {t("solutions.title")}
          </h2>
          <p className="text-lg text-mute leading-relaxed">
            {t("solutions.subtitle")}
          </p>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t("solutions.title")}
          className="flex flex-wrap justify-center gap-2 mb-14 bg-bg border border-line rounded-2xl p-2 max-w-5xl mx-auto"
        >
          {SERVICES.map((service) => {
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                type="button"
                id={`tab-${service.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${service.id}`}
                onClick={() => handleTabChange(service.id)}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border transition-colors duration-300
                  w-[calc((100%-8px)/2)] 
                  sm:w-[calc((100%-16px)/3)] 
                  lg:w-[calc((100%-24px)/4)]
                  ${
                    isActive
                      ? "bg-surface border-brand text-brand shadow-lg shadow-brand/15"
                      : "bg-surface/50 border-line text-mute hover:text-ink hover:border-brand/40"
                  }`}
              >
                <i
                  className={`fas ${service.icon} shrink-0`}
                  aria-hidden="true"
                />
                <span className="font-bold text-sm text-center leading-snug">
                  {t(`solutions.tabs.${service.id}`)}
                </span>
              </button>
            );
          })}
        </div>

        <div
          ref={panelRef}
          id={`panel-${activeService.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeService.id}`}
          className="bg-bg rounded-[2.5rem] border border-line p-7 sm:p-12 shadow-2xl"
        >
          <div
            className={`grid gap-8 lg:gap-12 items-stretch transition-[grid-template-columns] duration-500 ease-in-out ${
              isSimulating ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {/* Columna de texto: se oculta por completo mientras se simula */}
            {!isSimulating && (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-mute">
                    {content.badge}
                  </span>
                </div>
                <h3
                  className={`font-display font-bold text-3xl mb-4 ${accent.text}`}
                >
                  {content.heading}
                </h3>
                <p className="text-mute mb-6 leading-relaxed">
                  {content.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {content.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 items-center text-sm text-ink"
                    >
                      <i
                        className="fas fa-check text-accent"
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeService.tech.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-surface border border-line text-mute"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA empujado al fondo de la columna con mt-auto */}
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-xl transition-all shadow-lg ${accent.button}`}
                  >
                    {content.cta}{" "}
                    <i
                      className="fas fa-arrow-right text-xs"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Columna / bloque del simulador: ocupa todo el ancho al simular */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isSimulating ? "w-full" : ""
              }`}
            >
              {isSimulating && (
                <button
                  type="button"
                  onClick={() => setIsSimulating(false)}
                  className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors"
                >
                  <i
                    className="fas fa-arrow-left text-[10px]"
                    aria-hidden="true"
                  />
                  {content.heading}
                </button>
              )}

              {!isSimulating ? (
                <div
                  className={`h-full rounded-2xl border-2 border-dashed ${accent.border} bg-surface/40 flex flex-col items-center justify-center text-center gap-4 p-8`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${accent.iconBg} flex items-center justify-center ${accent.text} text-2xl`}
                  >
                    <i
                      className={`fas ${activeService.icon}`}
                      aria-hidden="true"
                    />
                  </div>
                  {(() => {
                    // Validamos si el servicio actual tiene un simulador real asignado
                    const hasRealSimulator =
                      activeService.id === "dashboard" ||
                      activeService.id === "ecommerce";
                      activeService.id === "staff";
                    const placeholder = hasRealSimulator
                      ? "solutions.simulatorReady"
                      : "solutions.comingSoon";
                    return (
                      <>
                        <p className="font-display font-bold text-lg text-ink mb-1">
                          {t(`${placeholder}.title`)}
                        </p>
                        <p className="text-sm text-mute max-w-65 mx-auto mb-2">
                          {t(`${placeholder}.description`)}
                        </p>
                      </>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => setIsSimulating(true)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all ${accent.button}`}
                  >
                    <i className="fas fa-wand-magic-sparkles" />{" "}
                    {t("solutions.simulator.simulateTrigger")}
                  </button>
                </div>
              ) : (
                <SimulatorShell onExit={() => setIsSimulating(false)}>
                  {renderSimulatorContent()}
                </SimulatorShell>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-mute mb-6">{t("solutions.moreCta.text")}</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface border border-line hover:border-brand text-ink font-bold rounded-2xl transition-all"
          >
            <i className="fas fa-comments text-accent" aria-hidden="true" />{" "}
            {t("solutions.moreCta.button")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Solutions;
