import { SafeImage } from "@/components/shared/safe-image";
import { SectionReveal } from "@/components/shared/section-reveal";
import type { BrandLogo } from "@/types";

type BrandWithLogo = BrandLogo & { logoUrl?: string | null; href?: string | null };

interface BrandsStripProps {
  brands: BrandWithLogo[];
  heading?: string;
}

const brandIcons: Record<string, React.ReactNode> = {
  Cactus: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M7 21V10a2 2 0 0 1 2-2h0V6a3 3 0 1 1 6 0v2h0a2 2 0 0 1 2 2v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14v4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Greenish: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 3c-4 0-8 3-8 9 0 4 3 8 8 8s8-4 8-8c0-6-4-9-8-9Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v12M8 12h8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Sitemark: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M4 12l4-6 4 6 4-6 4 6-4 6-4-6-4 6-4-6Z" fill="currentColor" />
    </svg>
  ),
  luminous: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Hamilton: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M6 4l6 4 6-4v16l-6-4-6 4V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  KOBE: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M4 12c3-5 6-8 8-8s5 3 8 8c-3 5-6 8-8 8s-5-3-8-8Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  ),
};

function DefaultBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BrandMark({ brand }: { brand: BrandWithLogo }) {
  if (brand.logoUrl) {
    return (
      <span className="relative w-7 h-7">
        <SafeImage
          src={brand.logoUrl}
          alt={brand.name}
          fill
          sizes="28px"
          className="object-contain"
        />
      </span>
    );
  }
  return brandIcons[brand.name] ?? <DefaultBrandIcon />;
}

export function BrandsStrip({ brands, heading }: BrandsStripProps) {
  if (!brands.length) return null;
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <SectionReveal>
        {heading && (
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted mb-7">
            {heading}
          </p>
        )}
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between gap-8 lg:gap-12 min-w-max">
            {brands.map((brand) => {
              const inner = (
                <span className="flex items-center gap-2.5 text-muted-foreground/70 hover:text-foreground transition-colors">
                  <BrandMark brand={brand} />
                  <span className="font-display text-xl lg:text-2xl font-semibold tracking-tight whitespace-nowrap">
                    {brand.name}
                  </span>
                </span>
              );
              return brand.href ? (
                <a
                  key={brand.id}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={brand.id}>{inner}</div>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
