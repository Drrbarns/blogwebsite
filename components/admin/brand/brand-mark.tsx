import * as React from "react";

interface Props {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function BrandMark({ size = 36, className, animated = true }: Props) {
  return (
    <span
      className={`om-brand-mark${animated ? " is-animated" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="om-brand-grad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="55%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="om-brand-grad-soft" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="rgba(124,58,237,0.18)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill="url(#om-brand-grad)"
        />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill="url(#om-brand-grad-soft)"
        />
        <path
          d="M22 20 L22 44 M22 20 L34 20 C40 20 44 24 44 30 C44 36 40 40 34 40 L26 40 M30 40 L44 44"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="50" cy="14" r="3" fill="#fde68a" />
      </svg>
    </span>
  );
}
