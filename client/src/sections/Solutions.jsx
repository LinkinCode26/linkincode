import { useState, lazy, Suspense } from "react";
import { Loader2, Check, ArrowRight, ArrowLeft, Play } from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import useScrollReveal from "../hooks/useScrollReveal";
import useContact from "../hooks/useContact";
import { SERVICES } from "../data/services";
import { ACCENT_STYLES } from "../utils/accentStyles";
import { SimulatorShell } from "../components/SimulatorShell";

// Carga perezosa (Lazy Loading) de los simuladores para optimizar el bundle inicial
const EcommerceSimulatorContent = lazy(
  () => import("../components/EcommerceSimulatorContent"),
);
const DashboardSimulator = lazy(
  () => import("../components/DashboardSimulator"),
);
const FacturacionSimulatorContent = lazy(
  () => import("../components/FacturacionSimulatorContent"),
);
const StaffSimulatorContent = lazy(
  () => import("../components/StaffSimulatorContent"),
);
const LandingSimulatorContent = lazy(
  () => import("../components/LandingSimulatorContent"),
);
const StockSimulatorContent = lazy(
  () => import("../components/StockSimulatorContent"),
);
const ApiSimulatorContent = lazy(
  () => import("../components/ApiSimulatorContent"),
);

function SimulatorLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-mute min-h-[300px]">
      <Loader2 className="w-6 h-6 animate-spin text-brand" />
      <span className="text-xs font-bold uppercase tracking-wider">
        Cargando simulador...
      </span>
    </div>
  );
}

function DemoSimulatorContent({ content }) {
  const [simTitle, setSimTitle] = useState("");
  const [simColor, setSimColor] = useState("brand");

  return (
    <div className="flex flex-col gap-5 py-4">
      <div>
        <label
          htmlFor="sim-demo-title"
          className="block text-xs font-bold uppercase tracking-wider text-mute mb-2"
        >
          Título principal
        </label>
        <input
          id="sim-demo-title"
          type="text"
          value={simTitle}
          onChange={(e) => setSimTitle(e.target.value)}
          placeholder="Escribí tu propio título..."
          className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          Color de marca
        </span>
        <div className="flex gap-3">
          {["brand", "accent", "indigo", "emerald"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSimColor(c)}
              aria-label={c}
              aria-pressed={simColor === c}
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

  const scrollToRef = (ref, block) => {
    window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block });
    }, 520);
  };

  const enterSimulation = () => {
    setIsSimulating(true);
    scrollToRef(panelRef, "nearest");
  };

  const exitSimulation = () => {
    setIsSimulating(false);
    scrollToRef(tabsRef, "start");
  };

  const activeService =
    SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];
  const accent = ACCENT_STYLES[activeService.accent];
  const content = t(`solutions.services.${activeService.id}`);
  const ActiveIcon = activeService.icon;

  const handleRequestQuote = () => {
    requestQuote(activeService.id, t(`solutions.tabs.${activeService.id}`));
  };

  const handleTabChange = (id) => {
    setActiveId(id);
    setIsSimulating(false);
  };

  // Renderiza el simulador usando Suspense para soportar Lazy Loading
  const renderSimulatorContent = () => {
    let ComponentToRender;
    switch (activeService.id) {
      case "landing":
        ComponentToRender = <LandingSimulatorContent />;
        break;
      case "ecommerce":
        ComponentToRender = <EcommerceSimulatorContent />;
        break;
      case "dashboard":
        ComponentToRender = <DashboardSimulator />;
        break;
      case "stock":
        ComponentToRender = <StockSimulatorContent />;
        break;
      case "billing":
        ComponentToRender = <FacturacionSimulatorContent />;
        break;
      case "staff":
        ComponentToRender = <StaffSimulatorContent />;
        break;
      case "api":
        ComponentToRender = <ApiSimulatorContent />;
        break;
      default:
        ComponentToRender = <DemoSimulatorContent content={content} />;
        break;
    }

    return (
      <Suspense fallback={<SimulatorLoader />}>{ComponentToRender}</Suspense>
    );
  };

  return (
    <section
      id="soluciones"
      className="py-24 sm:py-32 bg-surface/40 border-y border-line"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent-text">
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
          className="scroll-mt-24 flex flex-wrap justify-center gap-2 mb-14 bg-bg border border-line rounded-2xl p-2 max-w-5xl mx-auto"
        >
          {SERVICES.map((service) => {
            const isActive = service.id === activeId;
            const TabIcon = service.icon;

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
                <TabIcon className="w-4 h-4 shrink-0" />
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
                      <Check className="w-4 h-4 text-accent shrink-0" />
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

                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-xl transition-all shadow-lg cursor-pointer ${accent.button}`}
                  >
                    {content.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div
              className={`transition-all duration-300 ease-in-out ${
                isSimulating ? "w-full" : ""
              }`}
            >
              {isSimulating && (
                <button
                  type="button"
                  onClick={exitSimulation}
                  className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {content.heading}
                </button>
              )}

              {!isSimulating ? (
                <div
                  className={`h-full rounded-2xl border-2 border-dashed ${accent.border} bg-surface/40 flex flex-col items-center justify-center text-center gap-4 p-8`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${accent.iconBg} flex items-center justify-center ${accent.text}`}
                  >
                    <ActiveIcon className="w-6 h-6" />
                  </div>

                  {(() => {
                    const hasRealSimulator = [
                      "dashboard",
                      "ecommerce",
                      "landing",
                      "stock",
                      "billing",
                      "staff",
                      "api",
                    ].includes(activeService.id);

                    if (hasRealSimulator) {
                      return (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-sm text-mute max-w-xs">
                            {t("solutions.simulatorReady.description") ??
                              "Explorá una demo interactiva de este servicio en tiempo real."}
                          </p>

                          <button
                            type="button"
                            onClick={enterSimulation}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-brand hover:opacity-90 transition-all cursor-pointer shadow-md"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            {t("solutions.simulator.simulateTrigger") ??
                              "Simulá tu servicio"}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-mute px-3 py-1 rounded-full bg-surface border border-line">
                          {t("solutions.comingSoon.badge") ?? "Próximamente"}
                        </span>
                        <p className="text-xs text-mute/80 max-w-xs">
                          {t("solutions.comingSoon.description") ??
                            "Estamos diseñando el simulador interactivo para este módulo."}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <SimulatorShell
                  title={content.heading}
                  accentColor={activeService.accent}
                  onExit={exitSimulation}
                >
                  {renderSimulatorContent()}
                </SimulatorShell>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solutions;
