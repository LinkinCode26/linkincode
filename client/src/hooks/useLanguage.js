import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.jsx';

// Uso: const { lang, setLang, t } = useLanguage();
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }

  return context;
}

export default useLanguage;