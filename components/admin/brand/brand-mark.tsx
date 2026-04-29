import * as React from "react";

interface Props {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * The "About a Girl" mark, rendered as an <img> rather than next/image so
 * that it works inside Payload's React Server Components admin tree
 * (which is rendered outside Next's image optimization pipeline).
 */
export function BrandMark({ size = 36, className, animated = false }: Props) {
  return (
    <span
      className={`om-brand-mark${animated ? " is-animated" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt=""
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </span>
  );
}
