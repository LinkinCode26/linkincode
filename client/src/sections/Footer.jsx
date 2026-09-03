import { useState, useEffect } from "react";
import useLanguage from "../hooks/useLanguage";

export default function Footer() {
  const { t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative pt-20 pb-8 bg-bg border-t border-line overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 blur-[100px] -z-10"></div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-line">
            <div className="lg:col-span-4">
              <a href="#" className="flex items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-ink tracking-tight">
                  Linkincode
                </h2>
              </a>
              <p className="text-mute leading-relaxed mb-6 max-w-sm">
                Estudio de 4 desarrolladores Full Stack. Construimos software
                confiable, escalable y con estándares internacionales.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface border border-line mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                  Disponibles para nuevos proyectos
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-mute hover:text-white hover:bg-brand hover:border-brand transition-all"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-mute hover:text-white hover:bg-brand hover:border-brand transition-all"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://wa.me/5491100000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-mute hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-mute hover:text-white hover:bg-brand hover:border-brand transition-all"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                Sitio
              </h4>
              <ul className="space-y-4 text-sm text-mute">
                <li>
                  <a
                    href="#inicio"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-accent"></i>
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-accent"></i>
                    Soluciones
                  </a>
                </li>
                <li>
                  <a
                    href="#proceso"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-accent"></i>
                    Proceso
                  </a>
                </li>
                <li>
                  <a
                    href="#nosotros"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-accent"></i>
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#tecnologias"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chevron-right text-[9px] text-accent"></i>
                    Tecnologías
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                Servicios
              </h4>
              <ul className="space-y-4 text-sm text-mute">
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-globe text-[11px] text-accent"></i>
                    Landing Pages
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-store text-[11px] text-accent"></i>
                    E-commerce
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-code text-[11px] text-accent"></i>APIs
                    REST
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-chart-pie text-[11px] text-accent"></i>
                    Dashboards
                  </a>
                </li>
                <li>
                  <a
                    href="#contacto"
                    className="hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-wand-magic-sparkles text-[11px] text-accent"></i>
                    Proyecto a medida
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-ink mb-6">
                Contacto
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="mailto:hola@linkincode.dev"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <i className="fas fa-envelope mt-0.5 text-accent"></i>{" "}
                    hola@linkincode.dev
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5491100000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-mute hover:text-brand transition-colors"
                  >
                    <i className="fab fa-whatsapp mt-0.5 text-accent"></i> +54 9
                    11 0000-0000
                  </a>
                </li>
                <li className="flex items-start gap-3 text-mute">
                  <i className="fas fa-location-dot mt-0.5 text-accent"></i>{" "}
                  Argentina · Trabajo 100% remoto
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-mute/70 text-center md:text-left">
              © 2025{" "}
              <span className="text-mute font-semibold">Linkincode Studio</span>
              . Hecho con{" "}
              <i className="fas fa-heart text-brand text-[10px] mx-1"></i> por 4
              amigos developers.
            </p>
            <div className="flex gap-6 text-[12px] text-mute/70">
              <a href="#" className="hover:text-brand transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                Cookies
              </a>
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
        <i className="fab fa-whatsapp"></i>
      </a>

      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-24 z-50 w-11 h-11 rounded-full bg-surface/70 backdrop-blur-md border border-line text-ink flex items-center justify-center transition-all duration-300 ${showBackToTop ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}
        aria-label="Volver arriba"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}
