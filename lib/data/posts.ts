import type { BlogPost, Category, TrendingItem, Tag } from "@/types";

export const categories: Category[] = [
  { name: "AI", slug: "ai", color: "#fce4ec" },
  { name: "Crypto", slug: "crypto", color: "#e8f5e9" },
  { name: "Digital", slug: "digital", color: "#fff3e0" },
  { name: "Startups", slug: "startups", color: "#e3f2fd" },
  { name: "Technology", slug: "technology", color: "#f3e5f5" },
  { name: "Trends", slug: "trends", color: "#fff8e1" },
];

const author = {
  name: "Steve Jones",
  avatar: "/images/avatar.jpg",
};

export const heroFeaturedPosts: BlogPost[] = [
  {
    id: "hero-1",
    slug: "ai-driven-techniques-for-expansion",
    title: "AI-Driven Techniques for Expansion",
    excerpt:
      "In the heart of a bustling city, where innovation meets opportunity, the story of our digital agency began. Like all great journeys, it...",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&h=900&fit=crop",
    category: { name: "AI", slug: "ai" },
    author,
    publishedAt: "2026-03-24",
    readingTime: 3,
    featured: true,
  },
  {
    id: "hero-2",
    slug: "the-future-of-blockchain-in-finance",
    title: "The Future of Blockchain in Finance",
    excerpt:
      "Blockchain technology is reshaping the financial landscape with unprecedented speed. From decentralized finance to smart contracts...",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&h=900&fit=crop",
    category: { name: "Crypto", slug: "crypto" },
    author,
    publishedAt: "2026-03-23",
    readingTime: 4,
    featured: true,
  },
  {
    id: "hero-3",
    slug: "digital-transformation-strategies",
    title: "Digital Transformation Strategies That Actually Work",
    excerpt:
      "In today's rapidly evolving digital landscape, businesses must adapt or risk being left behind. Discover the strategies that drive real results...",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop",
    category: { name: "Technology", slug: "technology" },
    author,
    publishedAt: "2026-03-22",
    readingTime: 5,
    featured: true,
  },
];

