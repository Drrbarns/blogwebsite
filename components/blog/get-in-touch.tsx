import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionReveal } from "@/components/shared/section-reveal";

interface GetInTouchProps {
  heading?: string;
  label?: string;
  imageUrl?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
}

export function GetInTouch({
  heading = "Get In Touch",
  label = "Available for Work",
  imageUrl,
  ctaLabel = "Get in Touch",
  ctaHref = "/contact",
}: GetInTouchProps = {}) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <SectionReveal className="relative w-full aspect-[16/6] md:aspect-[16/5] rounded-2xl lg:rounded-3xl overflow-hidden group">
        <SafeImage
          src={imageUrl ?? null}
          alt={heading}
          fill
          fallback="/images/placeholder-banner.svg"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          sizes="1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400" />
            </span>
            <span className="text-sm font-semibold text-white/85 uppercase tracking-wider">
              {label}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            {heading}
          </h2>
          <Link
            href={ctaHref}
            className="inline-flex items-center px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors shadow-lg shadow-red-500/25"
          >
            {ctaLabel}
          </Link>
        </div>
      </SectionReveal>
    </section>
  );
}
