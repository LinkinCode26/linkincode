import React from "react";

const stats = [
  { id: 1, value: "15+", label: "Proyectos completados" },
  { id: 2, value: "MERN", label: "Stack Principal" },
  { id: 3, value: "100%", label: "Código testeado y clean" },
  { id: 4, value: "24/7", label: "Disponibilidad y soporte" },
];

const teamMembers = [
  {
    id: 1,
    name: "Agustin Aparicio",
    role: "Full Stack Lead",
    image: "public/team/agustin.png",
    skills: ["React", "Node.js", "Arquitectura"],
  },
  {
    id: 2,
    name: "Angel Berreta",
    role: "Frontend Engineer",
    image: "public/team/angel.png",
    skills: ["React", "Tailwind CSS", "UI/UX"],
  },
  {
    id: 3,
    name: "Santiago Molina",
    role: "Database & API Specialist",
    image: "public/team/santiago.png",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    id: 4,
    name: "Thomas Bretschneider",
    role: "Backend Developer",
    image: "public/team/thomas.png",
    skills: ["Databases", "REST APIs", "SQL/NoSQL"],
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-24 sm:py-32 border-t border-line">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent block mb-3">
            Nuestro Estudio
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight mb-4">
            Sobre <span className="text-accent">Nosotros</span>
          </h2>
          <p className="text-lg text-mute">
            Somos un equipo enfocado en construir aplicaciones web robustas,
            escalables y modernas con el stack MERN.
          </p>
        </div>

        {/* Bloque Stats */}
        <div className="bg-surface/70 backdrop-blur-md border border-line shadow-xl rounded-[2rem] p-8 sm:p-12 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <p className="text-3xl sm:text-5xl font-extrabold text-brand mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-mute">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de Equipo con Avatares Grandes + Tags de Stack */}
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12 text-ink">
            Nuestro Equipo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-surface/70 backdrop-blur-md rounded-3xl border border-line p-7 flex flex-col items-center text-center shadow-lg hover:border-brand/50 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Avatar circular amplio (w-36 h-36 = 144px) */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 mb-5 rounded-full overflow-hidden border-2 border-line group-hover:border-brand shadow-inner transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                <h4 className="font-display text-lg font-bold text-ink">
                  {member.name}
                </h4>

                <p className="text-xs font-semibold text-accent mt-1 mb-6">
                  {member.role}
                </p>

                {/* Tags de tecnologías para cerrar la tarjeta */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-auto pt-4 border-t border-line/60 w-full">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-surface border border-line text-mute"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}