export const freshPosts: BlogPost[] = [
  {
    id: "fresh-1",
    slug: "commanding-unknown-terrain-the-lessons-from-bold-pioneers",
    title: "Commanding Unknown Terrain: the Lessons from Bold Pioneers",
    excerpt: "Exploring uncharted territories requires bold thinking and decisive action...",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
  {
    id: "fresh-2",
    slug: "what-digital-signals-tell-us-about-market-behavior",
    title: "What Digital Signals Tell Us About Market Behavior",
    excerpt: "Digital analytics reveal hidden patterns in consumer behavior...",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 2,
  },
  {
    id: "fresh-3",
    slug: "urban-mindfulness-finding-peace-above-noise",
    title: "Urban Mindfulness: Finding Peace Above Noise",
    excerpt: "In the chaos of city life, mindfulness practices offer a pathway to inner calm...",
    coverImage: "https://images.unsplash.com/photo-1515562141589-67f0d569b6e5?w=800&h=600&fit=crop",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 4,
  },
  {
    id: "fresh-4",
    slug: "how-bold-aesthetics-redefine-product-identity",
    title: "How Bold Aesthetics Redefine Product Identity",
    excerpt: "Visual branding has become the most powerful differentiator in crowded markets...",
    coverImage: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800&h=600&fit=crop",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
  {
    id: "fresh-5",
    slug: "mind-circuits-engineering-the-future-self",
    title: "Mind Circuits: Engineering the Future Self",
    excerpt: "Neurotechnology and AI are converging to reshape human potential...",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
    category: { name: "AI", slug: "ai" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 4,
  },
  {
    id: "fresh-6",
    slug: "building-smarter-systems-how-ai-reshapes-business-operations",
    title: "Building Smarter Systems: How AI Reshapes Business Operations",
    excerpt: "Artificial intelligence is no longer a luxury—it's a business necessity...",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: { name: "AI", slug: "ai" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
];

export const recentArticles: BlogPost[] = [
  {
    id: "recent-1",
    slug: "why-most-marketing-budgets-fail-to-move-revenue",
    title: "Why Most Marketing Budgets Fail to Move Revenue",
    excerpt:
      "In a city where ambition meets innovation, our agency's story found its beginning. With one small idea, we created a space where creativity and technology work side by side to transform business....",
    coverImage: "https://images.unsplash.com/photo-1596558450268-9c27524ba856?w=400&h=300&fit=crop",
    category: { name: "News", slug: "news" },
    author,
    publishedAt: "2026-03-25",
    readingTime: 2,
  },
  {
    id: "recent-2",
    slug: "the-impact-of-strategic-marketing-on-business-transformation",
    title: "The Impact of Strategic Marketing on Business Transformation",
    excerpt:
      "In a city where ambition meets innovation, our agency's story found its beginning. With one small idea, we created a space where creativity and technology work side by side to transform business....",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    category: { name: "News", slug: "news" },
    author,
    publishedAt: "2026-03-25",
    readingTime: 2,
  },
  {
    id: "recent-3",
    slug: "how-strategic-marketing-transforms-businesses",
    title: "How Strategic Marketing Transforms Businesses",
    excerpt:
      "In the heart of a bustling city, where innovation meets opportunity, the story of our digital agency began. Like all great journeys, it started with a simple idea: to create a space where...",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: { name: "News", slug: "news" },
    author,
    publishedAt: "2026-03-24",
    readingTime: 3,
  },
];

export const featuredSidebarPosts: BlogPost[] = [
  {
    id: "sidebar-1",
    slug: "the-impact-of-immersive-landscapes-in-digital-aesthetics",
    title: "The Impact of Immersive Landscapes in Digital Aesthetics",
    excerpt: "Exploring how immersive digital landscapes are reshaping our visual culture...",
    coverImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2025-09-07",
    readingTime: 3,
  },
];

export const relatedArticles: BlogPost[] = [
  {
    id: "related-1",
    slug: "commanding-unknown-terrain-the-lessons-from-bold-pioneers",
    title: "Commanding Unknown Terrain: the Lessons from Bold Pioneers",
    excerpt: "",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
  {
    id: "related-2",
    slug: "what-digital-signals-tell-us-about-market-behavior",
    title: "What Digital Signals Tell Us About Market Behavior",
    excerpt: "",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 2,
  },
  {
    id: "related-3",
    slug: "urban-mindfulness-finding-peace-above-noise",
    title: "Urban Mindfulness: Finding Peace Above Noise",
    excerpt: "",
    coverImage: "https://images.unsplash.com/photo-1515562141589-67f0d569b6e5?w=100&h=100&fit=crop",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 4,
  },
];

export const trendingItems: TrendingItem[] = [
  { id: "t-1", title: "New Trends in Abstract Digital Design", category: { name: "AI", slug: "ai" }, slug: "new-trends-in-abstract-digital-design" },
  { id: "t-2", title: "Organic Shapes in Modern Digital Architecture", category: { name: "Business", slug: "business" }, slug: "organic-shapes-in-modern-digital-architecture" },
  { id: "t-3", title: "Colorful Packaging in Contemporary Crypto Branding", category: { name: "Crypto", slug: "crypto" }, slug: "colorful-packaging-in-contemporary-crypto-branding" },
  { id: "t-4", title: "Transparent Structures in Futuristic Design", category: { name: "Digital", slug: "digital" }, slug: "transparent-structures-in-futuristic-design" },
];

export const popularTags: Tag[] = [
  { name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { name: "Breaking News", slug: "breaking-news" },
  { name: "Business Growth", slug: "business-growth" },
  { name: "Cloud Computing", slug: "cloud-computing" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Future of Work", slug: "future-of-work" },
  { name: "Global Trends", slug: "global-trends" },
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Technology", slug: "technology" },
  { name: "Venture Capital", slug: "venture-capital" },
  { name: "Web3", slug: "web3" },
];
