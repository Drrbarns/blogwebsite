export interface Author {
  name: string;
  avatar: string;
}

export interface Category {
  name: string;
  slug: string;
  color?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: Category;
  categories?: Category[];
  author: Author;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

export interface TrendingItem {
  id: string;
  title: string;
  category: Category;
  slug: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  contact: {
    address: string;
    email: string;
    phone: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  variant: "image" | "solid";
  image?: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  items?: string[];
  image?: string;
  variant: "image" | "accent" | "dark" | "light";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface BrandLogo {
  id: string;
  name: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
}
