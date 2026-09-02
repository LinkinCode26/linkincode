import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';
import { steps } from '../data/steps';
import  ProcesoStep  from '../components/ProcesoStep';

const Timeline = () => {
const { t } = useLanguage();
  const headerRef = useScrollReveal();
  const lineRef = useScrollReveal();

const stepsText = t('process.steps');


  return (
    <section id="proceso" className="py-24 sm:py-32 bg-surface/40 border-y border-line">
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
            {t('process.eyebrow')}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mt-4 text-ink">
            {t('process.title')}
          </h2>
        </div>

        <div className="proceso-timeline relative max-w-4xl mx-auto">
          <div ref={lineRef} className="proceso-line" aria-hidden="true">
            <span className="proceso-line-fill" />
          </div>

          {steps.map((step, index) => (
            <ProcesoStep
              key={step.number}
              step={step}
              title={stepsText[index]?.title}
              description={stepsText[index]?.description}
              isRight={index % 2 === 1}
              delay={0.05 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline