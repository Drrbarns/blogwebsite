"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";
import type { BlogPost } from "@/types";

interface HeroCarouselProps {
  posts: BlogPost[];
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (paused || posts.length <= 1 || reduce) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, paused, posts.length, reduce]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const post = posts[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "8%" : "-8%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-8%" : "8%",
      opacity: 0,
    }),
  };

  if (!posts.length) return null;

  return (
    <section
      className="relative w-full max-w-[1280px] mx-auto px-4 lg:px-8 pt-24 lg:pt-28"
      aria-label="Featured articles"
      role="region"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6.5] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl shadow-black/[0.06]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={post.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              fallback="/images/placeholder-cover.svg"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14 z-10">
          <Link href={`/blog/${post.slug}`} className="block max-w-xl group">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                  {post.category.slug === "ai" ? "AI" : post.category.name}
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.15] mb-4 tracking-tight group-hover:underline decoration-white/30 underline-offset-4">
              {post.title}
            </h2>

            <p className="text-sm md:text-base text-white/70 font-medium mb-3">
              {post.author.name} on {formatDate(post.publishedAt)}
            </p>

            <p className="hidden md:block text-sm md:text-[15px] text-white/60 leading-relaxed max-w-md">
              {post.excerpt}
            </p>
          </Link>

          <div className="flex items-center gap-3 mt-8">
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-2 z-10">
          {posts.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                idx === current
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
