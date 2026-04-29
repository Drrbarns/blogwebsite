import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { searchPlugin } from "@payloadcms/plugin-search";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Posts } from "./collections/Posts";
import { Pages } from "./collections/Pages";
import { LinkHealth } from "./collections/LinkHealth";
import { NotFoundLogs } from "./collections/NotFoundLogs";
import { Navigation } from "./collections/globals/Navigation";
import { SiteSettings } from "./collections/globals/SiteSettings";
import { AboutPage } from "./collections/globals/AboutPage";
import { ContactPage } from "./collections/globals/ContactPage";
import { FeaturesPage } from "./collections/globals/FeaturesPage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  "http://localhost:3000";

export default buildConfig({
  serverURL: serverUrl,
  admin: {
    user: Users.slug,
    theme: "light",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "About a Girl · Studio",
      titleSuffix: " — About a Girl",
      description:
        "Writing studio for About a Girl — faith, sport, medicine and life, one entry at a time.",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    },
    components: {
      graphics: {
        Logo: "@/components/admin/brand/logo#default",
        Icon: "@/components/admin/brand/icon#default",
      },
      beforeLogin: ["@/components/admin/auth/login-before#default"],
      afterLogin: ["@/components/admin/auth/login-after#default"],
      beforeNavLinks: ["@/components/admin/nav/sidebar-header#default"],
      afterNavLinks: ["@/components/admin/nav/sidebar-footer#default"],
      header: ["@/components/admin/header/top-bar#default"],
      views: {
        dashboard: {
          Component: "@/components/admin/dashboard/index#default",
        },
      },
    },
    livePreview: {
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Posts,
    Pages,
    LinkHealth,
    NotFoundLogs,
  ],
  globals: [Navigation, SiteSettings, AboutPage, ContactPage, FeaturesPage],
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  sharp,
  cors: [serverUrl, "http://localhost:3000"].filter(Boolean),
  csrf: [serverUrl, "http://localhost:3000"].filter(Boolean),
  telemetry: false,
  plugins: [
    seoPlugin({
      collections: ["posts", "pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) =>
        `${(doc as { title?: string }).title ?? "Untitled"} — About a Girl`,
      generateDescription: ({ doc }) =>
        (doc as { excerpt?: string }).excerpt ?? "",
      generateURL: ({ doc, collectionSlug }) => {
        const slug = (doc as { slug?: string }).slug ?? "";
        const prefix = collectionSlug === "posts" ? "/blog/" : "/";
        return `${serverUrl}${prefix}${slug}`;
      },
    }),
    redirectsPlugin({
      collections: ["posts", "pages"],
      overrides: {
        admin: { group: "Admin" },
      },
    }),
    nestedDocsPlugin({
      collections: ["categories"],
      generateLabel: (_, doc) =>
        (doc as { name?: string }).name ?? "Category",
      generateURL: (docs) =>
        docs.reduce(
          (url, doc) => `${url}/${(doc as { slug?: string }).slug ?? ""}`,
          "",
        ),
    }),
    searchPlugin({
      collections: ["posts"],
      defaultPriorities: { posts: 10 },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        excerpt: (originalDoc as { excerpt?: string }).excerpt ?? "",
        slug: (originalDoc as { slug?: string }).slug ?? "",
      }),
    }),
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => {
            const supabaseUrl = process.env.SUPABASE_URL ?? "";
            const bucket = process.env.S3_BUCKET ?? "media";
            return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
          },
        },
      },
      bucket: process.env.S3_BUCKET ?? "media",
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT,
        region: process.env.SUPABASE_S3_REGION ?? "us-east-1",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
      },
    }),
  ],
});
