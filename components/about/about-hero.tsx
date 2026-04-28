import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionReveal } from "@/components/shared/section-reveal";

interface AboutHeroProps {
  breadcrumbLabel?: string;
  headingHighlight?: string;
  headingRest?: string;
}

export function AboutHero({
  breadcrumbLabel = "About Us",
  headingHighlight = "The Story",
  headingRest = "Behind the Stories",
}: AboutHeroProps = {}) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 pt-28 lg:pt-32 pb-8 lg:pb-12">
      <SectionReveal>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 text-sm text-muted mb-6"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground">{breadcrumbLabel}</span>
        </nav>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05] text-center">
          <span className="text-red-500">{headingHighlight}</span>{" "}
          <span className="text-foreground">{headingRest}</span>
        </h1>
      </SectionReveal>
    </section>
  );
}
