import { useCallback, useMemo, useState } from 'react';
import { ContactContext } from './contact-context.js';

export function ContactProvider({ children }) {
  const [requestedService, setRequestedService] = useState(null);

  const requestQuote = useCallback((serviceId, serviceLabel) => {
    setRequestedService({ id: serviceId, label: serviceLabel });
    const target = document.querySelector('#contacto');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const value = useMemo(
    () => ({ requestedService, requestQuote }),
    [requestedService, requestQuote]
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export default ContactProvider;