import type {
  Stat,
  ServiceCard,
  TeamMember,
  BrandLogo,
  TestimonialItem,
} from "@/types";

export const aboutHeroImage =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=1000&fit=crop&q=80";

export const aboutStats: Stat[] = [
  {
    id: "s1",
    value: "50+",
    label: "Successfull Projects",
    variant: "image",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&h=520&fit=crop&q=80",
  },
  {
    id: "s2",
    value: "10+",
    label: "Years of Experience",
    variant: "solid",
  },
];

export const aboutStoryParagraphs: string[] = [
  "In the heart of a bustling city, where innovation meets opportunity, the story of our digital agency began. Like all great journeys, it started with a simple idea: to create a space where creativity and technology could converge to transform businesses in the digital age.",
  "It was a late-night brainstorming session between two college friends, Sarah and Mike, who had always been passionate about digital transformation. Sarah, a design enthusiast, believed in the power of visuals to tell compelling stories. Mike, a tech wizard, saw the limitless possibilities of code to bring those stories to life. Together, they envisioned a digital agency that would bridge the gap between creativity and functionality.",
];

export const aboutServices: ServiceCard[] = [
  {
    id: "svc-1",
    title: "",
    variant: "image",
    image:
      "https://images.unsplash.com/photo-1554774853-719586f82d77?w=700&h=700&fit=crop&q=80",
  },
  {
    id: "svc-2",
    title: "Content & Editorial",
    variant: "accent",
    items: [
      "Blog & Magazine Content Writing",
      "Editorial Planning & Content Calendars",
      "Feature Articles & Long-Form Stories",
      "SEO-Optimized Blog Posts",
    ],
  },
  {
    id: "svc-3",
    title: "",
    variant: "image",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=700&fit=crop&q=80",
  },
  {
    id: "svc-4",
    title: "Social Media Marketing (SMM)",
    variant: "dark",
    items: [
      "Social Media Strategy & Planning",
      "Social Media Account Management",
      "Content Creation (Posts, Reels, Stories)",
      "Caption Writing & Hashtag Strategy",
    ],
  },
  {
    id: "svc-5",
    title: "Consulting & Strategy",
    variant: "light",
    items: [
      "Content Strategy Consulting",
      "Social Media Audits",
      "Brand Positioning Strategy",
      "Launch & Rebranding Support",
    ],
  },
];

export const aboutBrands: BrandLogo[] = [
  { id: "b1", name: "Cactus" },
  { id: "b2", name: "Greenish" },
  { id: "b3", name: "Sitemark" },
  { id: "b4", name: "luminous" },
  { id: "b5", name: "Hamilton" },
  { id: "b6", name: "KOBE" },
];

export const aboutTestimonials: TestimonialItem[] = [
  {
    id: "t1",
    quote:
      "An agency driven by AI, where creativity and technology enhance your brand's presence.",
    author: {
      name: "Kate Johnson",
      role: "UX EXPERT",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "t2",
    quote:
      "Exceptional craft meets strategic thinking. Their team delivered beyond every expectation we set.",
    author: {
      name: "Marcus Lee",
      role: "CREATIVE DIRECTOR",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
    },
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=700&fit=crop&q=80",
  },
];

export const aboutTeam: TeamMember[] = [
  {
    id: "tm-1",
    name: "John Martin",
    role: "CEO, Founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&q=80",
  },
  {
    id: "tm-2",
    name: "Sarah Miller",
    role: "Art Director, Co-Founder",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop&q=80",
  },
  {
    id: "tm-3",
    name: "Mark Norman",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&q=80",
  },
  {
    id: "tm-4",
    name: "Michelle Adams",
    role: "UX Lead",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop&q=80",
  },
];
