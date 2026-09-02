// Los 4 pasos del proceso de trabajo, alternando colores brand/accent.
// Los títulos y descripciones NO van acá: salen de useLanguage (t()),
// porque cambian según el idioma. Acá solo va lo que es visual y fijo.

export const COLOR_CLASSES = {
  brand: { dot: "bg-brand", iconBg: "bg-brand/15", iconText: "text-brand" },
  accent: { dot: "bg-accent", iconBg: "bg-accent/15", iconText: "text-accent" },
};

export const steps = [
  { number: 1, color: "brand", icon: "fa-comments" },
  { number: 2, color: "accent", icon: "fa-pen-ruler" },
  { number: 3, color: "brand", icon: "fa-laptop-code" },
  { number: 4, color: "accent", icon: "fa-graduation-cap" },
];

export default steps;