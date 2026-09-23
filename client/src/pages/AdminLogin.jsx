import { useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import { Button } from "../components/Button";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeToggle from "../components/ThemeToggle";
import { AuthField } from "../components/admin/AuthField";
import { FullScreenLoader } from "../components/admin/FullScreenLoader";
import logoImg from "../assets/logo.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vuelve a la página que el usuario intentó abrir antes del login. Solo se
// aceptan rutas internas del admin (evita redirecciones a otros lugares).
function getRedirectTarget(locationState) {
  const from = locationState?.from?.pathname;
  if (from && from.startsWith("/admin") && from !== "/admin/login") return from;
  return "/admin";
}

function getErrorMessage(error, t) {
  if (error?.status === 401) return t("admin.login.errors.invalid");
  if (error?.status === 429) return t("admin.login.errors.tooMany");
  if (error?.status === 0) return t("admin.login.errors.network");
  return t("admin.login.errors.generic");
}

export default function AdminLogin() {
  const { t } = useLanguage();
  const { status, login, sessionExpired } = useAuth();
  const location = useLocation();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Con token guardado se verifica antes de decidir; si ya hay sesión, no
  // tiene sentido mostrar el login.
  if (status === "checking") return <FullScreenLoader />;
  if (status === "authenticated") {
    return <Navigate to={getRedirectTarget(location.state)} replace />;
  }

  const validate = () => {
    const errors = {};
    const email = form.email.trim();
    if (!email) errors.email = t("admin.login.validation.emailRequired");
    else if (!EMAIL_RE.test(email))
      errors.email = t("admin.login.validation.emailInvalid");
    if (!form.password)
      errors.password = t("admin.login.validation.passwordRequired");
    return errors;
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const errors = validate();
    setFieldErrors(errors);
    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    setLoading(true);
    setFormError("");

    try {
      // Si sale bien, el estado pasa a "authenticated" y este componente
      // redirige solo (ver el <Navigate> de arriba).
      await login(form.email.trim(), form.password);
    } catch (error) {
      setFormError(getErrorMessage(error, t));
      setForm((prev) => ({ ...prev, password: "" }));
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg text-ink font-sans lg:grid lg:h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Panel lateral: solo desktop, decorativo (sin elementos enfocables) */}
      <aside
        aria-hidden="true"
        className="relative isolate hidden lg:flex flex-col justify-center overflow-hidden border-r border-line bg-surface/40 p-12 xl:p-16"
      >
        <div className="absolute -top-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-brand/15 blur-[110px]" />
        <div className="absolute -bottom-32 -right-24 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-[100px]" />

        <img
          src={logoImg}
          alt=""
          className="absolute left-12 top-12 h-14 w-auto xl:left-16 xl:top-16"
        />

        <div className="relative max-w-md">
          <p className="font-display font-bold text-3xl xl:text-4xl leading-tight tracking-tight text-ink">
            {t("admin.login.showcase.title")}
          </p>
          <p className="mt-4 leading-relaxed text-mute">
            {t("admin.login.showcase.text")}
          </p>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col px-5 py-5 sm:px-10 sm:py-6 lg:min-h-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-mute transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <i className="fas fa-arrow-left text-xs" aria-hidden="true" />
            {t("admin.login.backToSite")}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageDropdown />
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <img src={logoImg} alt="Linkincode" className="mb-8 h-12 w-auto lg:hidden" />

          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("admin.login.title")}
          </h1>
          <p className="mt-3 leading-relaxed text-mute">
            {t("admin.login.subtitle")}
          </p>

          {sessionExpired && !formError && (
            <div
              role="status"
              className="mt-6 flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400 [[data-theme=light]_&]:text-amber-800"
            >
              <i className="fas fa-clock mt-0.5" aria-hidden="true" />
              <span>{t("admin.login.sessionExpired")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {formError && (
              <div
                role="alert"
                className="flex gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 [[data-theme=light]_&]:text-red-700"
              >
                <i className="fas fa-circle-exclamation mt-0.5" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <AuthField
              ref={emailRef}
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              label={t("admin.login.emailLabel")}
              placeholder={t("admin.login.emailPlaceholder")}
              value={form.email}
              onChange={handleChange("email")}
              error={fieldErrors.email}
            />

            <AuthField
              ref={passwordRef}
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              label={t("admin.login.passwordLabel")}
              value={form.password}
              onChange={handleChange("password")}
              error={fieldErrors.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? t("admin.login.hidePassword")
                      : t("admin.login.showPassword")
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-mute transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    aria-hidden="true"
                  />
                </button>
              }
            />

            {/* aria-disabled (y no disabled) para no perder el foco al enviar */}
            <Button
              type="submit"
              aria-disabled={loading}
              className="w-full aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
            >
              {loading && (
                <i className="fas fa-circle-notch fa-spin" aria-hidden="true" />
              )}
              {loading ? t("admin.login.submitting") : t("admin.login.submit")}
            </Button>
          </form>

          <p className="mt-6 flex items-center gap-2 text-xs text-mute">
            <i className="fas fa-lock" aria-hidden="true" />
            {t("admin.login.restricted")}
          </p>
        </div>
      </main>
    </div>
  );
}