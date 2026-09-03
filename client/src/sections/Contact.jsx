import { useMemo, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import useScrollReveal from '../hooks/useScrollReveal';
import useContact from '../hooks/useContact';
import { Input, Select, Textarea } from '../components/FormElements';
import { Button } from '../components/Button';

// Mismo orden que SERVICES (data/services.js) y que las primeras 7
// entradas de contact.form.projectTypeOptions en translations.js.
// Mapeamos por id (no por label) porque las tabs de Soluciones y las
// opciones del <select> no siempre coinciden textualmente
// (ej. "APIs & Backends" vs "APIs REST y Backends").
const SERVICE_OPTION_INDEX = {
  landing: 0,
  ecommerce: 1,
  api: 2,
  dashboard: 3,
  stock: 4,
  staff: 5,
  billing: 6,
};

const EMPTY_FORM = { name: '', email: '', projectType: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { t } = useLanguage();
  const { requestedService } = useContact();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal({ delay: 0.05 });

  const projectTypeOptions = t('contact.form.projectTypeOptions');
  
  const options = useMemo(
    () => projectTypeOptions.map((label) => ({ value: label, label })),
    [projectTypeOptions]
  );

  // Deriva el valor del projectType directamente sin necesidad de useEffect
  const derivedProjectType = useMemo(() => {
    if (!requestedService?.id) return '';
    const index = SERVICE_OPTION_INDEX[requestedService.id];
    return index !== undefined ? projectTypeOptions[index] : requestedService.label;
  }, [requestedService, projectTypeOptions]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Usa el valor derivado si el usuario no ha cambiado manualmente el campo
  const effectiveProjectType = form.projectType || derivedProjectType;

  const isValid =
    form.name.trim().length > 0 &&
    EMAIL_RE.test(form.email.trim()) &&
    effectiveProjectType.trim().length > 0 &&
    form.message.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    // TODO: conectar con POST /api/contact cuando el backend esté listo.
    setSubmitted(true);
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contacto" className="py-24 sm:py-32 bg-surface/40 border-y border-line">
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          ref={cardRef}
          className="bg-surface/70 backdrop-blur-md border border-line shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[40%] h-full bg-brand/10 blur-[100px] -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div ref={headerRef}>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                {t('contact.eyebrow')}
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl my-6 text-ink leading-tight">
                {t('contact.titlePart1')} <span className="text-accent">{t('contact.titleHighlight')}</span>
              </h2>
              <p className="text-lg text-mute mb-10">{t('contact.subtitle')}</p>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-brand">
                    <i className="fas fa-envelope text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">{t('contact.emailLabel')}</p>
                    <p className="text-ink font-medium">hola@linkincode.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-accent">
                    <i className="fab fa-whatsapp text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">{t('contact.whatsappLabel')}</p>
                    <p className="text-ink font-medium">+54 9 11 0000-0000</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-brand">
                    <i className="fas fa-globe text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">{t('contact.scopeLabel')}</p>
                    <p className="text-ink font-medium">{t('contact.scopeValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('contact.form.nameLabel')}
                      placeholder={t('contact.form.namePlaceholder')}
                      value={form.name}
                      onChange={handleChange('name')}
                      required
                    />
                    <Input
                      type="email"
                      label={t('contact.form.emailLabel')}
                      placeholder={t('contact.form.emailPlaceholder')}
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </div>

                  <Select
                    label={t('contact.form.projectTypeLabel')}
                    placeholder={t('contact.form.projectTypePlaceholder')}
                    options={options}
                    value={effectiveProjectType}
                    onChange={handleChange('projectType')}
                    required
                  />

                  <Textarea
                    label={t('contact.form.messageLabel')}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={4}
                    value={form.message}
                    onChange={handleChange('message')}
                    required
                  />

                  <Button
                    type="submit"
                    variant="brand"
                    disabled={!isValid}
                    className="w-full justify-center disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {t('contact.form.submit')} <i className="fas fa-paper-plane text-sm" aria-hidden="true" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-2xl mx-auto mb-5">
                    <i className="fas fa-check" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink mb-2">{t('contact.success.title')}</h3>
                  <p className="text-mute">{t('contact.success.text')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;