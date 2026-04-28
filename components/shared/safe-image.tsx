"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const PLACEHOLDER = "/images/placeholder-cover.svg";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  fallback?: string;
};

/**
 * Drop-in replacement for next/image that gracefully swaps to a local SVG
 * placeholder if the URL is empty, malformed, or fails to load.  Eliminates
 * the broken-image icon that used to flash when the CMS had no media.
 */
export function SafeImage({
  src,
  alt,
  fallback = PLACEHOLDER,
  ...rest
}: SafeImageProps) {
  const initial = src && src.length > 0 ? src : fallback;
  const [resolved, setResolved] = useState(initial);

  useEffect(() => {
    setResolved(src && src.length > 0 ? src : fallback);
  }, [src, fallback]);

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      onError={() => {
        if (resolved !== fallback) setResolved(fallback);
      }}
    />
  );
}
