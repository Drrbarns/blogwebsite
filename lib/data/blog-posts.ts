import type { BlogPost, TrendingItem } from "@/types";
import { aboutAGirlPosts } from "./posts";

/**
 * The /blog page slices the same source-of-truth post list (lib/data/posts.ts)
 * into its own surfaces: a hero card, a grid, a fresh strip and a trending list.
 *
 * Edit aboutAGirlPosts in posts.ts to add/remove/reorder posts site-wide.
 */

export const blogHeroPost: BlogPost = aboutAGirlPosts[0];

export const blogGridPosts: BlogPost[] = aboutAGirlPosts.slice(1, 4);

export const blogTrendingItems: TrendingItem[] = aboutAGirlPosts
  .slice(0, 4)
  .map((p, i) => ({
    id: `bt-${i + 1}`,
    title: p.title,
    category: p.category,
    slug: p.slug,
  }));

export const blogFreshPosts: BlogPost[] = aboutAGirlPosts.slice(4, 10);
