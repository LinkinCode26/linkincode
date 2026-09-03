import useScrollReveal from '../hooks/useScrollReveal';
import {technologies} from "../data/technologies";

const ICON_BASE_URL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';


const TechPill = ({ tech }) => (
  <div className="tech-pill" style={{ '--pc': tech.color }}>
    <img
      src={`${ICON_BASE_URL}/${tech.icon}.svg`}
      alt={tech.name}
      className={tech.invert ? 'logo-invert' : ''}
      style={{ width: 28, height: 28 }}
    />
    <span>{tech.name}</span>
  </div>
);


export const TechMarquee = () => {
  const revealRef = useScrollReveal();

  return (
    <div className="marquee-mask reveal" ref={revealRef}>
      <div className="marquee-track animate-marquee p-[8px]">
        {technologies.map((tech) => (
          <TechPill key={tech.name} tech={tech} />
        ))}
        {technologies.map((tech) => (
          <TechPill key={`${tech.name}-dup`} tech={tech} />
        ))}
      </div>
    </div>
  );
};


export default TechMarquee;