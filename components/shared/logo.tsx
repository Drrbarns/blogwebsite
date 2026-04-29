import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  name?: string;
  href?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  /** Compact = small icon only (used in tight spaces). */
  variant?: "default" | "compact";
}

export function Logo({
  name = "About a Girl",
  href = "/",
  imageUrl,
  imageAlt,
  variant = "default",
}: LogoProps = {}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 group"
      aria-label={`${name} Home`}
    >
      {imageUrl ? (
        <span className="relative w-9 h-9 rounded-full overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-shadow ring-1 ring-stone-200/60">
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
      ) : (
        <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-[1.04] transition-all duration-300">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {variant !== "compact" && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          {name}
        </span>
      )}
    </Link>
  );
}
