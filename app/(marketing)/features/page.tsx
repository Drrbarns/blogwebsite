import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { Newsletter } from "@/components/home/newsletter";
import {
  RevealItem,
  RevealStagger,
  SectionReveal,
} from "@/components/shared/section-reveal";
import { pickIcon } from "@/components/shared/icon-picker";
import { getFeaturesPage } from "@/lib/cms";
import { pickMediaUrlOrNull } from "@/lib/cms/transforms";

export const revalidate = 60;

interface PillarItem {
  icon?: string;
  title: string;
  description: string;
}
interface CtaItem {
  label: string;
  url: string;
  style: "primary" | "secondary";
}
interface ChecklistItem {
  label: string;
}

const DEFAULT_PILLARS: PillarItem[] = [
  {
    icon: "Sparkles",
    title: "God-tier SEO engine",
    description:
      "Yoast-style scoring, SERP + Twitter previews, schema validation, IndexNow pings, canonical middleware and auto-internal-linking — all built-in.",
  },
  {
    icon: "LayoutGrid",
    title: "Page builder + blocks",
    description:
      "Stack polished blocks (Hero, Feature grid, CTA, FAQ, Split, Video…) to build pages without code. Lexical rich-text for long-form.",
  },
  {
    icon: "Bot",
    title: "AI assistance",
    description:
      "Auto-generated alt text on upload, internal-link suggestions, and a writing assistant for titles, excerpts and outlines.",
  },
  {
    icon: "Workflow",
    title: "Editorial workflow",
    description:
      "Drafts, versions, autosave, scheduled publishing, live preview and role-based access control.",
  },
  {
    icon: "Gauge",
    title: "Next.js 16 performance",
    description:
      "Incremental static regeneration, on-demand revalidation, Turbopack dev, and next/image with Supabase-hosted media.",
  },
  {
    icon: "Shield",
    title: "Publish quality gate",
    description:
      "Enforce a minimum SEO score, require alt text and valid schema before publishing — configurable per brand.",
  },
];

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { label: "Dynamic generateMetadata per page" },
  { label: "Article, Breadcrumb, FAQ & Person JSON-LD" },
  { label: "Multi-sitemap + RSS / Atom / JSON feeds" },
  { label: "Slug history 301 redirects" },
  { label: "IndexNow ping on publish (Bing, Yandex)" },
  { label: "Auto OG image generation per post" },
  { label: "Broken link checker cron" },
  { label: "404 logging + top-paths dashboard" },
  { label: "Canonical host + trailing-slash middleware" },
  { label: "Reading-time + Table-of-Contents auto-extraction" },
];

const DEFAULT_TOOLS: PillarItem[] = [
  { icon: "BookOpen", title: "Rich Lexical editor", description: "Headings, callouts, code, embeds, uploads." },
  { icon: "FileText", title: "Page collection", description: "Reusable blocks, nested SEO fields, live preview." },
  { icon: "MessageSquare", title: "Comments + moderation", description: "Threaded discussions with email alerts." },
  { icon: "Mail", title: "Newsletter", description: "Double opt-in subscribers, broadcasts via Resend." },
  { icon: "Search", title: "Site search", description: "Typeahead ⌘K, dedicated /search results view." },
  { icon: "Globe", title: "Hreflang + i18n", description: "Payload localization + per-locale sitemaps." },
  { icon: "LineChart", title: "First-party analytics", description: "Privacy-safe pageview tracker + dashboard." },
  { icon: "BarChart3", title: "Per-post insights", description: "Score trend, reading time, top referrers." },
  { icon: "Rocket", title: "One-click deploy", description: "Vercel + Supabase, env-driven, migrations on build." },
];

export async function generateMetadata() {
  const features = await getFeaturesPage();
  return generatePageMetadata({
    title: features?.seo?.title ?? "Features",
    description:
      features?.seo?.description ??
      "Everything you need to run a premium editorial site — a God-tier SEO engine, a WordPress-grade CMS, AI assistance, comments, newsletter, and first-party analytics.",
    path: "/features",
    ogImage: pickMediaUrlOrNull(features?.seo?.ogImage as never) ?? undefined,
  });
}

export default async function FeaturesPage() {
  const data = await getFeaturesPage();

  const eyebrow = data?.hero?.eyebrow ?? "What's inside";
  const heading =
    data?.hero?.heading ??
    "The blog platform your editors actually want to use.";
  const subheading =
    data?.hero?.subheading ??
    "A WordPress-grade CMS, a God-tier SEO engine and a front-end engineered for speed — all on Next.js 16 and Supabase.";

  const ctas: CtaItem[] =
    (data?.hero?.ctas?.length ?? 0) > 0
      ? data!.hero!.ctas!
          .filter((c) => c?.label && c?.url)
          .map((c) => ({
            label: String(c!.label),
            url: String(c!.url),
            style: (c!.style ?? "primary") as "primary" | "secondary",
          }))
      : [
          { label: "Open the CMS", url: "/admin", style: "primary" },
          { label: "See it in action →", url: "/blog", style: "secondary" },
        ];

  const pillars: PillarItem[] =
    (data?.pillars?.items?.length ?? 0) > 0
      ? data!.pillars!.items!
          .filter((p) => p?.title && p?.description)
          .map((p) => ({
            icon: p!.icon,
            title: String(p!.title),
            description: String(p!.description),
          }))
      : DEFAULT_PILLARS;

  const checklist: ChecklistItem[] =
    (data?.seoChecklist?.items?.length ?? 0) > 0
      ? data!.seoChecklist!.items!
          .filter((c) => c?.label)
          .map((c) => ({ label: String(c!.label) }))
      : DEFAULT_CHECKLIST;

  const tools: PillarItem[] =
    (data?.tools?.items?.length ?? 0) > 0
      ? data!.tools!.items!
          .filter((t) => t?.title && t?.description)
          .map((t) => ({
            icon: t!.icon,
            title: String(t!.title),
            description: String(t!.description),
          }))
      : DEFAULT_TOOLS;

  const checklistEyebrow = data?.seoChecklist?.eyebrow ?? "SEO, by default";
  const checklistHeading =
    data?.seoChecklist?.heading ??
    "We shipped the checklist so you don’t have to.";
  const checklistDescription =
    data?.seoChecklist?.description ??
    "Every post passes through a scoring engine, a schema validator, and an IndexNow ping — before a human clicks publish. Bring the content; we’ll bring the rankings.";
  const checklistCtaLabel = data?.seoChecklist?.ctaLabel ?? "Read the blog";
  const checklistCtaUrl = data?.seoChecklist?.ctaUrl ?? "/blog";

  const toolsEyebrow = data?.tools?.eyebrow ?? "Every tool, batteries included";
  const toolsHeading =
    data?.tools?.heading ?? "Everything you’d normally bolt on, already here.";

  return (
    <>
      <section className="pt-32 md:pt-40">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold tracking-widest uppercase text-stone-700 mb-5">
              <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
              {heading}
            </h1>
            <p className="text-lg md:text-xl text-muted mt-6 max-w-2xl mx-auto">
              {subheading}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {ctas.map((cta) => (
                <Link
                  key={cta.url + cta.label}
                  href={cta.url}
                  className={
                    cta.style === "primary"
                      ? "inline-flex items-center px-6 py-3 rounded-full bg-foreground text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                      : "inline-flex items-center px-6 py-3 rounded-full bg-white border border-stone-200 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors"
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <RevealStagger
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            stagger={0.06}
          >
            {pillars.map((pillar) => {
              const Icon = pickIcon(pillar.icon);
              return (
                <RevealItem
                  key={pillar.title}
                  className="rounded-3xl p-7 bg-white border border-stone-200/80 hover:shadow-lg hover:shadow-black/[0.04] transition-shadow hover:-translate-y-0.5 duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-muted text-[15px] leading-relaxed">
                    {pillar.description}
                  </p>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <SectionReveal className="rounded-[32px] bg-stone-900 text-white p-10 md:p-16 grid md:grid-cols-2 gap-10 items-start overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-3">
                {checklistEyebrow}
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold">
                {checklistHeading}
              </h2>
              <p className="text-white/70 mt-5 text-lg leading-relaxed">
                {checklistDescription}
              </p>
              <Link
                href={checklistCtaUrl}
                className="inline-flex mt-7 items-center px-6 py-3 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-stone-100 transition-colors"
              >
                {checklistCtaLabel}
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 relative">
              {checklist.map((c) => (
                <li
                  key={c.label}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm hover:bg-white/10 transition-colors"
                >
                  <Check className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <SectionReveal className="max-w-2xl mb-12">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-3">
              {toolsEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {toolsHeading}
            </h2>
          </SectionReveal>
          <RevealStagger
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            stagger={0.04}
          >
            {tools.map((tool) => {
              const Icon = pickIcon(tool.icon);
              return (
                <RevealItem
                  key={tool.title}
                  className="p-6 rounded-2xl border border-stone-200/80 bg-white hover:shadow-md hover:shadow-black/[0.03] transition-shadow"
                >
                  <Icon className="w-5 h-5 text-accent mb-4" />
                  <div className="font-semibold text-foreground">{tool.title}</div>
                  <div className="text-sm text-muted mt-1">{tool.description}</div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
