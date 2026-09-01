// Datos base del equipo (nombre + color de avatar). Vive acá, separado de
// las traducciones, porque los nombres no se traducen y porque tanto el
// Hero (avatar stack) como la futura sección "Nosotros" (LC-018) necesitan
// esta misma lista — evita duplicarla en dos componentes.
export const TEAM = [
  { name: 'Santiago Molina', bg: '3B82F6' },
  { name: 'Thomas Bretschneider', bg: '06B6D4' },
  { name: 'Agustín Aparicio', bg: '2563EB' },
  { name: 'Angel Berretta', bg: '0891B2' },
];

export function avatarSrc({ name, bg }) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&bold=true`;
}