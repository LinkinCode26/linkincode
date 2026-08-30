import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { TEAM, avatarSrc } from '../data/team';
import heroImage from '../assets/hero.png';

// El boceto resalta en negrita la primera parte de "4 amigos, un mismo
// objetivo..." (antes de la coma). Como la traducción viene como un solo
// string, separamos ahí para conservar el mismo énfasis visual en ambos
// idiomas.
function splitCaption(caption) {
  const commaIndex = caption.indexOf(',');
  if (commaIndex === -1) return [caption, ''];
  return [caption.slice(0, commaIndex), caption.slice(commaIndex)];
}

export function Hero() {
  const { t } = useLanguage();
  const textRef = useScrollReveal();
  const mockupRef = useScrollReveal({ delay: 0.15 });

  const [boldCaption, restCaption] = splitCaption(t('hero.teamCaption'));

  return (
    <section id="inicio" className="relative pt-40 sm:pt-48 pb-24 sm:pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[55%] h-[70%] bg-brand/10 blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-accent/10 blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div ref={textRef}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface border border-line mb-8">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="font-display font-bold text-huge text-ink mb-7">
              {t('hero.titlePart1')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">
                {t('hero.titleHighlight')}
              </span>{' '}
              {t('hero.titlePart2')}
            </h1>

            <p className="text-lg sm:text-xl text-mute max-w-xl leading-relaxed mb-10">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 mb-12">
              <Button
                href="#soluciones"
                variant="brand"
                size="large"
                className="shadow-xl shadow-brand/30"
              >
                {t('hero.ctaPrimary')} <i className="fas fa-arrow-right text-sm" aria-hidden="true" />
              </Button>

              <a
                href="#contacto"
                className="flex items-center gap-3 px-6 py-4 sm:py-5 rounded-2xl border border-line bg-surface/70 backdrop-blur-md hover:border-brand/50 transition-all"
              >
                <i className="fas fa-shield-halved text-accent text-xl" aria-hidden="true" />
                <span className="text-sm font-medium text-mute">{t('hero.ctaSecondary')}</span>
              </a>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {TEAM.map((member) => (
                  <img
                    key={member.name}
                    className="w-10 h-10 rounded-full border-2 border-bg"
                    src={avatarSrc(member)}
                    alt={member.name}
                  />
                ))}
              </div>
              <p className="text-sm text-mute">
                <span className="text-ink font-bold">{boldCaption}</span>
                {restCaption}
              </p>
            </div>
          </div>

          <div ref={mockupRef} className="relative hidden lg:block">
            <div className="browser-frame rounded-2xl overflow-hidden border border-line bg-surface animate-float">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-line bg-bg/40">
                <span className="w-[11px] h-[11px] rounded-full bg-red-400/70" />
                <span className="w-[11px] h-[11px] rounded-full bg-yellow-400/70" />
                <span className="w-[11px] h-[11px] rounded-full bg-green-400/70" />
                <div className="ml-4 flex-1 bg-bg/60 border border-line rounded-lg px-3 py-1.5 text-[11px] text-mute font-mono flex items-center gap-2">
                  <i className="fas fa-lock text-[9px]" aria-hidden="true" /> {t('hero.browserUrl')}
                </div>
              </div>
              <img className="w-full h-[380px] object-cover" src={heroImage} alt="Panel de control de Linkincode" />
            </div>

            <GlassCard className="absolute -bottom-8 -left-8 p-5 flex items-center gap-4 z-10">
              <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <i className="fas fa-bolt" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm text-ink">{t('hero.deliveryTitle')}</p>
                <p className="text-xs text-mute">{t('hero.deliverySubtitle')}</p>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;