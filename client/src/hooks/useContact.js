import { useContext } from 'react';
import { ContactContext } from '../context/contact-context.js';

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact debe usarse dentro de <ContactProvider>');
  }
  return context;
}

export default useContact;