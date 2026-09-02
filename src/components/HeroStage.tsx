import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import React, { useRef } from "react";
import ArrowLink from "./ArrowLink";

const AVATAR_BLACK_URL = "/images/avatar_black.webp";
const AVATAR_COLOR_URL = "/images/avatar_color.webp";
// Cinematic entrance: mask + blur + micro movement, desynced per property. Runs once on load.
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const enter = (delay: number, duration: number) => ({
  type: "tween" as const,
  delay,
  duration,
  ease: EASE,
});
// Title: blur -> focus with slightly offset property durations so it never feels mechanical.
const titleLine = (delay: number) => ({
  opacity: { delay, duration: 2.16, ease: EASE },
  y: { delay, duration: 1.87, ease: EASE },
  filter: { delay, duration: 1.69, ease: EASE },
});
const HERO_EXIT_BAND = [0, 0.55] as const;
const CARD_ROTATION_BAND = [0.2, 0.8] as const;
const BIO_ENTRY_BAND = [0.5, 1] as const;
// Resting hero state: card sits low (corner-label row) at half size, grows to full as the morph runs.
const CARD_START_Y = "30vh";
const CARD_START_SCALE = 0.5;

function Sticker({
  side,
  enterDelay,
  constraints,
  reduceMotion,
  children,
  viewBox = "0 0 160 160",
}: {
  side: "star" | "bolt";
  enterDelay: number;
  constraints: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <div className={`hero-sticker hero-sticker--${side}`} aria-hidden="true">
      <motion.div
        className="hero-sticker__draggable"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { delay: enterDelay, duration: 1.87, ease: EASE },
          scale: { delay: enterDelay, duration: 2.05, ease: EASE },
        }}
        drag
        dragConstraints={constraints}
        dragElastic={0.3}
        dragMomentum={false}
        whileDrag={{ cursor: "grabbing", scale: 1.05 }}
      >
        <div className="hero-sticker__rotation">
          <svg viewBox={viewBox} role="presentation">
            {children}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, HERO_EXIT_BAND, ["0vh", "-90vh"]);
  const cardRotate = useTransform(
    scrollYProgress,
    CARD_ROTATION_BAND,
    [0, 180],
  );
  const cardY = useTransform(scrollYProgress, CARD_ROTATION_BAND, [
    CARD_START_Y,
    "0vh",
  ]);
  const cardScale = useTransform(scrollYProgress, CARD_ROTATION_BAND, [
    CARD_START_SCALE,
    1,
  ]);
  const bioY = useTransform(scrollYProgress, BIO_ENTRY_BAND, ["90vh", "0vh"]);
  // Greeting "Hey!" — scroll-driven entrance synced with bio layer appearance.
  const GREETING_BAND = [0.65, 0.85] as const;
  const greetingOpacity = useTransform(scrollYProgress, GREETING_BAND, [0, 1]);
  const greetingY = useTransform(scrollYProgress, GREETING_BAND, [18, 0]);
  const greetingBlur = useTransform(scrollYProgress, GREETING_BAND, [8, 0]);

  return (
    <div ref={stageRef} className="hero-stage">
      <div className="hero-stage__sticky">
        <motion.div
          className="hero-layer"
          style={reduceMotion ? undefined : { y: heroY }}
        >
          <div className="hero-layer__entrance">
            <div className="hero-headline-wrap">
              <h1 id="hero-title">
                <motion.span
                  className="hero-title-line"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 18, filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={titleLine(0)}
                >
                  INGENIERO
                </motion.span>
                <motion.span
                  className="hero-title-line"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 18, filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={titleLine(0.2)}
                >
                  DE SOFTWARE
                </motion.span>
              </h1>
              <Sticker
                side="star"
                enterDelay={0.65}
                constraints={stageRef}
                reduceMotion={reduceMotion}
              >
                <path
                  d="m80 7 18 47 48-18-27 43 35 35-51-7-13 46-18-46-50 11 34-38-28-41 48 16Z"
                  fill="#111"
                />
              </Sticker>
              <Sticker
                side="bolt"
                enterDelay={0.72}
                constraints={stageRef}
                reduceMotion={reduceMotion}
              >
                <path d="m91 5-51 79h37l-12 71 55-91H83Z" fill="#111" />
              </Sticker>
            </div>
            <motion.div
              className="hero-corners"
              aria-label="Portfolio details"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { delay: 0.9, duration: 1.69, ease: EASE },
                y: { delay: 0.9, duration: 1.78, ease: EASE },
              }}
            >
              <span className="hero-corners-left">©2026</span>
              <span className="hero-corners-right">/CREANDO DESDE 2020</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="avatar-card-layer"
          initial={reduceMotion ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: 0.4, duration: 2.43, ease: EASE }}
        >
          <motion.div
            className="avatar-card-layer__entrance"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 30, scale: 1.04, filter: "blur(16px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{
              opacity: { delay: 0.4, duration: 2.25, ease: EASE },
              y: { delay: 0.4, duration: 2.16, ease: EASE },
              scale: { delay: 0.4, duration: 2.81, ease: EASE },
              filter: { delay: 0.4, duration: 1.87, ease: EASE },
            }}
          >
            <motion.div
              className="avatar-card"
              style={
                reduceMotion
                  ? undefined
                  : {
                      y: cardY,
                      scale: cardScale,
                      rotateY: cardRotate,
                      transformPerspective: 1200,
                    }
              }
              aria-label="Interactive portrait card"
            >
              <div className="avatar-card__face avatar-card__face--front">
                <img src={AVATAR_BLACK_URL} alt="Portrait of Majd" />
              </div>
              <div
                className="avatar-card__face avatar-card__face--back"
                aria-hidden="true"
              >
                <img src={AVATAR_COLOR_URL} alt="" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bio-layer"
          style={reduceMotion ? undefined : { y: bioY }}
        >
          <motion.div
            className="bio-layer__entrance"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={enter(0.72, 0.94)}
          >
            <div className="bio-layer__grid">
              <div className="bio-layer__left">
                <motion.p
                  id="bio-greeting"
                  className="bio-greeting"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 18, filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    opacity: { delay: 0.72, duration: 2.16, ease: EASE },
                    y: { delay: 0.72, duration: 1.87, ease: EASE },
                    filter: { delay: 0.72, duration: 1.69, ease: EASE },
                  }}
                  style={{
                    margin: "0 0 100px",
                  }}
                >
                  Epa!
                </motion.p>
                <p className="bio-text" aria-labelledby="bio-greeting">
                  Soy José Alejandro, desarrollador full stack basado en Elda,
                  España, con más de 5 años de experiencia construyendo
                  aplicaciones web escalables y de alto rendimiento.
                </p>
              </div>
              <div className="bio-layer__center" aria-hidden="true" />
              <div className="bio-layer__right bio-text__description">
                <p>
                  Soy ingeniero de sistemas con una sólida base tanto en
                  frontend como en backend. Desarrollo de interfaces modernas y
                  modulares, construir soluciones completas de extremo a
                  extremo.
                </p>
                <p>
                  A lo largo de mi carrera he desarrollado y optimizado
                  aplicaciones web administrativas, dashboards conectados a
                  servicios backend, y hasta aplicaciones de streaming
                  multiplataforma para Smart TV.
                </p>

                <ArrowLink href="#work" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
