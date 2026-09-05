import { useState, useEffect } from 'react';
import useLanguage from '../hooks/useLanguage';
import { Button } from './Button';
import LanguageDropdown from './LanguageDropdown';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/logo.png'; 

const NAV_ITEMS = [
  { key: 'inicio', href: '#inicio' },
  { key: 'soluciones', href: '#soluciones' },
  { key: 'proceso', href: '#proceso' },
  { key: 'nosotros', href: '#nosotros' },
];

export function Navbar() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('inicio');
  const [isOpen, setIsOpen] = useState(false);

  // Detección por porcentaje de área visible en pantalla
  useEffect(() => {
  const handleScroll = () => {
    // 1. Si existe la sección contacto y ya ocupa la mitad inferior de la pantalla,
    // apagamos el subrayado de los links
    const contactoEl = document.getElementById('contacto');
    if (contactoEl) {
      const rectC = contactoEl.getBoundingClientRect();
      if (rectC.top < window.innerHeight * 0.5) {
        setActiveSection('contacto');
        return;
      }
    }

    // 2. Evaluamos cuál sección tiene su centro más cerca del centro de la pantalla
    const viewportCenter = window.innerHeight / 2;
    let closestSection = '';
    let minDistance = Infinity;

    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.key);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Centro vertical de la sección actual
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        // Si esta sección está más centrada en pantalla que las anteriores
        if (distance < minDistance) {
          minDistance = distance;
          closestSection = item.key;
        }
      }
    }

    if (closestSection) {
      setActiveSection(closestSection);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Comprobación inmediata

  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Bloquear scroll del body si el drawer móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Header fijo superior */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[rgb(var(--nav-bg))]/80 backdrop-blur-xl border-b border-line transition-colors duration-300">
        <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 select-none">
            <img 
              src={logoImg} 
              alt="LinkinCode Logo" 
              className="h-16 w-auto object-contain hover:opacity-90 transition-opacity" 
            />
          </a>

          {/* Enlaces Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setActiveSection(item.key)}
                  className={`relative py-1 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? 'text-brand' : 'text-mute hover:text-ink'
                  }`}
                >
                  {t(`nav.${item.key}`) || item.key.toUpperCase()}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Acciones Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            <LanguageDropdown />
            <ThemeToggle />
            <Button
              href="#contacto"
              onClick={() => setActiveSection('contacto')}
              variant="brand"
              size="medium"
              className="font-bold tracking-widest text-xs uppercase px-6 py-2.5 rounded-xl shadow-lg shadow-brand/20"
            >
              {t('nav.contacto') || 'CONTACTO'}
            </Button>
          </div>

          {/* Botón Hamburguesa Tablet / Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="p-2.5 rounded-xl border border-line bg-surface/60 text-mute hover:text-ink hover:border-brand/40 transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Backdrop para Drawer Móvil */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Drawer Lateral */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-surface border-l border-line p-6 z-[60] flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-line">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-mute">
              Navegación
            </span>
            <button
              type="button"
              onClick={closeDrawer}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-line bg-bg text-mute hover:text-ink hover:border-brand/40 transition-colors shadow-sm"
              aria-label="Cerrar menú"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.key);
                    closeDrawer();
                  }}
                  className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                    isActive
                      ? 'text-brand bg-brand/10 border border-brand/30 font-bold shadow-sm'
                      : 'text-mute hover:text-ink hover:bg-bg/60'
                  }`}
                >
                  {t(`nav.${item.key}`) || item.key.toUpperCase()}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-line flex flex-col gap-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-mute font-medium uppercase tracking-wider">Ajustes</span>
            <div className="flex items-center gap-3">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
          </div>

          <Button
            href="#contacto"
            onClick={() => {
              setActiveSection('contacto');
              closeDrawer();
            }}
            variant="brand"
            className="w-full justify-center text-xs font-bold uppercase tracking-widest py-3 rounded-xl shadow-lg shadow-brand/20"
          >
            {t('nav.contacto') || 'CONTACTO'}
          </Button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;