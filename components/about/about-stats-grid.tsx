import { SafeImage } from "@/components/shared/safe-image";
import { SectionReveal } from "@/components/shared/section-reveal";
import type { Stat } from "@/types";

interface AboutStatsGridProps {
  heroImage?: string | null;
  heroImageAlt?: string;
  stats: Stat[];
}

export function AboutStatsGrid({
  heroImage,
  heroImageAlt = "Our story",
  stats,
}: AboutStatsGridProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        <SectionReveal
          direction="right"
          className="relative aspect-[4/5] md:aspect-auto md:row-span-2 rounded-2xl lg:rounded-3xl overflow-hidden bg-stone-200 group"
        >
          <SafeImage
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            fallback="/images/placeholder-portrait.svg"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </SectionReveal>

        <div className="flex flex-col gap-5 lg:gap-6">
          {stats.map((stat, idx) => {
            if (stat.variant === "image" && stat.image) {
              return (
                <SectionReveal
                  key={stat.id}
                  delay={0.05 * (idx + 1)}
                  className="relative aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden group"
                >
                  <SafeImage
                    src={stat.image}
                    alt={stat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/55 to-black/20" />
                  <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-between">
                    <div className="text-white font-display text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none">
                      {stat.value}
                    </div>
                    <div className="text-white/90 text-base lg:text-lg font-medium">
                      {stat.label}
                    </div>
                  </div>
                </SectionReveal>
              );
            }
            return (
              <SectionReveal
                key={stat.id}
                delay={0.05 * (idx + 1)}
                className="relative aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-red-500 via-red-500 to-orange-500 p-8 lg:p-10 flex flex-col justify-between shadow-lg shadow-red-500/15"
              >
                <div className="text-white font-display text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-white/90 text-base lg:text-lg font-medium">
                  {stat.label}
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
