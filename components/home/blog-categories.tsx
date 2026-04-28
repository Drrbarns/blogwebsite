import Link from "next/link";
import { RevealItem, RevealStagger, SectionReveal } from "@/components/shared/section-reveal";
import type { Category } from "@/types";

interface BlogCategoriesProps {
  categories: Category[];
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  if (!categories.length) return null;
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <SectionReveal>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-8 lg:mb-10">
          Blog Categories
        </h2>
      </SectionReveal>

      <RevealStagger
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        stagger={0.04}
      >
        {categories.map((category) => (
          <RevealItem key={category.slug}>
            <Link
              href={`/blog?category=${category.slug}`}
              className="group flex items-center justify-center rounded-2xl p-8 lg:p-10 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: category.color || "#f5f5f4" }}
            >
              <span className="text-[15px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                {category.name}
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
