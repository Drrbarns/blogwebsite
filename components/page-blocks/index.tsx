import Image from "next/image";
import Link from "next/link";
import { LexicalContent } from "@/components/blog/lexical-renderer";
import { pickMediaUrl } from "@/lib/cms/transforms";

type Block = { blockType: string } & Record<string, unknown>;

/**
 * Maps Payload block-type discriminators to fully designed React components.
 * Each block is forgiving about missing fields — editors can stack them
 * without breaking the layout.
 */
export function PageBlocks({ blocks }: { blocks?: Block[] | null }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-24">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} first={i === 0} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, first }: { block: Block; first: boolean }) {
  switch (block.blockType) {
    case "hero":
      return <HeroBlock {...(block as HeroProps)} first={first} />;
    case "featureGrid":
      return <FeatureGridBlock {...(block as FeatureGridProps)} />;
    case "stats":
      return <StatsBlock {...(block as StatsProps)} />;
    case "logoCloud":
      return <LogoCloudBlock {...(block as LogoCloudProps)} />;
    case "testimonials":
      return <TestimonialsBlock {...(block as TestimonialsProps)} />;
    case "faq":
      return <FAQBlock {...(block as FAQProps)} />;
    case "cta":
      return <CTABlock {...(block as CTAProps)} />;
    case "video":
      return <VideoBlock {...(block as VideoProps)} />;
    case "split":
      return <SplitBlock {...(block as SplitProps)} />;
    case "richText":
      return <RichTextBlock {...(block as RichTextProps)} />;
    case "newsletter":
      return <NewsletterBlock {...(block as NewsletterProps)} />;
    default:
      return null;
  }
}

// ── Hero ────────────────────────────────────────────────────────────────────
interface HeroProps extends Block {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  alignment?: "left" | "center";
  image?: { url?: string } | string;
  cta?: { label: string; url: string; style?: string }[];
}

function HeroBlock({ eyebrow, heading, subheading, alignment = "left", image, cta = [], first }: HeroProps & { first?: boolean }) {
  const src = pickMediaUrl(image as never, "hero");
  return (
    <section className={first ? "pt-32 md:pt-40" : "pt-16"}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={alignment === "center" ? "text-center mx-auto max-w-2xl" : ""}>
          {eyebrow && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold tracking-wide uppercase text-stone-700 mb-4">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            {heading}
          </h1>
          {subheading && (
            <p className="text-lg md:text-xl text-muted mt-5 max-w-xl">{subheading}</p>
          )}
          {cta.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-7">
              {cta.map((c) => (
                <Link
                  key={c.url}
                  href={c.url}
                  className={ctaClass(c.style)}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {image ? (
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 order-first md:order-last">
            <Image src={src} alt={heading} fill className="object-cover" sizes="(min-width: 1024px) 600px, 100vw" priority={first} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

const ctaClass = (style?: string) => {
  const base = "inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-colors";
  if (style === "secondary") return `${base} bg-white border border-stone-200 text-foreground hover:bg-stone-50`;
  if (style === "ghost") return `${base} text-foreground hover:bg-stone-100`;
  return `${base} bg-foreground text-white hover:bg-foreground/90`;
};

// ── Feature grid ────────────────────────────────────────────────────────────
interface FeatureGridProps extends Block {
  eyebrow?: string;
  heading?: string;
  description?: string;
  columns?: number;
  features?: { title: string; description: string; icon?: string; image?: { url?: string } | string }[];
}

function FeatureGridBlock({ eyebrow, heading, description, columns = 3, features = [] }: FeatureGridProps) {
  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {(eyebrow || heading || description) && (
          <div className="max-w-2xl mb-12">
            {eyebrow && (
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-3">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {heading}
              </h2>
            )}
            {description && <p className="text-lg text-muted mt-4">{description}</p>}
          </div>
        )}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, Math.min(4, columns))}, minmax(0, 1fr))`,
          }}
        >
          {features.map((f, i) => (
            <article
              key={i}
              className="rounded-3xl p-7 bg-white border border-stone-200/80 hover:shadow-lg hover:shadow-black/[0.04] transition-shadow"
            >
              {f.image ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-stone-100">
                  <Image src={pickMediaUrl(f.image as never, "card")} alt={f.title} fill className="object-cover" sizes="400px" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-5 text-xl font-bold">
                  {f.icon?.[0] ?? "•"}
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────
interface StatsProps extends Block {
  heading?: string;
  items?: { value: string; label: string; description?: string }[];
}

function StatsBlock({ heading, items = [] }: StatsProps) {
  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {heading && <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">{heading}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-200 rounded-3xl overflow-hidden">
          {items.map((s, i) => (
            <div key={i} className="bg-white p-8">
              <div className="font-display text-4xl md:text-5xl font-extrabold text-foreground">{s.value}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground/70">{s.label}</div>
              {s.description && <div className="mt-2 text-muted text-sm">{s.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Logo cloud ──────────────────────────────────────────────────────────────
interface LogoCloudProps extends Block {
  heading?: string;
  logos?: { name: string; image?: { url?: string } | string; url?: string }[];
}

function LogoCloudBlock({ heading, logos = [] }: LogoCloudProps) {
  return (
    <section className="bg-stone-50/60 py-16 -mx-4 lg:-mx-8 rounded-3xl">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
        {heading && (
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60 mb-10">{heading}</div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16">
          {logos.map((logo, i) => (
            <div key={i} className="text-xl font-bold tracking-tight opacity-70 hover:opacity-100 transition-opacity">
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ────────────────────────────────────────────────────────────
interface TestimonialsProps extends Block {
  heading?: string;
  items?: { quote: string; authorName: string; authorRole?: string; avatar?: { url?: string } | string }[];
}

function TestimonialsBlock({ heading, items = [] }: TestimonialsProps) {
  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {heading && <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">{heading}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <figure
              key={i}
              className="rounded-3xl p-7 bg-white border border-stone-200/80 flex flex-col gap-5"
            >
              <blockquote className="text-lg leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto">
                {t.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100">
                    <Image src={pickMediaUrl(t.avatar as never, "thumbnail")} alt={t.authorName} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-semibold">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{t.authorName}</div>
                  {t.authorRole && <div className="text-sm text-muted">{t.authorRole}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────
interface FAQProps extends Block {
  heading?: string;
  description?: string;
  items?: { question: string; answer: string }[];
  emitJsonLd?: boolean;
}

function FAQBlock({ heading, description, items = [], emitJsonLd }: FAQProps) {
  return (
    <section>
      <div className="max-w-[880px] mx-auto px-4 lg:px-8">
        {heading && (
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{heading}</h2>
            {description && <p className="text-muted mt-3 text-lg">{description}</p>}
          </div>
        )}
        <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
          {items.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
                <span className="font-semibold text-lg">{item.question}</span>
                <span className="text-2xl text-foreground/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-muted mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
        {emitJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: items.map((i) => ({
                  "@type": "Question",
                  name: i.question,
                  acceptedAnswer: { "@type": "Answer", text: i.answer },
                })),
              }),
            }}
          />
        )}
      </div>
    </section>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────────────
interface CTAProps extends Block {
  heading: string;
  description?: string;
  primary?: { label?: string; url?: string };
  secondary?: { label?: string; url?: string };
  variant?: "accent" | "dark" | "light";
  image?: { url?: string } | string;
}

function CTABlock({ heading, description, primary, secondary, variant = "accent", image }: CTAProps) {
  const tones: Record<string, string> = {
    accent: "bg-gradient-to-br from-[#fb923c] to-[#f97316] text-white",
    dark: "bg-foreground text-white",
    light: "bg-white text-foreground border border-stone-200/80",
  };
  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className={`rounded-[32px] p-8 md:p-14 ${tones[variant]} grid md:grid-cols-2 gap-8 items-center overflow-hidden relative`}>
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">{heading}</h2>
            {description && <p className="mt-4 text-lg opacity-90">{description}</p>}
            <div className="flex flex-wrap gap-3 mt-7">
              {primary?.label && primary.url && (
                <Link
                  href={primary.url}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  {primary.label}
                </Link>
              )}
              {secondary?.label && secondary.url && (
                <Link
                  href={secondary.url}
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm border border-white/40 hover:bg-white/10 transition-colors"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
          {image && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={pickMediaUrl(image as never, "card")} alt={heading} fill className="object-cover" sizes="600px" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Video ───────────────────────────────────────────────────────────────────
interface VideoProps extends Block {
  provider: "youtube" | "vimeo";
  id: string;
  caption?: string;
}

function VideoBlock({ provider, id, caption }: VideoProps) {
  const src = provider === "youtube" ? `https://www.youtube.com/embed/${id}` : `https://player.vimeo.com/video/${id}`;
  return (
    <section>
      <div className="max-w-[1080px] mx-auto px-4 lg:px-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black">
          <iframe
            src={src}
            title={caption ?? "Embedded video"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {caption && <p className="text-sm text-muted text-center mt-3">{caption}</p>}
      </div>
    </section>
  );
}

// ── Split ───────────────────────────────────────────────────────────────────
interface SplitProps extends Block {
  eyebrow?: string;
  heading: string;
  body?: unknown;
  image: { url?: string } | string;
  imagePosition?: "left" | "right";
  cta?: { label?: string; url?: string };
}

function SplitBlock({ eyebrow, heading, body, image, imagePosition = "right", cta }: SplitProps) {
  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={imagePosition === "left" ? "md:order-2" : ""}>
          {eyebrow && (
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-3">{eyebrow}</div>
          )}
          <h2 className="font-display text-3xl md:text-4xl font-bold">{heading}</h2>
          {Boolean(body) && (
            <div className="text-muted mt-4 text-lg leading-relaxed prose prose-stone max-w-none">
              <LexicalContent data={body} />
            </div>
          )}
          {cta?.url && cta.label && (
            <Link
              href={cta.url}
              className="inline-flex mt-6 items-center px-6 py-3 rounded-full bg-foreground text-white font-semibold text-sm"
            >
              {cta.label}
            </Link>
          )}
        </div>
        <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 ${imagePosition === "left" ? "md:order-1" : ""}`}>
          <Image src={pickMediaUrl(image as never, "wide")} alt={heading} fill className="object-cover" sizes="600px" />
        </div>
      </div>
    </section>
  );
}

// ── Rich text ───────────────────────────────────────────────────────────────
interface RichTextProps extends Block {
  width?: "narrow" | "wide";
  body?: unknown;
}

function RichTextBlock({ width = "narrow", body }: RichTextProps) {
  const maxW = width === "wide" ? "max-w-4xl" : "max-w-2xl";
  return (
    <section>
      <div className={`${maxW} mx-auto px-4 lg:px-8 prose prose-stone prose-lg`}>
        <LexicalContent data={body} />
      </div>
    </section>
  );
}

// ── Newsletter ──────────────────────────────────────────────────────────────
interface NewsletterProps extends Block {
  heading?: string;
  subheading?: string;
  placeholder?: string;
  buttonLabel?: string;
}

function NewsletterBlock({ heading, subheading, placeholder, buttonLabel }: NewsletterProps) {
  return (
    <section>
      <div className="max-w-[1080px] mx-auto px-4 lg:px-8">
        <div className="rounded-[32px] bg-stone-900 text-white p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">
              {heading ?? "Get editorial drops"}
            </h2>
            <p className="mt-4 text-white/70">{subheading ?? "Curated stories in your inbox every Tuesday."}</p>
          </div>
          <form className="flex gap-2" action="/api/newsletter" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder={placeholder ?? "you@example.com"}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white"
            />
            <button type="submit" className="px-6 py-3.5 rounded-full bg-white text-foreground font-semibold text-sm">
              {buttonLabel ?? "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
