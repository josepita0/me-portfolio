// Shared interactive ornament used across portfolio sections.
// Stickers can be dragged while preserving each section's entrance motion.
import { motion } from "motion/react";
import React from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Sticker({
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
  reduceMotion: boolean | null;
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <div className={`sticker sticker--${side}`} aria-hidden="true">
      <motion.div
        className="sticker__draggable"
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
        <div className="sticker__rotation">
          <svg viewBox={viewBox} role="presentation">
            {children}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
