import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const transition = { type: "spring" as const, duration: 0.7, bounce: 0 };

export default function SocialIcon({ href, label, children }: SocialIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const rolling = isHovered && !reduceMotion;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="contact-section__socials-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className="contact-section__socials-icon">
        <motion.span
          className="contact-section__socials-icon-copy"
          animate={{ y: rolling ? "-100%" : "0%" }}
          transition={transition}
        >
          {children}
        </motion.span>
        <motion.span
          className="contact-section__socials-icon-copy contact-section__socials-icon-copy--next"
          animate={{ y: rolling ? "-100%" : "0%" }}
          transition={transition}
        >
          {children}
        </motion.span>
      </span>
    </a>
  );
}
