import type { SiteConfig, NavItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "ONTARIO",
  description:
    "Welcome to the ONTARIO Blog WordPress Theme – your space for fresh ideas, insightful stories, and practical tips. Whether you're looking to learn something new, spark inspiration, or simply enjoy thoughtful reading, you've come to the right place.",
  url: "https://ontariowp.com",
  ogImage: "/images/og-default.jpg",
  links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  contact: {
    address: "27 Division St, New York, NY 10002, United States",
    email: "hello@mysite.com",
    phone: "8 800 2345 234",
  },
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerCategories = [
  { name: "Digital", slug: "digital" },
  { name: "Business", slug: "business" },
  { name: "Startups", slug: "startups" },
  { name: "Trends", slug: "trends" },
  { name: "Crypto", slug: "crypto" },
  { name: "News", slug: "news" },
];
