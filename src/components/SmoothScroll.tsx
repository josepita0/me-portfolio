import { useEffect } from 'react';
import React from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '../lib/lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
      document.documentElement.classList.add('lenis-reduced-motion');
      return;
    }

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      autoRaf: false,
    });

    setLenisInstance(lenis);
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    document.documentElement.classList.add('lenis', 'lenis-smooth');
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      setLenisInstance(null);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  return null;
}
