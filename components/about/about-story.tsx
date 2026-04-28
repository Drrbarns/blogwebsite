import Link from "next/link";
import { SectionReveal } from "@/components/shared/section-reveal";

interface AboutStoryProps {
  intro?: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_INTRO =
  "Welcome to a place for ideas, stories, and tips that spark curiosity. Whether you're here to learn, get inspired, or just enjoy a good read, you're in the right place.";

export function AboutStory({
  intro = DEFAULT_INTRO,
  paragraphs,
  ctaLabel = "Get in touch",
  ctaHref = "/contact",
}: AboutStoryProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <SectionReveal>
        <p className="font-display text-2xl md:text-3xl lg:text-[32px] font-bold text-foreground leading-snug tracking-tight max-w-5xl mb-10 lg:mb-14">
          {intro}
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div />
        <SectionReveal
          direction="left"
          className="space-y-5 text-[15px] text-muted leading-relaxed max-w-xl"
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="pt-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-foreground text-sm font-medium rounded-full transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
