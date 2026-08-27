import { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';

// Los nombres de cada idioma se muestran en su propio idioma (endónimo),
// por eso no salen del diccionario de traducciones.
const LANGUAGE_LABELS = {
  es: { flag: '🇪🇸', name: 'Español', code: 'ES' },
  en: { flag: '🇺🇸', name: 'English', code: 'EN' },
};

/**
 * Selector de idioma estilo dropdown, para la navbar de escritorio.
 * Reemplaza el #langToggle / #langDropdown del boceto estático.
 */
export function LanguageDropdown({ className = '' }) {
  const { lang, setLang, supportedLangs } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const active = LANGUAGE_LABELS[lang];

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-[11px] font-bold uppercase tracking-wider text-mute hover:text-ink hover:border-brand transition-all"
      >
        <i className="fas fa-globe text-[11px]" aria-hidden="true" />
        {active.code}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar idioma"
          className="absolute right-0 top-full mt-2 rounded-xl border border-line bg-surface/95 backdrop-blur-md shadow-xl p-1.5 min-w-[130px] z-20"
        >
          {supportedLangs.map((code) => {
            const isActive = code === lang;
            const label = LANGUAGE_LABELS[code];
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive ? 'text-ink bg-bg' : 'text-mute hover:text-ink hover:bg-bg'
                }`}
              >
                <span aria-hidden="true">{label.flag}</span>
                {label.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Variante compacta de dos botones (ES / EN), pensada para el menú mobile
 * donde el boceto usaba .lang-option-mobile.
 */
export function LanguageToggleMobile({ className = '' }) {
  const { lang, setLang, supportedLangs } = useLanguage();

  return (
    <div className={`flex gap-2 ${className}`} role="group" aria-label="Seleccionar idioma">
      {supportedLangs.map((code) => {
        const isActive = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLang(code)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
              isActive ? 'bg-surface border-brand text-brand' : 'border-line text-mute'
            }`}
          >
            {LANGUAGE_LABELS[code].code}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageDropdown;