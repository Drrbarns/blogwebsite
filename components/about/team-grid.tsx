import { SafeImage } from "@/components/shared/safe-image";
import { RevealStagger, RevealItem, SectionReveal } from "@/components/shared/section-reveal";
import type { TeamMember } from "@/types";

interface TeamGridProps {
  title?: string;
  description?: string;
  members: TeamMember[];
}

export function TeamGrid({
  title = "Our Professionals",
  description = "The people who keep the press running, the design tight and every story shipping on time.",
  members,
}: TeamGridProps) {
  if (!members.length) return null;
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <SectionReveal className="mb-10 lg:mb-14 max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground mb-4">
          {title}
        </h2>
        <p className="text-[15px] text-muted leading-relaxed">{description}</p>
      </SectionReveal>

      <RevealStagger
        className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6"
        stagger={0.06}
      >
        {members.map((member) => (
          <RevealItem key={member.id}>
            <article className="group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 mb-4">
                <SafeImage
                  src={member.image}
                  alt={member.name}
                  fill
                  fallback="/images/placeholder-portrait.svg"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-display text-lg lg:text-xl font-bold tracking-tight text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-muted">{member.role}</p>
            </article>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
