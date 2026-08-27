import { createContext, useEffect, useMemo, useState } from 'react';
import translations from '../i18n/translations';

const STORAGE_KEY = 'lc-lang';
const SUPPORTED_LANGS = Object.keys(translations); // ['es', 'en']
const DEFAULT_LANG = 'es';

export const LanguageContext = createContext(null);

function isSupported(lang) {
  return SUPPORTED_LANGS.includes(lang);
}

function readStoredLang() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage puede fallar en modo privado o si está deshabilitado.
    return null;
  }
}

function getInitialLang() {
  const stored = readStoredLang();
  if (isSupported(stored)) return stored;
  return DEFAULT_LANG;
}

// Busca una clave con notación de puntos ("solutions.services.landing.cta")
// dentro del diccionario del idioma activo.
function resolveKey(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  // Persiste en localStorage y sincroniza el atributo lang del documento
  // cada vez que cambia el idioma activo.
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Si no se puede persistir, el idioma queda igual solo durante la sesión.
    }
  }, [lang]);

  const setLang = (nextLang) => {
    if (!isSupported(nextLang) || nextLang === lang) return;
    setLangState(nextLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // t('nav.inicio') -> string traducido. Si falta la clave en el idioma
  // activo, cae al español; si tampoco existe ahí, devuelve la key.
  const t = useMemo(() => {
    return (key, fallback) => {
      const value = resolveKey(translations[lang], key);
      if (value !== undefined) return value;

      const esValue = resolveKey(translations[DEFAULT_LANG], key);
      if (esValue !== undefined) return esValue;

      return fallback !== undefined ? fallback : key;
    };
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      dict: translations[lang],
      supportedLangs: SUPPORTED_LANGS,
    }),
    [lang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageProvider;