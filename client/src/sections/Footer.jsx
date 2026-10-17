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
                  href="https://wa.me/5491171449296"
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
                    href="mailto:contacto@linkincode.com"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-accent" />{" "}
                    contacto@linkincode.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5491171449296"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 mt-0.5 text-accent" /> +54
                    9 11 7144-9296
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
        href="https://wa.me/5491171449296"
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