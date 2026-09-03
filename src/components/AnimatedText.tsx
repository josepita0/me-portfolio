import React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ");
  const ref = React.useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="contact-section__description-word"
          initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(4px)" }}
          transition={{
            opacity: { duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : delay + index * 0.08 },
            y: { duration: 0.7, ease: EASE, delay: reduceMotion ? 0 : delay + index * 0.08 },
            filter: { duration: 0.8, ease: EASE, delay: reduceMotion ? 0 : delay + index * 0.08 },
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </p>
  );
}
