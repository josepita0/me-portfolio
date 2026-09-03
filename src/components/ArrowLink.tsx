import { scrollToTarget } from "../lib/lenis";

interface Props {
  href: string;
  children?: string;
}

export default function ArrowLink({ href, children = "Palante" }: Props) {
  // Diagonal arrow pointing to the upper-right corner (↗) with a chevron tip.
  const arrowPath = "M6 14L14 6M14 6H9M14 6V11";

  return (
    <a
      className="arrow-link"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget(href);
      }}
      aria-label={`${children} — continue`}
    >
      <span className="arrow-link__label">{children}</span>
      <span className="arrow-link__icon" aria-hidden="true">
        {/* Separate arrows let the exit and entrance follow distinct offsets. */}
        <svg
          className="arrow-link__arrow arrow-link__arrow--exit"
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d={arrowPath}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="arrow-link__arrow arrow-link__arrow--enter"
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d={arrowPath}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
