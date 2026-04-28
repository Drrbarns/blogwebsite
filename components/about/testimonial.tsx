"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";
import type { TestimonialItem } from "@/types";

interface TestimonialProps {
  items: TestimonialItem[];
  heading?: string;
}

export function Testimonial({ items, heading }: TestimonialProps) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const item = items[index];

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      {heading && (
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-8">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-5 lg:gap-6 items-stretch">
        <div className="relative aspect-[4/3] lg:aspect-auto rounded-2xl lg:rounded-3xl overflow-hidden bg-stone-200 min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <SafeImage
                src={item.image}
                alt={item.author.name}
                fill
                fallback="/images/placeholder-cover.svg"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 640px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-stone-100 rounded-2xl lg:rounded-3xl p-8 lg:p-12 flex flex-col justify-center min-h-[340px]">
          <div className="font-display text-[72px] lg:text-[96px] leading-none text-red-500 mb-4">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-lg lg:text-xl xl:text-2xl font-semibold text-foreground leading-snug tracking-tight mb-8 max-w-md">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-200">
                  <SafeImage
                    src={item.author.avatar}
                    alt={item.author.name}
                    fill
                    fallback="/images/avatar.svg"
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {item.author.name}
                  </div>
                  {item.author.role && (
                    <div className="text-[11px] font-bold uppercase tracking-widest text-muted">
                      {item.author.role}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="flex items-center gap-2 mt-8">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-foreground" : "w-2 bg-stone-300"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
