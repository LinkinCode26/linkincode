import { useMemo, useState } from "react";
import useLanguage from "../hooks/useLanguage";
import useScrollReveal from "../hooks/useScrollReveal";
import useContact from "../hooks/useContact";
import { Input, Select, Textarea } from "../components/FormElements";
import { Button } from "../components/Button";
import { createLeadRequest } from "../services/authApi";
import {
  Check,
  CircleAlert,
  Globe,
  LoaderCircle,
  Mail,
  Send,
} from "lucide-react";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";

// Mismo orden que SERVICES (data/services.js)
const SERVICE_OPTION_INDEX = {
  landing: 0,
  ecommerce: 1,
  api: 2,
  dashboard: 3,
  stock: 4,
  staff: 5,
  billing: 6,
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phoneCode: "+54", // Por defecto Argentina
  phone: "",
  projectType: "",
  message: "",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limpiamos los labels para que solo sea Emoji + Número
// Nota: En Windows los emojis de banderas se ven como letras (ej: AR, MX),
// pero en celulares y Mac se ven las banderas dibujadas.
const PHONE_CODES = [
  { value: "+54", label: "🇦🇷 +54" },
  { value: "+34", label: "🇪🇸 +34" },
  { value: "+52", label: "🇲🇽 +52" },
  { value: "+56", label: "🇨🇱 +56" },
  { value: "+57", label: "🇨🇴 +57" },
  { value: "+51", label: "🇵🇪 +51" },
  { value: "+598", label: "🇺🇾 +598" },
  { value: "+595", label: "🇵🇾 +595" },
  { value: "+591", label: "🇧🇴 +591" },
  { value: "+593", label: "🇪🇨 +593" },
  { value: "+1", label: "🇺🇸/🇨🇦 +1" },
];

export function Contact() {
  const { t } = useLanguage();
  const { requestedService } = useContact();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [website, setWebsite] = useState("");

  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal({ delay: 0.05 });

  const projectTypeOptions = t("contact.form.projectTypeOptions");

  const options = useMemo(
    () => projectTypeOptions.map((label) => ({ value: label, label })),
    [projectTypeOptions],
  );

  const derivedProjectType = useMemo(() => {
    if (!requestedService?.id) return "";
    const index = SERVICE_OPTION_INDEX[requestedService.id];
    return index !== undefined
      ? projectTypeOptions[index]
      : requestedService.label;
  }, [requestedService, projectTypeOptions]);

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    // Si es el campo teléfono, permitimos solo números y espacios
    if (field === "phone") {
      value = value.replace(/[^\d\s-]/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError(null);
  };

  const effectiveProjectType = form.projectType || derivedProjectType;

  const isValid =
    form.name.trim().length > 0 &&
    EMAIL_RE.test(form.email.trim()) &&
    form.phone.trim().length >= 6 &&
    effectiveProjectType.trim().length > 0 &&
    form.message.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Unimos el código de país con el número para enviarlo al backend
    const fullPhone = `${form.phoneCode} ${form.phone.trim()}`;

    const payload = {
      nombre: form.name.trim(),
      email: form.email.trim(),
      telefono: fullPhone,
      tipoProyecto: effectiveProjectType.trim(),
      mensaje: form.message.trim(),
      origen: "Web LinkinCode",
      website: website.trim(),
    };

    try {
      await createLeadRequest(payload);

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setWebsite("");
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      setSubmitError(
        error?.status === 429
          ? error.message
          : "No pudimos enviar tu mensaje. Revisá los datos o intentá más tarde.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="py-24 sm:py-32 bg-surface/40 border-y border-line"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          ref={cardRef}
          className="bg-surface/70 backdrop-blur-md border border-line shadow-card rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[40%] h-full bg-brand/10 blur-[100px] -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div ref={headerRef}>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                {t("contact.eyebrow")}
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl my-6 text-ink leading-tight">
                {t("contact.titlePart1")}{" "}
                <span className="text-accent">
                  {t("contact.titleHighlight")}
                </span>
              </h2>
              <p className="text-lg text-mute mb-10">{t("contact.subtitle")}</p>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-brand">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">
                      {t("contact.emailLabel")}
                    </p>
                    <p className="text-ink font-medium">
                      contacto@linkincode.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-accent">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">
                      {t("contact.whatsappLabel")}
                    </p>
                    <p className="text-ink font-medium">+54 9 11 7144-9296</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-brand">
                    <Globe className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-mute">
                      {t("contact.scopeLabel")}
                    </p>
                    <p className="text-ink font-medium">
                      {t("contact.scopeValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Fila 1: Nombre */}
                  <Input
                    id="contact-name"
                    label={t("contact.form.nameLabel")}
                    placeholder={t("contact.form.namePlaceholder")}
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Fila 2: Email */}
                  <Input
                    id="contact-email"
                    type="email"
                    label={t("contact.form.emailLabel")}
                    placeholder={t("contact.form.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Fila 3: Teléfono Compuesto */}
                  <div className="flex gap-4">
                    <div className="w-[120px] shrink-0">
                      <Select
                        id="contact-phone-code"
                        label={t("contact.form.phoneCodeLabel")}
                        options={PHONE_CODES}
                        value={form.phoneCode}
                        onChange={handleChange("phoneCode")}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="contact-phone"
                        type="tel"
                        label={t("contact.form.phoneLabel")}
                        placeholder={t("contact.form.phonePlaceholder")}
                        value={form.phone}
                        onChange={handleChange("phone")}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Fila 4: Tipo de Proyecto */}
                  <Select
                    id="contact-project-type"
                    label={t("contact.form.projectTypeLabel")}
                    placeholder={t("contact.form.projectTypePlaceholder")}
                    options={options}
                    value={effectiveProjectType}
                    onChange={handleChange("projectType")}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Fila 5: Mensaje */}
                  <Textarea
                    id="contact-message"
                    label={t("contact.form.messageLabel")}
                    placeholder={t("contact.form.messagePlaceholder")}
                    rows={4}
                    value={form.message}
                    onChange={handleChange("message")}
                    required
                    disabled={isSubmitting}
                  />

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                      <CircleAlert
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <p>{submitError}</p>
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="website">No completar este campo</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex="-1"
                      autoComplete="off"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="brand"
                    disabled={!isValid || isSubmitting}
                    className="w-full justify-center disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        {t("contact.form.submit")}{" "}
                        <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-2xl mx-auto mb-5">
                    <Check className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink mb-2">
                    {t("contact.success.title")}
                  </h3>
                  <p className="text-mute">{t("contact.success.text")}</p>
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
