"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { SearchDialog } from "@/components/search/search-dialog";

type NavItem = { label: string; href: string; external?: boolean | null };
type NavbarCtaLink = { label: string; href: string } | null;

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({
  links,
  brandName,
  brandLogoUrl,
}: {
  links?: NavItem[];
  /** Accepted for backwards compatibility but no longer rendered. */
  cta?: NavbarCtaLink;
  brandName?: string;
  brandLogoUrl?: string | null;
} = {}) {
  const navigation: NavItem[] = links && links.length ? links : DEFAULT_NAV;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          scrolled ? "py-2 px-4" : "py-4 px-4 lg:px-8"
        )}
      >
        <nav
          className={cn(
            "mx-auto max-w-[1280px] flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ease-out",
            scrolled
              ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-black/[0.04] border border-white/60"
              : "bg-white/95 backdrop-blur-sm shadow-md shadow-black/[0.03] border border-stone-200/50"
          )}
        >
          <Logo name={brandName} imageUrl={brandLogoUrl} />

          <ul className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="relative px-4 py-2 text-[15px] font-medium text-foreground/80 hover:text-foreground rounded-full transition-colors hover:bg-stone-100/80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("aboutagirl:open-search"))}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-white text-sm font-semibold rounded-full hover:bg-foreground/90 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-foreground/70 hover:text-foreground hover:bg-stone-100 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-stone-200/60 p-6 lg:hidden"
            >
              <ul className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-stone-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new Event("aboutagirl:open-search"));
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground text-white text-sm font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchDialog />
    </>
  );
}
