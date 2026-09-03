import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

export function scrollToTarget(target: string, options?: { offset?: number }) {
  // Find the target element - if multiple matches, use the visible one
  const elements = document.querySelectorAll(target);
  let element: Element | null = null;

  if (elements.length > 1) {
    // Find the visible element (has offsetParent)
    for (const el of elements) {
      if (el instanceof HTMLElement && el.offsetParent !== null) {
        element = el;
        break;
      }
    }
    // Fallback to first if none visible
    if (!element) {
      element = elements[0];
    }
  } else {
    element = elements[0] || null;
  }

  if (!element) return;

  if (!lenisInstance) {
    // Fallback to native scroll if Lenis is not ready
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  lenisInstance.scrollTo(element, {
    offset: options?.offset ?? 0,
    duration: 3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
}
