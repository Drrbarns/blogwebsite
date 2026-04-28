"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { SectionReveal } from "@/components/shared/section-reveal";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIAL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  twitter: XIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

interface ContactSectionProps {
  email?: string;
  phone?: string;
  address?: string;
  socials?: Record<string, string | undefined>;
  formHeading?: string;
  submitLabel?: string;
  successMessage?: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function ContactSection({
  email = "hello@ontario.com",
  phone = "+1 (555) 010-2030",
  address,
  socials = {},
  formHeading = "Drop Us a Line",
  submitLabel = "Submit request",
  successMessage = "Thanks — we’ll be in touch soon.",
}: ContactSectionProps = {}) {
  const [name, setName] = useState("");
  const [emailField, setEmailField] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const socialEntries = Object.entries(socials).filter(([, href]) => Boolean(href));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: emailField, message: body }),
      });

      if (res.ok) {
        setStatus("success");
        setFeedback(successMessage);
        setName("");
        setEmailField("");
        setBody("");
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus("error");
        setFeedback(j.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network hiccup — please try again.");
    }
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
        <SectionReveal direction="right">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
                Email Address
              </h3>
              <a
                href={`mailto:${email}`}
                className="text-base font-semibold text-foreground hover:text-red-500 transition-colors break-all"
              >
                {email}
              </a>
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
                Phone Number
              </h3>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="text-base font-semibold text-foreground hover:text-red-500 transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {address && (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
                  How to Find Us
                </h3>
                <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-line">
                  {address}
                </p>
              </div>
            )}
            {socialEntries.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3">
                  Social
                </h3>
                <div className="flex items-center gap-2">
                  {socialEntries.map(([platform, href]) => {
                    const Icon = SOCIAL_ICON[platform];
                    if (!Icon) return null;
                    return (
                      <a
                        key={platform}
                        href={href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-full text-foreground/60 hover:text-foreground hover:bg-stone-100 transition-colors"
                        aria-label={platform}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SectionReveal>

        <SectionReveal direction="left" className="bg-stone-50 rounded-2xl lg:rounded-3xl p-8 lg:p-10">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-8">
            {formHeading}
          </h2>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Name*"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
              />
              <input
                type="email"
                placeholder="E-mail*"
                required
                value={emailField}
                onChange={(e) => setEmailField(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
              />
            </div>

            <textarea
              placeholder="Message"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={status === "loading"}
              className="w-full px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow resize-none"
            />

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "success" && <Check className="w-4 h-4" />}
                {status === "success" ? "Sent" : submitLabel}
              </button>

              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.span
                    key={feedback}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className={`text-[13px] ${status === "error" ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {feedback}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </SectionReveal>
      </div>
    </section>
  );
}
