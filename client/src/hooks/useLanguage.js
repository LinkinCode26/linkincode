import { useContext } from 'react';
import { LanguageContext } from '../context/language-context.js';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }
  return context;
}

export default useLanguage;