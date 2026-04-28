"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const height = doc.scrollHeight - doc.clientHeight;
      setValue(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none"
    >
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
