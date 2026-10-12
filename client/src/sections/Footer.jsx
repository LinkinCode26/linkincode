import { useState, useEffect } from "react";
import {
  ChevronRight,
  Mail,
  MapPin,
  ArrowUp,
  Globe,
  Store,
  Code,
  PieChart,
  Wand2,
} from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";

const SITE_HREFS = [
  "#inicio",
  "#soluciones",
  "#proceso",
  "#nosotros",
  "#tecnologias",
];
const SERVICE_HREFS = [
  "#soluciones",
  "#soluciones",
  "#soluciones",
  "#soluciones",
  "#contacto",
];
const SERVICE_ICONS = [Globe, Store, Code, PieChart, Wand2];

// Íconos sociales SVG livianos e integrados directamente
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.49 1.49 0 0 0-1.49 1.49c0 .82.67 1.49 1.49 1.49a1.49 1.49 0 0 0 1.49-1.49c0-.82-.67-1.49-1.49-1.49z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const siteLinks = t("footer.columns.site.links");
  const serviceLinks = t("footer.columns.services.links");
  const legalLinks = t("footer.legalLinks");

  return (
    <>
      <footer className="relative pt-20 pb-8 bg-bg border-t border-line overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 blur-[100px] -z-10"></div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-line">
            <div className="lg:col-span-4">
              <a href="/#" className="flex items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-ink tracking-tight">
                  Linkincode
                </h2>
              </a>
              <p className="text-mute leading-relaxed mb-6 max-w-sm">
                {t("footer.description")}
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface border border-line mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent-text">
                  {t("footer.availability")}
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href="/#"
                  aria-label="GitHub"
                  className="w-11 h-11 rounded-xl bg-surface border border-line-strong flex items-center justify-center text-mute hover:text-white hover:bg-[#484f58] hover:border-[#484f58] [[data-theme=light]_&]:hover:bg-[#24292f] [[data-theme=light]_&]:hover:border-[#24292f] transition-all"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="/#"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-xl bg-surface border border-line-strong flex items-center justify-center text-mute hover:text-white hover:bg-brand hover:border-brand transition-all"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/5491100000000"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("common.contactWhatsapp")}
                  className="w-11 h-11 rounded-xl bg-surface border border-line-strong flex items-center justify-center text-mute hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
                <a
                  href="/#"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-xl bg-surface border border-line-strong flex items-center justify-center text-mute hover:text-white hover:bg-pink-500 hover:border-pink-500 transition-all"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                {t("footer.columns.site.title")}
              </h3>
              <ul className="space-y-4 text-sm text-mute">
                {siteLinks.map((label, i) => (
                  <li key={label}>
                    <a
                      href={SITE_HREFS[i]}
                      className="hover:text-brand transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3 text-accent" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                {t("footer.columns.services.title")}
              </h3>
              <ul className="space-y-4 text-sm text-mute">
                {serviceLinks.map((label, i) => {
                  const ServiceIcon = SERVICE_ICONS[i];
                  return (
                    <li key={label}>
                      <a
                        href={SERVICE_HREFS[i]}
                        className="hover:text-brand transition-colors flex items-center gap-2"
                      >
                        <ServiceIcon className="w-3.5 h-3.5 text-accent" />{" "}
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                {t("footer.columns.contact.title")}
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="mailto:hola@linkincode.dev"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-accent" />{" "}
                    linkincode26@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5491100000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 mt-0.5 text-accent" /> +54
                    9 11 0000-0000
                  </a>
                </li>
                <li className="flex items-start gap-3 text-mute">
                  <MapPin className="w-4 h-4 mt-0.5 text-accent" />{" "}
                  {t("footer.columns.contact.location")}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-mute text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-ink font-semibold">Linkincode Studio</span>.{" "}
              {t("footer.copyright")}
            </p>
            <div className="flex gap-6 text-[12px] text-mute">
              {legalLinks.map((label) => (
                <a
                  key={label}
                  href="/#"
                  className="hover:text-brand transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5491100000000"
        target="_blank"
        rel="noreferrer"
        className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-3xl shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-1 hover:scale-105"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>

      <button
        onClick={scrollToTop}
        tabIndex={showBackToTop ? 0 : -1}
        aria-hidden={!showBackToTop}
        className={`fixed right-6 bottom-24 z-50 w-11 h-11 rounded-full bg-surface/70 backdrop-blur-md border border-line-strong text-ink flex items-center justify-center transition-all duration-300 ${showBackToTop ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}
        aria-label={t("common.backToTop")}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
