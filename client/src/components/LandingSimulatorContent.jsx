import { useState } from "react";
import useLanguage from "../hooks/useLanguage";

const BRAND_COLOR_OPTIONS = [
  {
    id: "brand",
    dotClass: "bg-brand",
    textClass: "text-brand",
    buttonClass: "bg-brand hover:bg-brand/90",
  },
  {
    id: "accent",
    dotClass: "bg-accent",
    textClass: "text-accent",
    buttonClass: "bg-accent hover:bg-accent/90",
  },
  {
    id: "amber",
    dotClass: "bg-amber-500",
    textClass: "text-amber-500",
    buttonClass: "bg-amber-500 hover:bg-amber-500/90",
  },
  {
    id: "pink",
    dotClass: "bg-pink-500",
    textClass: "text-pink-500",
    buttonClass: "bg-pink-500 hover:bg-pink-500/90",
  },
  {
    id: "emerald",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-500",
    buttonClass: "bg-emerald-500 hover:bg-emerald-500/90",
  },
];

const BACKGROUND_COLOR_OPTIONS = [
  { id: "default", dotClass: "bg-surface", bgClass: "bg-surface/60" },
  { id: "dark", dotClass: "bg-bg", bgClass: "bg-bg" },
  { id: "brand-tint", dotClass: "bg-brand", bgClass: "bg-brand/10" },
  { id: "accent-tint", dotClass: "bg-accent", bgClass: "bg-accent/10" },
  { id: "amber-tint", dotClass: "bg-amber-500", bgClass: "bg-amber-500/10" },
];

export function LandingSimulatorContent() {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [brandColorId, setBrandColorId] = useState("brand");
  const [bgColorId, setBgColorId] = useState("default");

  const selectedBrandColor =
    BRAND_COLOR_OPTIONS.find((option) => option.id === brandColorId) ??
    BRAND_COLOR_OPTIONS[0];
  const selectedBgColor =
    BACKGROUND_COLOR_OPTIONS.find((option) => option.id === bgColorId) ??
    BACKGROUND_COLOR_OPTIONS[0];

  const previewTitle =
    title.trim() || t("solutions.simulator.simulateHeadlineDefault");
  const previewSubtitle =
    subtitle.trim() || t("solutions.simulator.simulateDescription");
  const previewCta = ctaText.trim() || t("solutions.simulator.simulateButton");

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 py-2">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            {t("solutions.simulator.inputLabel")}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("solutions.simulator.inputPlaceholder")}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            {t("solutions.simulator.subtitleLabel")}
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder={t("solutions.simulator.subtitlePlaceholder")}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            {t("solutions.simulator.ctaLabel")}
          </label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder={t("solutions.simulator.ctaPlaceholder")}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            {t("solutions.simulator.colorLabel")}
          </label>
          <div className="flex gap-3">
            {BRAND_COLOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBrandColorId(option.id)}
                aria-label={option.id}
                className={`w-8 h-8 rounded-full ${option.dotClass} border-2 transition-transform ${
                  brandColorId === option.id
                    ? "scale-110 border-white shadow-lg"
                    : "border-transparent opacity-60"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            {t("solutions.simulator.bgColorLabel")}
          </label>
          <div className="flex gap-3">
            {BACKGROUND_COLOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBgColorId(option.id)}
                aria-label={option.id}
                className={`w-8 h-8 rounded-full ${option.dotClass} border-2 transition-transform ${
                  bgColorId === option.id
                    ? "scale-110 border-white shadow-lg"
                    : "border-line opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 lg:sticky lg:top-24 flex flex-col">
        <div
          className={`flex-1 p-6 justify-center rounded-xl ${selectedBgColor.bgClass} border border-line text-center flex flex-col items-center gap-3 transition-colors duration-300`}
        >
          <p className="text-xs text-mute">
            {t("solutions.simulator.previewLabel")}
          </p>
          <h4
            className={`font-display font-bold text-2xl ${selectedBrandColor.textClass}`}
          >
            {previewTitle}
          </h4>
          <p className="text-sm text-mute max-w-md">{previewSubtitle}</p>
          <button
            type="button"
            className={`mt-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-colors ${selectedBrandColor.buttonClass}`}
          >
            {previewCta}
          </button>
        </div>

        <p className="text-[11px] text-mute/70 text-center">
          {t("solutions.simulator.disclaimer")}
        </p>
      </div>
    </div>
  );
}

export default LandingSimulatorContent;
