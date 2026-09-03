import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "../lib/lenis";
import RollingText from "./RollingText";

const links = [
  { label: "Sobre mí", href: "[data-bio-target]" },
  { label: "Servicios", href: "#services" },
  { label: "Proyectos", href: "#work" },
  { label: "Contacto", href: "#contact" },
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const focusFirstLink = window.requestAnimationFrame(() =>
      firstLinkRef.current?.focus(),
    );
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFirstLink);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.6, bounce: 0 };

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        className={`nav-menu ${isOpen ? "nav-menu--open" : ""}`}
        initial={{ opacity: 0.001 }}
        animate={{
          opacity: 1,
          height: isOpen ? "auto" : 60,
          transition: {
            opacity: reduceMotion
              ? { duration: 0 }
              : {
                  type: "tween" as const,
                  delay: 1.05,
                  duration: 1.69,
                  ease: [0.16, 1, 0.3, 1],
                },
            height: { ...transition, delay: isOpen ? 0 : 0 },
          },
        }}
      >
        <div className="nav-menu__bar">
          <a
            className="nav-menu__logo"
            href="#hero-section"
            aria-label="Pita home"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#hero-section");
            }}
          >
            Pita
          </a>
          <button
            ref={menuButtonRef}
            className="nav-menu__toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            aria-label={
              isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="nav-menu__dots" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  className="nav-menu__dot"
                  key={dot}
                  animate={
                    isOpen
                      ? { opacity: 0, scale: 0.4 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{
                    ...transition,
                    delay: reduceMotion ? 0 : (isOpen ? dot : 2 - dot) * 0.04,
                  }}
                />
              ))}
            </span>
            <motion.span
              className="nav-menu__x"
              aria-hidden="true"
              initial={false}
              animate={
                isOpen
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 0.5, rotate: -90 }
              }
              transition={{
                ...transition,
                delay: reduceMotion ? 0 : isOpen ? 0.08 : 0,
              }}
            >
              <span className="nav-menu__x-line nav-menu__x-line--a" />
              <span className="nav-menu__x-line nav-menu__x-line--b" />
            </motion.span>
          </button>
        </div>

        <AnimatePresence initial={false} propagate>
          {isOpen && (
            <motion.div
              id="primary-navigation"
              className="nav-menu__panel"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={transition}
            >
              <nav aria-label="Navegación principal">
                <ul className="nav-menu__links">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reduceMotion
                          ? undefined
                          : {
                              opacity: 0,
                              y: -8,
                              transition: {
                                ...transition,
                                delay: index * 0.08,
                              },
                            }
                      }
                      transition={{
                        ...transition,
                        delay: reduceMotion ? 0 : 0.35 + index * 0.07,
                      }}
                    >
                      <a
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpen(false);
                          scrollToTarget(link.href);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        onFocus={() => setActiveIndex(index)}
                        onBlur={() => setActiveIndex(null)}
                      >
                        <RollingText
                          text={link.label}
                          active={activeIndex === index}
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </MotionConfig>
  );
}
