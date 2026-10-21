import useLanguage from "../hooks/useLanguage";
import { SERVICES } from "../data/services";

// Los valores van aparte para poder usar SERVICES.length.
// El orden de STAT_VALUES debe coincidir con el de statLabels.
const STAT_VALUES = ["15+", String(SERVICES.length), "< 24 h"];

const CONTENT = {
  es: {
    eyebrow: "Nuestro estudio",
    title: "Sobre",
    highlight: "nosotros",
    intro:
      "Somos un estudio de cuatro desarrolladores. Creamos y mantenemos sitios web, tiendas online y sistemas a medida, y trabajás siempre directo con quienes los construyen. Cada entrega la revisa otra persona del equipo y se prueba antes de publicarse.",
    statLabels: [
      "Proyectos completados",
      "Tipos de solución, de una landing a sistemas a medida",
      "Respuesta a cada consulta",
    ],
    teamTitle: "El equipo",
  },
  en: {
    eyebrow: "Our studio",
    title: "About",
    highlight: "us",
    intro:
      "We are a studio of four developers. We build and maintain websites, online stores and custom systems, and you always work directly with the people building them. Every delivery is reviewed by another team member and tested before it goes live.",
    statLabels: [
      "Completed projects",
      "Types of solutions, from a landing page to custom systems",
      "Response to every inquiry",
    ],
    teamTitle: "The team",
  },
};

// Ajustá roles y tecnologías a lo que cada uno realmente hace.
const TEAM = [
  {
    name: "Agustín Aparicio",
    role: { es: "Frontend & Accesibilidad", en: "Frontend & Accessibility" },
    image: "/team/Agustin.png",
    skills: ["React", "Tailwind CSS", "WCAG"],
  },
  {
    name: "Ángel Berretta",
    role: { es: "Full Stack & DevOps", en: "Full Stack & DevOps" },
    image: "/team/Angel.png",
    skills: ["React", "Node.js", "CI/CD"],
  },
  {
    name: "Santiago Molina",
    role: { es: "Backend & Bases de datos", en: "Backend & Databases" },
    image: "/team/Santiago.png",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    name: "Thomas Bretschneider",
    role: { es: "Desarrollador full stack", en: "Full Stack Developer" },
    image: "/team/Thomas.png",
    skills: ['REST APIs', 'React', 'Testing'],
  },
];

export default function AboutUs() {
  const { lang } = useLanguage();
  const c = CONTENT[lang] ?? CONTENT.es;

  return (
    <section id="nosotros" className="py-24 sm:py-32 border-t border-line">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent-text block mb-3">
            {c.eyebrow}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight mb-4">
            {c.title} <span className="text-accent">{c.highlight}</span>
          </h2>
          <p className="text-lg text-mute">{c.intro}</p>
        </div>

        {/* Estadísticas */}
        <dl className="bg-surface/70 backdrop-blur-md border border-line shadow-card rounded-[2rem] p-8 sm:p-12 mb-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STAT_VALUES.map((value, i) => (
            <div key={c.statLabels[i]} className="text-center">
              <dt className="sr-only">{c.statLabels[i]}</dt>
              <dd className="text-3xl sm:text-4xl font-extrabold text-brand mb-2">
                {value}
              </dd>
              <p className="text-sm font-medium text-mute" aria-hidden="true">
                {c.statLabels[i]}
              </p>
            </div>
          ))}
        </dl>

        {/* Equipo */}
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12 text-ink">
            {c.teamTitle}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <li
                key={member.name}
                className="bg-surface/70 backdrop-blur-md rounded-3xl border border-line p-7 flex flex-col items-center text-center shadow-card hover:border-brand/50 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className="w-36 h-36 sm:w-40 sm:h-40 mb-5 rounded-full overflow-hidden border-2 border-line group-hover:border-brand transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    width="160"
                    height="160"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-display text-lg font-bold text-ink">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-accent-text mt-1 mb-6">
                  {member.role[lang] ?? member.role.es}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-auto pt-4 border-t border-line/60 w-full">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-surface border border-line text-mute"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}