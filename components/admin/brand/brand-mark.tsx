import * as React from "react";

interface Props {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function BrandMark({ size = 36, className, animated = false }: Props) {
  return (
    <span
      className={`om-brand-mark${animated ? " is-animated" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="#1a1a1a"
        />
        <path
          d="M22 20 L22 44 M22 20 L34 20 C40 20 44 24 44 30 C44 36 40 40 34 40 L26 40 M30 40 L44 44"
          stroke="#fafaf9"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="50" cy="14" r="3.2" fill="#ea580c" />
      </svg>
    </span>
  );
}
