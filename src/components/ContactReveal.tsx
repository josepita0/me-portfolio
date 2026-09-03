import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ContactReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <div ref={ref} className="contact-reveal">
      <motion.div
        className="contact-reveal__inner"
        initial={reduceMotion ? false : { opacity: 0, y: 40, filter: "blur(12px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(12px)" }}
        transition={{
          opacity: { duration: 0.8, ease: EASE },
          y: { duration: 1.0, ease: EASE },
          filter: { duration: 1.2, ease: EASE },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
