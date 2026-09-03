import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Sticker } from "./Sticker";
import AnimatedText from "./AnimatedText";

// Title bands live in the LATE window of the approach. History: late start
// (+30% delay pass), then stretched ~25% anchored at the end (0.97) so the
// entrance unfolds more gradually while landing and latch stay at the same
// reading position (~37vh).
const TITLE_OPACITY_BAND = [0.65, 0.86] as const;
const TITLE_BLUR_BAND = [0.67, 0.93] as const;
const TITLE_Y_BAND = [0.7, 0.97] as const;

// Sticker bands sit ~5% later than the title's — title leads, sticker follows
// — to mirror the Hero's staggered load timing (title 0s, sticker 0.65s) on a
// scroll-driven choreography. End stays short of the title's so the latch at
// 0.97 catches both at once.
const STICKER_OPACITY_BAND = [0.7, 0.9] as const;
const STICKER_BLUR_BAND = [0.72, 0.94] as const;
const STICKER_SCALE_BAND = [0.73, 0.94] as const;
const STICKER_Y_BAND = [0.74, 0.96] as const;

// Once the entrance completes, the title latches: scrolling back up keeps it
// fully visible instead of scrubbing it back to hidden (one-way reveal).
const TITLE_LATCH_PROGRESS = 0.97;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const services = [
  {
    name: "Desarrollo Full Stack",
    tags: "Angular · React · Node.js · NestJS",
  },
  {
    name: "Desarrollo Frontend",
    tags: "UI/UX · Diseño Responsive · Componentes Reutilizables",
  },
  // {
  //   name: "Integración de APIs",
  //   tags: "REST APIs · WebSockets · Tiempo Real",
  // },
  {
    name: "Optimización y Mantenimiento",
    tags: "Rendimiento · Refactorización · Escalabilidad",
  },
  {
    name: "Consultoría Técnica",
    tags: "Arquitectura · Buenas Prácticas · Code Review",
  },
];

function ServiceRow({
  index,
  name,
  tags,
  reduceMotion,
}: {
  index: number;
  name: string;
  tags: string;
  reduceMotion: boolean;
}) {
  const rowRef = useRef<HTMLLIElement>(null);
  const isInView = useInView(rowRef, {
    once: true,
    // Trigger when the row climbs past ~78% of the viewport so the first row
    // never overtakes its own section title during the approach.
    margin: "0px 0px -22% 0px",
  });

  return (
    <motion.li
      ref={rowRef}
      className="services__row"
      initial={
        reduceMotion ? false : { opacity: 0, y: 40, filter: "blur(8px)" }
      }
      style={{
        borderTop: index === 0 ? "none" : undefined,
      }}
      animate={
        reduceMotion || isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 40, filter: "blur(8px)" }
      }
      transition={{
        opacity: { duration: 0.5, ease: EASE },
        y: { duration: 0.65, ease: EASE },
        filter: { duration: 0.9, ease: EASE },
      }}
    >
      <h3>{name}</h3>

      <AnimatedText client:load text={tags} delay={0.3} />
      {/* <p>{tags}</p> */}
    </motion.li>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();
  const [titleLatched, setTitleLatched] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 35%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress >= TITLE_LATCH_PROGRESS) setTitleLatched(true);
  });

  // The change event only fires on scroll; cover the load-already-scrolled
  // case (e.g. refresh mid-page) by checking the current progress once.
  useEffect(() => {
    if (scrollYProgress.get() >= TITLE_LATCH_PROGRESS) setTitleLatched(true);
  }, [scrollYProgress]);

  const titleOpacity = useTransform(
    scrollYProgress,
    TITLE_OPACITY_BAND,
    [0, 1],
  );
  const titleBlur = useTransform(scrollYProgress, TITLE_BLUR_BAND, [
    "blur(8px)",
    "blur(0px)",
  ]);
  const titleY = useTransform(scrollYProgress, TITLE_Y_BAND, [28, 0]);

  return (
    <div ref={sectionRef} className="services">
      {/* Separate refs keep scroll progress and sticker drag bounds from competing. */}
      <div ref={stageRef} className="services__stage">
        <Sticker
          side="hidden sticker--star"
          // Path bbox: X[862,1046] Y[108,285]. Square 184x184 centered on
          // (954, 196.5) so the shape fills the sticker area without distortion.
          viewBox="862 104 184 184"
          enterDelay={0.65}
          constraints={stageRef}
          reduceMotion={reduceMotion}
        >
          <path
            d="M 948 108 L 928 115 L 917 125 L 908 143 L 907 158 L 914 178 L 925 190 L 938 197 L 959 199 L 977 193 L 992 179 L 999 161 L 999 146 L 993 130 L 981 117 L 964 109 Z
M 862 196 L 862 203 L 868 227 L 876 244 L 895 266 L 912 276 L 926 281 L 946 285 L 961 285 L 991 278 L 1010 268 L 1025 254 L 1040 227 L 1046 196 L 1024 199 L 1008 204 L 982 220 L 972 232 L 963 248 L 954 282 L 949 261 L 941 241 L 923 218 L 904 206 L 883 199 Z"
            fill="#111"
          />
        </Sticker>

        <motion.h2
          id="services-title"
          className="services__title"
          style={
            reduceMotion || titleLatched
              ? undefined
              : {
                  opacity: titleOpacity,
                  filter: titleBlur,
                  y: titleY,
                }
          }
        >
          Servicios
        </motion.h2>
        <ul className="services__list">
          {services.map((service, index) => (
            <ServiceRow
              index={index}
              key={service.name}
              name={service.name}
              tags={service.tags}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
