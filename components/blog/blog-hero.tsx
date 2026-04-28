import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionReveal } from "@/components/shared/section-reveal";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogHeroProps {
  post: BlogPost;
}

export function BlogHero({ post }: BlogHeroProps) {
  const tags = post.categories || [post.category];

  return (
    <SectionReveal as="section" className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 pt-28 lg:pt-32 pb-4">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="rounded-[28px] bg-white border border-stone-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_60px_-12px_rgba(0,0,0,0.12)] transition-shadow p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-center">
            <div className="order-2 md:order-1">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-foreground/60 rounded-md"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-[32px] lg:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.15] mb-6 group-hover:text-accent transition-colors">
                {post.title}
              </h1>

              <p className="text-sm text-muted mb-5">
                {post.author.name} on {formatDate(post.publishedAt)}
              </p>

              <p className="text-[15px] text-muted/80 leading-relaxed max-w-lg">
                {post.excerpt}
              </p>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden bg-stone-100">
                <SafeImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}
