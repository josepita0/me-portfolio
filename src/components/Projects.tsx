import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    tags: "Next.js · PostgreSQL · Booking",
    image: "/projects/project_2.webp",
    link: "https://cjsporttraining.com",
  },
  {
    name: "Colorato Industria",
    description: "Calculadora en tiempo real para industria de oxido y carateo",
    tags: "Astro · Landing page · Calculadora",
    image: "/projects/project_3.webp",
    link: "https://coloratoindustria.com",
  },
];

export default function Projects() {
  const reduceMotion = useReducedMotion();

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
        {/* <a href="#" className="projects__view-all">
          View All →
        </a> */}
      </div>
      <motion.div
        className="projects__grid"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduceMotion ? undefined : gridVariants}
      >
        {projects.map((project) => (
          <motion.article
            key={project.name}
            className="projects__card"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={reduceMotion ? undefined : cardVariants}
          >
            <a
              href={project.link}
              className="projects__card-image"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} project`}
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
                  if (parent && !parent.querySelector(".projects__fallback")) {
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
      </motion.div>
    </section>
  );
}
