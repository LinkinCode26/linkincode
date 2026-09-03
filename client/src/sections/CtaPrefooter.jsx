import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';

export function CtaPrefooter() {
  const { t } = useLanguage();
  const revealRef = useScrollReveal();

  return (
    <section className="pb-24 pt-4">
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          ref={revealRef}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-accent p-10 sm:p-16 text-center"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              {t('ctaPrefooter.title')}
            </h3>
            <p className="text-white/85 max-w-xl mx-auto mb-8">
              {t('ctaPrefooter.subtitle')}
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl"
            >
              {t('ctaPrefooter.button')} <i className="fas fa-arrow-right text-sm" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaPrefooter;