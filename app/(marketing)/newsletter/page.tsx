import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "The Ontario Dispatch — Newsletter",
  description:
    "One email every Tuesday. The best new essays, interviews and product tear-downs, hand-picked by our editors.",
  path: "/newsletter",
});

const perks = [
  {
    title: "Tuesday-only cadence",
    description:
      "No endless drip campaigns. You’ll hear from us once a week — curated, short and useful.",
  },
  {
    title: "Essays before anyone else",
    description:
      "Subscribers receive new long-reads 48 hours before they hit the public feed.",
  },
  {
    title: "Creator-only perks",
    description:
      "Invitations to live critiques, subscriber Q&As and the occasional Figma/Notion template.",
  },
  {
    title: "Unsubscribe in one click",
    description:
      "Every email has a single-click opt-out. We’ll never share or sell your address.",
  },
];

export default function NewsletterLanding() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-20">
        <div className="max-w-[1080px] mx-auto px-4 lg:px-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            The Ontario Dispatch
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight">
            The smartest read in your inbox on Tuesdays.
          </h1>
          <p className="text-lg md:text-xl text-muted mt-6 max-w-2xl mx-auto">
            A hand-built weekly digest of the most interesting essays, interviews and
            products shaping design, tech and modern work.  2 minutes to read.
            Zero fluff.
          </p>

          <form
            action="/api/newsletter"
            method="POST"
            className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 px-5 py-4 rounded-full bg-white border border-stone-200 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-foreground text-white text-sm font-bold tracking-wide hover:bg-foreground/90 transition-colors"
            >
              Subscribe free
            </button>
          </form>
          <p className="mt-4 text-xs text-muted">
            By subscribing you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-stone-200 bg-white p-7"
              >
                <div className="font-display text-xl font-bold mb-3">{p.title}</div>
                <p className="text-[15px] text-muted leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
