import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionReveal } from "@/components/shared/section-reveal";

interface ContactHeroProps {
  breadcrumbLabel?: string;
  heading?: string;
  imageUrl?: string | null;
}

export function ContactHero({
  breadcrumbLabel = "Contact Us",
  heading = "Contact Us",
  imageUrl,
}: ContactHeroProps = {}) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 pt-28 lg:pt-32">
      <SectionReveal>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 text-sm text-muted mb-5"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground">{breadcrumbLabel}</span>
        </nav>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05] text-center mb-10 lg:mb-12">
          {heading}
        </h1>
      </SectionReveal>

      <SectionReveal className="relative w-full aspect-[16/6] md:aspect-[16/5] rounded-2xl lg:rounded-3xl overflow-hidden bg-stone-200 group">
        <SafeImage
          src={imageUrl}
          alt="Our office"
          fill
          priority
          fallback="/images/placeholder-banner.svg"
          className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.03]"
          sizes="1280px"
        />
      </SectionReveal>
    </section>
  );
}
