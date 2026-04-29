import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  name?: string;
  href?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  /** Compact = small mark only (used in tight spaces). */
  variant?: "default" | "compact";
}

const FALLBACK_LOGO = "/images/logo.png";

export function Logo({
  name = "About a Girl",
  href = "/",
  imageUrl,
  imageAlt,
  variant = "default",
}: LogoProps = {}) {
  const src = imageUrl || FALLBACK_LOGO;
  const isCompact = variant === "compact";

  return (
    <Link
      href={href}
      className="group inline-flex items-center"
      aria-label={`${name} — Home`}
    >
      <span
        className={`relative block ${
          isCompact ? "w-9 h-9" : "w-11 h-11 md:w-12 md:h-12"
        } transition-transform duration-300 group-hover:scale-[1.04]`}
      >
        <Image
          src={src}
          alt={imageAlt ?? name}
          fill
          sizes={isCompact ? "36px" : "(max-width: 768px) 44px, 48px"}
          className="object-contain"
          priority
        />
      </span>
    </Link>
  );
}
