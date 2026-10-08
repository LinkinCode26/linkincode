import useScrollReveal from "../hooks/useScrollReveal";
import { COLOR_CLASSES } from "../data/steps";

const ProcesoStep = ({ step, title, description, isRight, delay }) => {
  const stepRef = useScrollReveal({ delay });
  const colors = COLOR_CLASSES[step.color];
  const StepIcon = step.icon; // Lucide component

  return (
    <div className={`proceso-step ${isRight ? "proceso-step-right" : ""}`}>
      <div className="proceso-step-inner" ref={stepRef}>
        <div className={`proceso-dot ${colors.dot} text-white`}>
          {step.number}
        </div>
        <div className="proceso-card p-6 sm:p-7 rounded-2xl border border-line bg-bg shadow-card">
          <div
            className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconText} mb-4`}
          >
            <StepIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-ink mb-2">{title}</h3>
          <p className="text-sm text-mute leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcesoStep;
