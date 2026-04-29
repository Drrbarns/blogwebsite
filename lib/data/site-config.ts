import type { SiteConfig, NavItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "About a Girl",
  description:
    "About a Girl is a personal blog about the many facets of one woman — faith, sport, medicine and the in-between. Notes from a doctor on calling, training, scrubs, scripture and the small habits that make a life.",
  url: "https://aboutagirl.blog",
  ogImage: "/images/og-default.jpg",
  links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  contact: {
    address: "On call · somewhere in West Africa",
    email: "hello@aboutagirl.blog",
    phone: "",
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
  { name: "Faith", slug: "faith" },
  { name: "Sport", slug: "sport" },
  { name: "Medicine", slug: "medicine" },
  { name: "Life", slug: "life" },
  { name: "Reflections", slug: "reflections" },
  { name: "Journal", slug: "journal" },
];
