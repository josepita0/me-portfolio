import React, { useMemo, useRef } from "react";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const text =
  "De la idea al producto en producción. Desarrollo ágil, escalable y sin ruido: sistemas claros, código mantenible y resultados que funcionan en el mundo real.";
const words = text.split(" ");

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const band = useMemo(() => {
    const start = index / total;
    const end = start + (1 / total) * 1.6;
    return [start, Math.min(end, 1)] as const;
  }, [index, total]);
  const wordProgress = useTransform(progress, band, [0, 1], { clamp: true });
  // Motion requires hex color literals to interpolate; CSS variables like
  // var(--ink) are not animatable. Keep --ink for the static reduced-motion
  // branch below — only the scrub path needs the literal.
  const color = useTransform(wordProgress, [0, 1], ["#9c9c9c", "#111111"]);
  const opacity = useTransform(wordProgress, [0, 1], [0.25, 1]);

  return (
    <>
      {index > 0 ? " " : ""}
      <motion.span className="text-reveal__word" style={{ color, opacity }}>
        {word}
      </motion.span>
    </>
  );
}

export default function ScrollText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={sectionRef} className="text-reveal">
      <div className="text-reveal__sticky">
        <p className="text-reveal__paragraph" aria-hidden="true">
          {reduceMotion
            ? words.map((word, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? " " : ""}
                  <span
                    className="text-reveal__word"
                    style={{ color: "var(--ink)" }}
                  >
                    {word}
                  </span>
                </React.Fragment>
              ))
            : words.map((word, index) => (
                <Word
                  key={index}
                  word={word}
                  index={index}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
        </p>
      </div>
    </div>
  );
}
