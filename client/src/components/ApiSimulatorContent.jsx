import { useState, useRef, useEffect } from "react";
import useLanguage from "../hooks/useLanguage";
import { apiEndpoints } from "../data/mock/apiEndpoints";

const METHOD_STYLES = {
  GET: "bg-brand/15 text-brand border-brand/30",
  POST: "bg-accent/15 text-accent border-accent/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

function statusColor(status) {
  if (status >= 200 && status < 300) return "text-emerald-400";
  if (status >= 400 && status < 500) return "text-amber-400";
  if (status >= 500) return "text-red-400";
  return "text-mute";
}

export const ApiSimulatorContent = () => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState(apiEndpoints[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const timeoutRef = useRef(null);

  // Limpieza del temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const selectedEndpoint = apiEndpoints.find((e) => e.id === selectedId);

  const handleSend = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoading(true);
    setResult(null);

    // Piso mínimo de 450ms para percibir la animación de carga
    const fakeDelay = Math.max(selectedEndpoint.responseTimeMs * 4, 450);

    timeoutRef.current = setTimeout(() => {
      setResult(selectedEndpoint);
      setLoading(false);
    }, fakeDelay);
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          {t("solutions.simulator.api.chooseEndpoint")}
        </label>
        <div className="flex flex-col gap-2">
          {apiEndpoints.map((endpoint) => {
            const isActive = endpoint.id === selectedId;
            const methodClass =
              METHOD_STYLES[endpoint.method] ?? "bg-surface text-mute border-line";
            return (
              <button
                key={endpoint.id}
                type="button"
                onClick={() => {
                  setSelectedId(endpoint.id);
                  setResult(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  isActive
                    ? "border-brand bg-surface"
                    : "border-line bg-surface/40 hover:border-brand/40"
                }`}
              >
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${methodClass}`}>
                  {endpoint.method}
                </span>
                <span className="text-sm text-ink font-medium">{endpoint.path}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-brand hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
      >
        <i className="fas fa-paper-plane" aria-hidden="true" />
        {loading ? t("solutions.simulator.api.sending") : t("solutions.simulator.api.send")}
      </button>

      <div className="rounded-xl border border-line bg-surface/60 p-4 min-h-[220px]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full py-10 gap-3 text-mute">
            <i className="fas fa-circle-notch fa-spin text-xl" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wider font-bold">
              {t("solutions.simulator.api.waiting")}
            </span>
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-mute text-sm text-center">
            {t("solutions.simulator.api.placeholder")}
          </div>
        )}

        {!loading && result && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-sm font-bold ${statusColor(result.status)}`}>
                Status: {result.status}
              </span>
              <span className="text-xs text-mute">{result.responseTimeMs} ms</span>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-mute mb-1">
                {t("solutions.simulator.api.headers")}
              </p>
              <pre className="text-xs bg-bg border border-line rounded-lg p-3 overflow-x-auto text-mute">
{Object.entries(result.headers ?? {})
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}
              </pre>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-mute mb-1">
                {t("solutions.simulator.api.body")}
              </p>
              <pre className="text-xs bg-bg border border-line rounded-lg p-3 overflow-x-auto text-ink">
{JSON.stringify(result.responseBody, null, 2)}
              </pre>
            </div>

            <p className="text-[11px] text-mute italic mt-1">
              {t("solutions.simulator.api.disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiSimulatorContent;