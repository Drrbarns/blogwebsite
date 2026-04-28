import type { Block } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

/**
 * Composable page-builder blocks used by the `Pages` collection's `layout`
 * field. Each block carries only content; the frontend renderer maps the
 * `blockType` discriminator to a React component.
 */

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "alignment",
      type: "select",
      defaultValue: "left",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    {
      name: "cta",
      type: "array",
      maxRows: 2,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
        {
          name: "style",
          type: "select",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
          ],
        },
      ],
    },
  ],
};

export const FeatureGridBlock: Block = {
  slug: "featureGrid",
  labels: { singular: "Feature Grid", plural: "Feature Grids" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "columns",
      type: "number",
      defaultValue: 3,
      min: 2,
      max: 4,
    },
    {
      name: "features",
      type: "array",
      minRows: 2,
      fields: [
        { name: "icon", type: "text", admin: { description: "Lucide icon name (e.g. 'Sparkles')" } },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
  ],
};

export const StatsBlock: Block = {
  slug: "stats",
  labels: { singular: "Stats", plural: "Stats blocks" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "items",
      type: "array",
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
        { name: "description", type: "text" },
      ],
    },
  ],
};

export const LogoCloudBlock: Block = {
  slug: "logoCloud",
  labels: { singular: "Logo Cloud", plural: "Logo Clouds" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "logos",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "url", type: "text" },
      ],
    },
  ],
};

export const TestimonialsBlock: Block = {
  slug: "testimonials",
  labels: { singular: "Testimonials", plural: "Testimonials blocks" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "authorName", type: "text", required: true },
        { name: "authorRole", type: "text" },
        { name: "avatar", type: "upload", relationTo: "media" },
      ],
    },
  ],
};

export const FAQBlock: Block = {
  slug: "faq",
  labels: { singular: "FAQ", plural: "FAQs" },
  fields: [
    { name: "heading", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    {
      name: "emitJsonLd",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Emit FAQPage schema.org JSON-LD on this page." },
    },
  ],
};

export const CTABlock: Block = {
  slug: "cta",
  labels: { singular: "CTA", plural: "CTAs" },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "primary",
      type: "group",
      fields: [
        { name: "label", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "secondary",
      type: "group",
      fields: [
        { name: "label", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "variant",
      type: "select",
      defaultValue: "accent",
      options: [
        { label: "Accent", value: "accent" },
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
    },
  ],
};

export const VideoBlock: Block = {
  slug: "video",
  labels: { singular: "Video", plural: "Videos" },
  fields: [
    {
      name: "provider",
      type: "select",
      required: true,
      defaultValue: "youtube",
      options: [
        { label: "YouTube", value: "youtube" },
        { label: "Vimeo", value: "vimeo" },
      ],
    },
    { name: "id", type: "text", required: true },
    { name: "caption", type: "text" },
    { name: "poster", type: "upload", relationTo: "media" },
  ],
};

export const SplitBlock: Block = {
  slug: "split",
  labels: { singular: "Split", plural: "Split blocks" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text", required: true },
    { name: "body", type: "richText", editor: lexicalEditor({}) },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "imagePosition",
      type: "select",
      defaultValue: "right",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "label", type: "text" },
        { name: "url", type: "text" },
      ],
    },
  ],
};

export const RichTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Rich Text", plural: "Rich Text blocks" },
  fields: [
    {
      name: "width",
      type: "select",
      defaultValue: "narrow",
      options: [
        { label: "Narrow (prose)", value: "narrow" },
        { label: "Wide", value: "wide" },
      ],
    },
    { name: "body", type: "richText", required: true, editor: lexicalEditor({}) },
  ],
};

export const NewsletterBlock: Block = {
  slug: "newsletter",
  labels: { singular: "Newsletter", plural: "Newsletter blocks" },
  fields: [
    { name: "heading", type: "text" },
    { name: "subheading", type: "textarea" },
    { name: "placeholder", type: "text", defaultValue: "you@example.com" },
    { name: "buttonLabel", type: "text", defaultValue: "Subscribe" },
  ],
};

export const allPageBlocks = [
  HeroBlock,
  FeatureGridBlock,
  StatsBlock,
  LogoCloudBlock,
  TestimonialsBlock,
  FAQBlock,
  CTABlock,
  VideoBlock,
  SplitBlock,
  RichTextBlock,
  NewsletterBlock,
];
