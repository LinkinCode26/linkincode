import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';
import TechMarquee from '../components/TechMarquee';

export const TechStack = () => {
  const { t } = useLanguage();
  const headerRef = useScrollReveal();

  return (
    <section id="tecnologias" className="py-24 sm:py-32 bg-surface/40 border-y border-line overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
            {t('tech.eyebrow')}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-4 mb-4 text-ink">
            {t('tech.title')}
          </h2>
          <p className="text-mute">{t('tech.subtitle')}</p>
        </div>
      </div>

      <TechMarquee />
    </section>
  );
};

export default TechStack;