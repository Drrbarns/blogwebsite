import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "You're on the list",
  description: "Thanks for subscribing to Ontario.",
  path: "/newsletter/thanks",
  noIndex: true,
});

export default function NewsletterThanks() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center pt-32 pb-16">
      <div className="max-w-xl text-center px-4">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
          You’re in ✨
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          Check your inbox
        </h1>
        <p className="text-muted text-lg mt-5">
          We’ve sent a confirmation link to the email you entered. Click it to confirm your
          subscription and you’ll start receiving our Tuesday dispatch.
        </p>
        <Link
          href="/"
          className="inline-flex mt-8 items-center px-6 py-3 rounded-full bg-foreground text-white font-semibold text-sm"
        >
          Back to homepage
        </Link>
      </div>
    </section>
  );
}
