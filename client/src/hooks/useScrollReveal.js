import { useEffect, useRef } from 'react';

const DEFAULTS = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
  once: true,
  delay: 0,
};

/**
 * useScrollReveal
 *
 * Reemplaza el patrón .reveal / .in del boceto estático (script.js +
 * IntersectionObserver manual) por un hook reutilizable en cualquier
 * sección del sitio.
 *
 * Uso mínimo (una sola línea):
 *   const revealRef = useScrollReveal();
 *   <div ref={revealRef}>...</div>
 *
 * Con delay escalonado (stagger), útil en grids de cards como el equipo:
 *   const revealRef = useScrollReveal({ delay: index * 0.1 });
 *
 * Con otras opciones (mismo shape que un IntersectionObserver):
 *   useScrollReveal({ threshold: 0.3, once: false })
 *
 * Por qué no dispara re-renders:
 * El observer no usa useState. Al entrar en viewport, manipula
 * directamente classList/style del nodo del DOM (igual que hacía
 * revealObserver en script.js), así que React nunca vuelve a renderizar
 * el componente por culpa del scroll — sólo se ejecuta una vez el efecto
 * de montaje/desmontaje.
 *
 * @param {Object} [options]
 * @param {number} [options.threshold=0.15] - % visible para disparar el reveal.
 * @param {string} [options.rootMargin='0px 0px -10% 0px'] - margen del observer.
 * @param {boolean} [options.once=true] - si es false, el elemento se oculta
 *   de nuevo al salir del viewport (por defecto se revela una sola vez,
 *   igual que el boceto).
 * @param {number|string} [options.delay=0] - transition-delay. Un número se
 *   interpreta en segundos (ej: 0.15 -> "0.15s"); un string se usa tal cual.
 * @returns {import('react').RefObject} ref para asignar al elemento a revelar.
 */
export function useScrollReveal(options = {}) {
  const { threshold, rootMargin, once, delay } = { ...DEFAULTS, ...options };
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.classList.add('reveal');

    if (delay) {
      node.style.transitionDelay = typeof delay === 'number' ? `${delay}s` : delay;
    }

    // Respeta la preferencia de movimiento reducido: mostramos el
    // contenido directamente, sin animar.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Fallback para navegadores sin soporte de IntersectionObserver:
    // mostramos el contenido en vez de dejarlo oculto para siempre.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add('in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('in');
            if (once) observer.unobserve(node);
          } else if (!once) {
            node.classList.remove('in');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
    // Sólo dependemos de las opciones primitivas, no del objeto `options`
    // (que puede recrearse en cada render si se pasa inline).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, once, delay]);

  return ref;
}

export default useScrollReveal;