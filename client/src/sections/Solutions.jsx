import { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';
import useContact from '../hooks/useContact';
import { SERVICES } from '../data/services';
import { ACCENT_STYLES } from '../utils/accentStyles';
import { SimulatorPlaceholder } from '../components/SimulatorPlaceholder';

export function Solutions() {
  const { t } = useLanguage();
  const { requestQuote } = useContact();
  const [activeId, setActiveId] = useState(SERVICES[0].id);

  const headerRef = useScrollReveal();
  const tabsRef = useScrollReveal({ delay: 0.05 });
  const panelRef = useScrollReveal({ delay: 0.1 });

  const activeService = SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];
  const accent = ACCENT_STYLES[activeService.accent];
  const content = t(`solutions.services.${activeService.id}`);

  const handleRequestQuote = () => {
    requestQuote(activeService.id, t(`solutions.tabs.${activeService.id}`));
  };

  return (
    <section id="soluciones" className="py-24 sm:py-32 bg-surface/40 border-y border-line">
      <div className="container mx-auto px-6 max-w-7xl">

        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
            {t('solutions.eyebrow')}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-4 mb-6 text-ink">
            {t('solutions.title')}
          </h2>
          <p className="text-lg text-mute leading-relaxed">{t('solutions.subtitle')}</p>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t('solutions.title')}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-14 bg-bg border border-line rounded-2xl p-2 max-w-5xl mx-auto"
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
                onClick={() => setActiveId(service.id)}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border transition-colors duration-300 ${
                  isActive
                    ? 'bg-surface border-brand text-brand shadow-lg shadow-brand/15'
                    : 'bg-surface/50 border-line text-mute hover:text-ink hover:border-brand/40'
                }`}
              >
                <i className={`fas ${service.icon}`} aria-hidden="true" />
                <span className="font-bold text-sm">{t(`solutions.tabs.${service.id}`)}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-mute">
                  {content.badge}
                </span>
              </div>
              <h3 className={`font-display font-bold text-3xl mb-4 ${accent.text}`}>
                {content.heading}
              </h3>
              <p className="text-mute mb-6 leading-relaxed">{content.description}</p>

              <ul className="space-y-3 mb-6">
                {content.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 items-center text-sm text-ink">
                    <i className="fas fa-check text-accent" aria-hidden="true" />
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

              <button
                type="button"
                onClick={handleRequestQuote}
                className={`inline-flex items-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-xl transition-all shadow-lg ${accent.button}`}
              >
                {content.cta} <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
              </button>
            </div>

            <SimulatorPlaceholder service={activeService} />
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-mute mb-6">{t('solutions.moreCta.text')}</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface border border-line hover:border-brand text-ink font-bold rounded-2xl transition-all"
          >
            <i className="fas fa-comments text-accent" aria-hidden="true" /> {t('solutions.moreCta.button')}
          </a>
        </div>

      </div>
    </section>
  );
}

export default Solutions;