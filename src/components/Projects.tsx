import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VISIBLE_COUNT = 4;

// Grid animates as a group; cards stagger subtly (0.05s) to avoid a
// theatrical one-by-one reveal while still feeling orchestrated.
const gridVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.985, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const projects = [
  {
    name: "Creative By Gigi",
    description: "Landing page para creadora de contenido y marketing digital",
    tags: "Astro · UGC · Landing page",
    image: "/projects/project_1.webp",
    link: "https://creativebygigi.com",
  },
  {
    name: "CJ Sport Training",
    description: "Plataforma de reservas para entrenamientos deportivos",
    tags: "Next.js · PostgreSQL · Reservas",
    image: "/projects/project_2.webp",
    link: "https://cjsporttraining.com",
  },
  {
    name: "Colorato Industria",
    description: "Calculadora en tiempo real para industria de óxido y carateo",
    tags: "Astro · Landing page · Calculadora",
    image: "/projects/project_3.webp",
    link: "https://coloratoindustria.com",
  },
  {
    name: "Avora",
    description:
      "Herramienta de optimización de currículums con inteligencia artificial",
    tags: "AI · Next.js · Curriculum",
    image: "/projects/project_4.webp",
    link: "https://avora.pitass.com",
  },
  {
    name: "Zentra",
    description:
      "Punto de venta, control de inventario y reportes para negocios varios",
    tags: "POS · SQLite · Reportes",
    image: "/projects/project_5.webp",
    link: "https://zentra.pitass.com",
  },
  {
    name: "Raíces Intervención Social",
    description:
      "Sitio web profesional para intervención socioeducativa con adolescentes y familias, y proyectos institucionales para centros educativos.",
    tags: "Astro · Intervención Social · Landing page",
    image: "/projects/project_6.webp",
    link: "https://raicesintervencionsocial.com",
  },
];

// Diagonal arrow SVG path (same as ArrowLink)
const ARROW_PATH = "M6 14L14 6M14 6H9M14 6V11";

export default function Projects() {
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const visibleProjects = expanded
    ? projects
    : projects.slice(0, VISIBLE_COUNT);
  const hasMore = projects.length > VISIBLE_COUNT;

  return (
    <section className="projects">
      <div className="projects__header">
        <motion.h2
          initial={
            reduceMotion ? false : { opacity: 0, y: -35, filter: "blur(12px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Proyectos
        </motion.h2>
      </div>
      <motion.div
        className="projects__grid"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduceMotion ? undefined : gridVariants}
      >
        <AnimatePresence initial={false}>
          {visibleProjects.map((project) => (
            <motion.article
              key={project.name}
              className="projects__card"
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={reduceMotion ? undefined : cardVariants}
              layout
            >
              <a
                href={project.link}
                className="projects__card-image"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver proyecto ${project.name}`}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (
                      parent &&
                      !parent.querySelector(".projects__fallback")
                    ) {
                      const fallback = document.createElement("div");
                      fallback.className = "projects__fallback";
                      fallback.style.cssText =
                        "width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e8e0d8;border-radius:inherit;";
                      const span = document.createElement("span");
                      span.style.cssText =
                        "font-size:clamp(2rem,5vw,3rem);font-family:'Archivo',sans-serif;font-weight:700;color:#b0a89e;letter-spacing:-0.03em;";
                      span.textContent = project.name;
                      fallback.appendChild(span);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </a>
              <h3>{project.name}</h3>
              <p style={{ color: "var(--ink)" }}>{project.description}</p>
              <span className="projects__card-tags">{project.tags}</span>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {hasMore && (
        <div className="projects__toggle-wrap">
          <button
            type="button"
            className="arrow-link projects__toggle-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <span className="arrow-link__label">
              {expanded ? "Ver menos" : "Ver más"}
            </span>
            <span className="arrow-link__icon" aria-hidden="true">
              <svg
                className="arrow-link__arrow arrow-link__arrow--exit"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d={ARROW_PATH}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="arrow-link__arrow arrow-link__arrow--enter"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d={ARROW_PATH}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
