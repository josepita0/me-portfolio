import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { scrollToTarget } from "../lib/lenis";
import RollingText from "./RollingText";

const quickLinks = [
  { label: "Inicio", href: "#hero-section" },
  { label: "Sobre mí", href: "[data-bio-target]" },
  { label: "Servicios", href: "#services" },
  { label: "Proyectos", href: "#projects" },
  { label: "Contacto", href: "#contact" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function FooterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setActiveIndex] = useState<number | null>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.4,
  });

  return (
    <section ref={sectionRef} className="footer__content">
      <motion.div
        className="footer__grid"
        initial={
          reduceMotion ? false : { opacity: 0, y: 35, filter: "blur(12px)" }
        }
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 35, filter: "blur(12px)" }
        }
        transition={{
          opacity: { duration: 1.0, ease: EASE },
          y: { duration: 1.1, ease: EASE },
          filter: { duration: 1.2, ease: EASE },
        }}
      >
        <div className="footer__headline">
          <h2>
            Escalando <br />
            Ideas en
            <br /> Productos.
          </h2>
        </div>

        <div className="footer__links">
          <h3>/Accesos rápidos</h3>
          <div className="footer__pills">
            {quickLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="footer__pill"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(link.href);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 0.35 + index * 0.07,
                }}
              >
                <RollingText
                  text={link.label}
                  active={hoveredIndex === index}
                />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer__contact">
          <h3>/Contacto</h3>
          <a href="mailto:contacto@pitass.com" className="footer__email">
            contacto@pitass.com
          </a>
        </div>
      </motion.div>

      <motion.span
        className="footer__word"
        aria-hidden="true"
        initial={
          reduceMotion ? false : { opacity: 0, y: 50, filter: "blur(16px)" }
        }
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 50, filter: "blur(16px)" }
        }
        transition={{
          opacity: { duration: 1.3, ease: EASE, delay: reduceMotion ? 0 : 0.8 },
          y: { duration: 1.4, ease: EASE, delay: reduceMotion ? 0 : 0.8 },
          filter: { duration: 1.5, ease: EASE, delay: reduceMotion ? 0 : 0.8 },
        }}
      >
        PITA
      </motion.span>
    </section>
  );
}
