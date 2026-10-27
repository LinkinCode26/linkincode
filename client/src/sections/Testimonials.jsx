import useLanguage from "../hooks/useLanguage";
import useScrollReveal from "../hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const { t } = useLanguage();
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ delay: 0.15 });

  const items = t("testimonials.items") || [];

  return (
    <section
      id="testimonios"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Luz ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Encabezado de la sección */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent block mb-3">
            {t("testimonials.eyebrow")}
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight mb-4">
            {t("testimonials.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">
              {t("testimonials.highlight")}
            </span>
          </h2>
          <p className="text-lg text-mute">{t("testimonials.subtitle")}</p>
        </div>

        {/* Grid de Testimonios */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-surface/70 backdrop-blur-md border border-line rounded-[2rem] p-8 flex flex-col justify-between shadow-card hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-6 text-brand/20 group-hover:text-brand/40 transition-colors">
                <Quote className="w-8 h-8" />
              </div>

              <div>
                {/* Estrellitas */}
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-mute text-sm sm:text-base leading-relaxed mb-8">
                  &quot;{item.content}&quot;
                </p>
              </div>

              {/* Datos del cliente */}
              <div className="pt-6 border-t border-line/60 flex items-center gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-line shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-ink text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-mute">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
