import { motion, useReducedMotion } from 'motion/react';
import React from 'react';
import { useState, type HTMLAttributes } from 'react';

interface RollingTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  text: string;
  reverse?: boolean;
  accessibleText?: string;
  /** Controlled hover state. When provided, the internal pointer handlers are disabled. */
  active?: boolean;
}

const transition = { type: 'spring' as const, duration: 0.4, bounce: 0 };

export default function RollingText({ text, reverse = false, accessibleText, className, active, ...props }: RollingTextProps) {
  const [hoverActive, setHoverActive] = useState(false);
  const isActive = active ?? hoverActive;
  const reduceMotion = useReducedMotion();
  const characters = Array.from(text);
  const visualText = characters.map((character) => (character === ' ' ? '\u00a0' : character));
  const interactionHandlers =
    active === undefined
      ? {
          onMouseEnter: () => setHoverActive(true),
          onMouseLeave: () => setHoverActive(false),
          onFocus: () => setHoverActive(true),
          onBlur: () => setHoverActive(false),
        }
      : {};
  const rolling = isActive && !reduceMotion;

  return (
    <span
      {...props}
      {...interactionHandlers}
      className={['rolling-text', className].filter(Boolean).join(' ')}
      aria-label={accessibleText ?? text}
    >
      <span className="rolling-text__sr-only">{accessibleText ?? text}</span>
      <span className="rolling-text__track" aria-hidden="true">
        {visualText.map((character, index) => {
          const order = reverse ? characters.length - index - 1 : index;
          const rollTransition = {
            ...transition,
            delay: rolling ? (order * 0.4 * 0.35) / Math.max(characters.length, 1) : 0,
          };
          const rollProps = {
            animate: { y: rolling ? '-1.2em' : '0em' },
            transition: rollTransition,
          };
          return (
            <span className="rolling-text__character" key={`${character}-${index}`}>
              <motion.span className="rolling-text__copy" {...rollProps}>
                {character}
              </motion.span>
              <motion.span className="rolling-text__copy rolling-text__copy--next" {...rollProps}>
                {character}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
