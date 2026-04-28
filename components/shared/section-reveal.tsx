"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "fade";

interface SectionRevealProps extends Omit<MotionProps, "children" | "initial" | "animate" | "viewport" | "transition"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  /** Distance, in pixels, the element travels before settling. */
  distance?: number;
  /** Re-trigger every time it scrolls back into view. Defaults to false. */
  repeat?: boolean;
  as?: "div" | "section" | "article" | "header" | "li" | "ul";
}

const offsetFor = (dir: Direction, dist: number) => {
  switch (dir) {
    case "up":
      return { y: dist };
    case "down":
      return { y: -dist };
    case "left":
      return { x: dist };
    case "right":
      return { x: -dist };
    default:
      return { y: 0 };
  }
};

/**
 * Reusable on-scroll reveal wrapper. Honors `prefers-reduced-motion` and
 * defaults to a subtle 24px lift with a 0.55s ease-out — calibrated so
 * every page feels alive without ever feeling janky.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 24,
  repeat = false,
  as = "div",
  ...rest
}: SectionRevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    return <MotionTag className={cn(className)}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, ...offsetFor(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child reveal. */
  stagger?: number;
  /** Initial delay before the first child reveals. */
  delay?: number;
  repeat?: boolean;
}

export function RevealStagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  repeat = false,
}: RevealStaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  distance = 18,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offsetFor(direction, distance) },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
