import useLanguage from '../hooks/useLanguage';
import { ACCENT_STYLES } from '../utils/accentStyles';

export function SimulatorPlaceholder({ service }) {
  const { t } = useLanguage();
  const accent = ACCENT_STYLES[service.accent] ?? ACCENT_STYLES.brand;

  return (
    <div
      className={`rounded-2xl border-2 border-dashed ${accent.border} bg-surface/40 flex flex-col items-center justify-center text-center gap-4 px-8 py-16 min-h-[320px]`}
    >
      <div className={`w-14 h-14 rounded-2xl ${accent.iconBg} flex items-center justify-center ${accent.text} text-2xl`}>
        <i className={`fas ${service.icon}`} aria-hidden="true" />
      </div>
      <div>
        <p className="font-display font-bold text-lg text-ink mb-1">
          {t('solutions.comingSoon.title')}
        </p>
        <p className="text-sm text-mute max-w-[260px] mx-auto">
          {t('solutions.comingSoon.description')}
        </p>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${accent.border} ${accent.text}`}
      >
        {t('solutions.comingSoon.badge')}
      </span>
    </div>
  );
}

export default SimulatorPlaceholder;