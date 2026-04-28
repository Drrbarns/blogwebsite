import type { BlogPost, TrendingItem } from "@/types";

const author = {
  name: "Steve Jones",
  avatar: "/images/avatar.jpg",
};

export const blogHeroPost: BlogPost = {
  id: "blog-hero",
  slug: "organic-shapes-in-modern-digital-architecture",
  title: "Organic Shapes in Modern Digital Architecture",
  excerpt:
    "The story of our agency began where the city never sleeps. With nothing more than a simple idea, we set out to create a place where innovation and creativity converge to move businesses forward...",
  coverImage:
    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&h=900&fit=crop&q=80",
  category: { name: "Business", slug: "business" },
  categories: [
    { name: "Business", slug: "business" },
    { name: "Technology", slug: "technology" },
    { name: "Trends", slug: "trends" },
  ],
  author,
  publishedAt: "2025-09-07",
  readingTime: 5,
  featured: true,
};

export const blogGridPosts: BlogPost[] = [
  {
    id: "bg-1",
    slug: "the-use-of-fluid-curves-in-digital-design-processes",
    title: "The Use of Fluid Curves in Digital Design Processes",
    excerpt:
      "Amid the fast rhythm of an ever-growing metropolis, the seed of our agency was planted. From one clear...",
    coverImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop&q=80",
    category: { name: "Digital", slug: "digital" },
    categories: [
      { name: "Digital", slug: "digital" },
      { name: "Trends", slug: "trends" },
    ],
    author,
    publishedAt: "2025-09-07",
    readingTime: 3,
  },
  {
    id: "bg-2",
    slug: "the-impact-of-immersive-landscapes-in-digital-aesthetics",
    title: "The Impact of Immersive Landscapes in Digital Aesthetics",
    excerpt:
      "In a city brimming with life and opportunity, our journey as a digital agency took its first steps....",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80",
    category: { name: "Digital", slug: "digital" },
    categories: [
      { name: "Digital", slug: "digital" },
      { name: "Startups", slug: "startups" },
      { name: "Technology", slug: "technology" },
    ],
    author,
    publishedAt: "2025-09-07",
    readingTime: 4,
  },
  {
    id: "bg-3",
    slug: "the-use-of-ambient-lighting-in-modern-ai-spaces",
    title: "The Use of Ambient Lighting in Modern AI Spaces",
    excerpt:
      "Deep within a vibrant city alive with energy, our digital agency was born. What began as a modest...",
    coverImage:
      "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop&q=80",
    category: { name: "AI", slug: "ai" },
    categories: [
      { name: "AI", slug: "ai" },
      { name: "News", slug: "news" },
      { name: "Trends", slug: "trends" },
    ],
    author,
    publishedAt: "2025-09-07",
    readingTime: 3,
  },
];

export const blogTrendingItems: TrendingItem[] = [
  {
    id: "bt-1",
    title: "Marketing on Business Transformation",
    category: { name: "Recent", slug: "recent" },
    slug: "marketing-on-business-transformation",
  },
  {
    id: "bt-2",
    title: "Commanding Unknown Terrain: the Lessons from Bold Pioneers",
    category: { name: "Recent", slug: "recent" },
    slug: "commanding-unknown-terrain-the-lessons-from-bold-pioneers",
  },
  {
    id: "bt-3",
    title: "What Digital Signals Tell Us About Market Behavior",
    category: { name: "Recent", slug: "recent" },
    slug: "what-digital-signals-tell-us-about-market-behavior",
  },
  {
    id: "bt-4",
    title: "Urban Mindfulness: Finding Peace Above Noise",
    category: { name: "Recent", slug: "recent" },
    slug: "urban-mindfulness-finding-peace-above-noise",
  },
];

export const blogFreshPosts: BlogPost[] = [
  {
    id: "bf-1",
    slug: "commanding-unknown-terrain-the-lessons-from-bold-pioneers",
    title: "Commanding Unknown Terrain: the Lessons from Bold Pioneers",
    excerpt:
      "The spark that ignited our agency was born in the midst of a thriving city. Out of one idea came a space designed to merge imagination and technology — helping businesses unlock their digital potential. It was a late-night...",
    coverImage:
      "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=1000&h=750&fit=crop&q=80",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
  {
    id: "bf-2",
    slug: "what-digital-signals-tell-us-about-market-behavior",
    title: "What Digital Signals Tell Us About Market Behavior",
    excerpt:
      "The story of our agency began where the city never sleeps. With nothing more than a simple idea, we set out to create a place where innovation and creativity converge to move businesses forward in the digital world. It was...",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=750&fit=crop&q=80",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 2,
  },
  {
    id: "bf-3",
    slug: "urban-mindfulness-finding-peace-above-noise",
    title: "Urban Mindfulness: Finding Peace Above Noise",
    excerpt:
      "Our agency's journey began in the core of a lively city, where energy and ambition collide. From just one idea grew the belief that creativity and technology, together, could transform the digital landscape. It was a...",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&h=750&fit=crop&q=80",
    category: { name: "Trends", slug: "trends" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 4,
  },
  {
    id: "bf-4",
    slug: "how-bold-aesthetics-redefine-product-identity",
    title: "How Bold Aesthetics Redefine Product Identity",
    excerpt:
      "Amid the fast rhythm of an ever-growing metropolis, the seed of our agency was planted. From one clear idea came a mission — to merge creativity with technology and guide companies into the digital future. It was a...",
    coverImage:
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=1000&h=750&fit=crop&q=80",
    category: { name: "Digital", slug: "digital" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
  {
    id: "bf-5",
    slug: "mind-circuits-engineering-the-future-self",
    title: "Mind Circuits: Engineering the Future Self",
    excerpt:
      "In a city brimming with life and opportunity, our journey as a digital agency took its first steps. It all started with a simple thought: blending innovation and imagination to reshape how businesses succeed online. It was...",
    coverImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&h=750&fit=crop&q=80",
    category: { name: "AI", slug: "ai" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 4,
  },
  {
    id: "bf-6",
    slug: "building-smarter-systems-how-ai-reshapes-business-operations",
    title: "Building Smarter Systems: How AI Reshapes Business Operations",
    excerpt:
      "Deep within a vibrant city alive with energy, our digital agency was born. What began as a modest idea soon grew into a vision — a place where creativity and technology unite to help businesses thrive in the digital era. It...",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&h=750&fit=crop&q=80",
    category: { name: "AI", slug: "ai" },
    author,
    publishedAt: "2026-03-26",
    readingTime: 3,
  },
];
