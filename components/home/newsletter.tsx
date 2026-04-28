"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { SectionReveal } from "@/components/shared/section-reveal";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterProps {
  heading?: string;
  description?: string;
  ctaLabel?: string;
}

export function Newsletter({
  heading = "Subscribe to our Newsletter",
  description = "We'll send you a nice letter once a week. No spam, unsubscribe anytime.",
  ctaLabel = "Subscribe",
}: NewsletterProps = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok || res.redirected) {
        setStatus("success");
        setMessage("You're on the list! Check your inbox.");
        setEmail("");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Network hiccup — please try again.");
    }
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <SectionReveal className="border-t border-stone-200 pt-12 lg:pt-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-md">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
              {heading}
            </h2>
            <p className="text-[15px] text-muted leading-relaxed">{description}</p>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col w-full lg:w-auto gap-2"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 lg:w-[320px] px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow disabled:opacity-60"
                required
                disabled={status === "loading" || status === "success"}
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0 min-w-[140px]"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "success" && <Check className="w-4 h-4" />}
                {status === "success" ? "Subscribed" : ctaLabel}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {message && (
                <motion.p
                  key={message}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`text-[13px] ${status === "error" ? "text-red-600" : "text-emerald-600"}`}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>
      </SectionReveal>
    </section>
  );
}
