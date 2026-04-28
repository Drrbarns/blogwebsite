import * as React from "react";
import Link from "next/link";

import type { AdminViewServerProps } from "payload";

import { ActivityFeed, type ActivityEvent } from "./activity-feed";
import { AICard } from "./ai-card";
import { BuildFooter } from "./build-footer";
import { CollectionTile } from "./collection-tile";
import { EditorialPulse } from "./editorial-pulse";
import { QuickActions } from "./quick-actions";
import { RecentPosts } from "./recent-posts";
import { SiteStatus } from "./site-status";
import { StatCard } from "./stat-card";
import { TagCloud } from "./tag-cloud";
import { TopAuthors } from "./top-authors";
import { WelcomeCard } from "./welcome-card";

type CountResult = { totalDocs: number };
type Payload = AdminViewServerProps["payload"];

const DAY_MS = 86_400_000;

async function safeCount(
  payload: Payload,
  collection: string,
  where?: Record<string, unknown>,
): Promise<number> {
  try {
    const res = (await payload.count({
      collection: collection as never,
      where: where as never,
      overrideAccess: true,
    })) as CountResult;
    return res.totalDocs ?? 0;
  } catch {
    return 0;
  }
}

async function safeFind<T>(
  payload: Payload,
  collection: string,
  options: {
    limit?: number;
    sort?: string;
    where?: Record<string, unknown>;
    depth?: number;
  } = {},
): Promise<T[]> {
  try {
    const res = await payload.find({
      collection: collection as never,
      limit: options.limit ?? 20,
      depth: options.depth ?? 0,
      sort: (options.sort ?? "-updatedAt") as never,
      where: options.where as never,
      overrideAccess: true,
    });
    return res.docs as T[];
  } catch {
    return [];
  }
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildPulseBuckets(posts: Array<{ updatedAt?: string }>) {
  const today = startOfDay(new Date());
  const buckets: Array<{ date: string; label: string; count: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
      }),
      count: 0,
    });
  }
  const indexByDate = new Map(buckets.map((b, i) => [b.date, i]));
  for (const p of posts) {
    if (!p.updatedAt) continue;
    const key = p.updatedAt.slice(0, 10);
    const idx = indexByDate.get(key);
    if (typeof idx === "number") buckets[idx].count++;
  }
  return buckets;
}

function rangeTotals(buckets: Array<{ count: number }>) {
  const half = Math.floor(buckets.length / 2);
  const last = buckets.slice(half).reduce((s, b) => s + b.count, 0);
  const prev = buckets.slice(0, half).reduce((s, b) => s + b.count, 0);
  return { thisWeek: last, lastWeek: prev };
}

interface PostDoc {
  id: number | string;
  title?: string;
  slug?: string;
  _status?: string;
  updatedAt?: string;
  createdAt?: string;
  authors?: Array<number | string | { id: number | string }>;
  tags?: Array<number | string | { id: number | string }>;
}

interface UserDoc {
  id: number | string;
  email?: string;
  name?: string;
  createdAt?: string;
}

interface MediaDoc {
  id: number | string;
  filename?: string;
  alt?: string;
  createdAt?: string;
}

interface TagDoc {
  id: number | string;
  name?: string;
  slug?: string;
}

function authorIds(post: PostDoc) {
  const list = post.authors ?? [];
  return list.map((a) =>
    typeof a === "object" && a !== null ? a.id : a,
  );
}

function tagIds(post: PostDoc) {
  const list = post.tags ?? [];
  return list.map((t) =>
    typeof t === "object" && t !== null ? t.id : t,
  );
}

export default async function AdminDashboard(props: AdminViewServerProps) {
  const { payload, user, visibleEntities, permissions } = props;
  const adminBase = payload.config.routes?.admin ?? "/admin";

  const visibleCollections = new Set(visibleEntities?.collections ?? []);
  const visibleGlobals = new Set(visibleEntities?.globals ?? []);

  // Server component runs once per request; Date.now is acceptable here.
  // eslint-disable-next-line react-hooks/purity
  const fortnightAgoIso = new Date(Date.now() - 14 * DAY_MS).toISOString();

  const [
    postsTotal,
    postsPublished,
    postsDrafts,
    pagesTotal,
    mediaTotal,
    categoriesTotal,
    tagsTotal,
    usersTotal,
    notFoundTotal,
    linkHealthTotal,
    recentPostsForList,
    pulsePosts,
    publishedPostsForLeaderboard,
    recentMedia,
    recentUsers,
    allUsers,
    allTags,
  ] = await Promise.all([
    safeCount(payload, "posts"),
    safeCount(payload, "posts", { _status: { equals: "published" } }),
    safeCount(payload, "posts", { _status: { equals: "draft" } }),
    safeCount(payload, "pages"),
    safeCount(payload, "media"),
    safeCount(payload, "categories"),
    safeCount(payload, "tags"),
    safeCount(payload, "users"),
    safeCount(payload, "not-found-logs"),
    safeCount(payload, "link-health", { status: { not_equals: "ok" } }),
    safeFind<PostDoc>(payload, "posts", {
      limit: 6,
      sort: "-updatedAt",
    }),
    safeFind<PostDoc>(payload, "posts", {
      limit: 200,
      sort: "-updatedAt",
      where: {
        updatedAt: { greater_than: fortnightAgoIso },
      },
    }),
    safeFind<PostDoc>(payload, "posts", {
      limit: 500,
      sort: "-publishedAt",
      where: { _status: { equals: "published" } },
    }),
    safeFind<MediaDoc>(payload, "media", {
      limit: 5,
      sort: "-createdAt",
    }),
    safeFind<UserDoc>(payload, "users", {
      limit: 5,
      sort: "-createdAt",
    }),
    safeFind<UserDoc>(payload, "users", {
      limit: 50,
      sort: "-createdAt",
    }),
    safeFind<TagDoc>(payload, "tags", { limit: 100, sort: "name" }),
  ]);

  const userMap = new Map<number | string, UserDoc>(
    allUsers.map((u) => [u.id, u]),
  );

  // Top authors leaderboard (from published posts within last 90 days)
  const authorTotals = new Map<number | string, { id: number | string; count: number; draftCount: number }>();
  for (const p of publishedPostsForLeaderboard) {
    for (const aid of authorIds(p)) {
      if (aid == null) continue;
      const cur = authorTotals.get(aid) ?? { id: aid, count: 0, draftCount: 0 };
      cur.count++;
      authorTotals.set(aid, cur);
    }
  }
  // Add draft counts from pulse window
  for (const p of pulsePosts) {
    if (p._status !== "draft") continue;
    for (const aid of authorIds(p)) {
      if (aid == null) continue;
      const cur = authorTotals.get(aid) ?? { id: aid, count: 0, draftCount: 0 };
      cur.draftCount++;
      authorTotals.set(aid, cur);
    }
  }
  const topAuthors = Array.from(authorTotals.values())
    .sort((a, b) => b.count - a.count || b.draftCount - a.draftCount)
    .slice(0, 5)
    .map((row) => {
      const u = userMap.get(row.id);
      return {
        id: row.id,
        name: u?.name || u?.email || `Author ${row.id}`,
        email: u?.email,
        count: row.count,
        draftCount: row.draftCount,
      };
    });

  // Tag cloud (top 18 tags)
  const tagTotals = new Map<number | string, number>();
  for (const p of publishedPostsForLeaderboard) {
    for (const tid of tagIds(p)) {
      if (tid == null) continue;
      tagTotals.set(tid, (tagTotals.get(tid) ?? 0) + 1);
    }
  }
  const tagMap = new Map(allTags.map((t) => [t.id, t]));
  const topTags = Array.from(tagTotals.entries())
    .map(([id, count]) => ({
      id,
      name: tagMap.get(id)?.name ?? tagMap.get(id)?.slug ?? `tag-${id}`,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  // Editorial pulse buckets (last 14 days)
  const buckets = buildPulseBuckets(pulsePosts);
  const totals = rangeTotals(buckets);

  // Activity feed — merge posts, media, users
  const activityEvents: ActivityEvent[] = [];
  for (const p of pulsePosts.slice(0, 8)) {
    activityEvents.push({
      id: `post-${p.id}-${p.updatedAt}`,
      kind: p._status === "published" ? "post-published" : "post-edited",
      title: p.title || "Untitled",
      href: `${adminBase}/collections/posts/${p.id}`,
      who: (() => {
        const a = authorIds(p)[0];
        if (a == null) return undefined;
        const u = userMap.get(a);
        return u?.name || u?.email;
      })(),
      at: p.updatedAt ?? p.createdAt ?? "",
    });
  }
  for (const m of recentMedia) {
    activityEvents.push({
      id: `media-${m.id}`,
      kind: "media-uploaded",
      title: m.alt || m.filename || `Media #${m.id}`,
      href: `${adminBase}/collections/media/${m.id}`,
      at: m.createdAt ?? "",
    });
  }
  for (const u of recentUsers) {
    activityEvents.push({
      id: `user-${u.id}`,
      kind: "user-joined",
      title: u.name || u.email || `User ${u.id}`,
      href: `${adminBase}/collections/users/${u.id}`,
      at: u.createdAt ?? "",
    });
  }
  activityEvents.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  const collectionTiles = [
    {
      slug: "posts",
      label: "Posts",
      hint: "Articles, essays and editorials",
      count: postsTotal,
      tone: "indigo" as const,
    },
    {
      slug: "pages",
      label: "Pages",
      hint: "Marketing & landing pages",
      count: pagesTotal,
      tone: "violet" as const,
    },
    {
      slug: "media",
      label: "Media",
      hint: "Images, files & uploads",
      count: mediaTotal,
      tone: "amber" as const,
    },
    {
      slug: "categories",
      label: "Categories",
      hint: "Top-level taxonomy",
      count: categoriesTotal,
      tone: "sky" as const,
    },
    {
      slug: "tags",
      label: "Tags",
      hint: "Free-form labels",
      count: tagsTotal,
      tone: "emerald" as const,
    },
    {
      slug: "users",
      label: "Users",
      hint: "Authors, editors & roles",
      count: usersTotal,
      tone: "rose" as const,
    },
  ].filter((c) => visibleCollections.has(c.slug));

  const globals = [
    { slug: "navigation", label: "Navigation", hint: "Header & footer" },
    { slug: "site-settings", label: "Site Settings", hint: "Brand & social" },
    { slug: "about-page", label: "About Page", hint: "Hero, story, team" },
    { slug: "contact-page", label: "Contact Page", hint: "Contact section" },
    { slug: "features-page", label: "Features Page", hint: "Pillars & tools" },
  ].filter((g) => visibleGlobals.has(g.slug));

  const adminUtilities = [
    {
      slug: "not-found-logs",
      label: "404 logs",
      hint: "Pages users tried to reach",
      count: notFoundTotal,
      tone: "rose" as const,
    },
    {
      slug: "link-health",
      label: "Link health",
      hint: "Broken & slow outbound links",
      count: linkHealthTotal,
      tone: "amber" as const,
    },
  ].filter((c) => visibleCollections.has(c.slug));

  const userName =
    (user as { name?: string; email?: string } | null | undefined)?.name ||
    (user as { name?: string; email?: string } | null | undefined)?.email ||
    "there";

  const canCreatePosts = Boolean(permissions?.collections?.posts?.create);
  const aiEnabled = Boolean(process.env.OPENAI_API_KEY);

  return (
    <div className="om-dash">
      <div className="om-dash__bg" aria-hidden />

      <div className="om-dash__inner">
        <WelcomeCard
          name={userName}
          adminBase={adminBase}
          canCreatePosts={canCreatePosts}
          stats={{
            postsTotal,
            postsPublished,
            postsDrafts,
            pagesTotal,
            mediaTotal,
          }}
        />

        <section className="om-dash__stats" aria-label="Overview">
          <StatCard
            label="Published"
            value={postsPublished}
            delta={postsPublished > 0 ? "Live on the web" : "None yet"}
            tone="indigo"
            href={`${adminBase}/collections/posts?where[_status][equals]=published`}
          />
          <StatCard
            label="Drafts"
            value={postsDrafts}
            delta={postsDrafts > 0 ? `${postsDrafts} pending` : "Inbox zero"}
            tone="amber"
            href={`${adminBase}/collections/posts?where[_status][equals]=draft`}
          />
          <StatCard
            label="Pages"
            value={pagesTotal}
            delta="Marketing routes"
            tone="violet"
            href={`${adminBase}/collections/pages`}
          />
          <StatCard
            label="Media"
            value={mediaTotal}
            delta="Images & files"
            tone="sky"
            href={`${adminBase}/collections/media`}
          />
          <StatCard
            label="Authors"
            value={usersTotal}
            delta={`${topAuthors.length} contributing`}
            tone="rose"
            href={`${adminBase}/collections/users`}
          />
          <StatCard
            label="Tags"
            value={tagsTotal}
            delta={`${topTags.length} in active use`}
            tone="emerald"
            href={`${adminBase}/collections/tags`}
          />
        </section>

        <EditorialPulse
          buckets={buckets}
          totalThisWeek={totals.thisWeek}
          totalLastWeek={totals.lastWeek}
        />

        <div className="om-dash__row">
          <QuickActions
            adminBase={adminBase}
            canCreatePosts={canCreatePosts}
          />
          <SiteStatus
            notFound={notFoundTotal}
            linkHealth={linkHealthTotal}
            adminBase={adminBase}
          />
        </div>

        <div className="om-dash__split">
          <section className="om-dash__section om-dash__section--span">
            <header className="om-dash__section-head">
              <div>
                <h2>Recently edited</h2>
                <p>Pick up where the team left off.</p>
              </div>
              <Link
                className="om-dash__section-link"
                href={`${adminBase}/collections/posts`}
              >
                All posts <span aria-hidden>→</span>
              </Link>
            </header>
            <RecentPosts posts={recentPostsForList} adminBase={adminBase} />
          </section>

          <ActivityFeed events={activityEvents.slice(0, 8)} />
        </div>

        <div className="om-dash__row om-dash__row--people">
          <TopAuthors authors={topAuthors} adminBase={adminBase} />
          <TagCloud tags={topTags} adminBase={adminBase} />
        </div>

        <AICard adminBase={adminBase} enabled={aiEnabled} />

        {collectionTiles.length > 0 && (
          <section className="om-dash__section">
            <header className="om-dash__section-head">
              <div>
                <h2>Content collections</h2>
                <p>Everything that powers the public site.</p>
              </div>
            </header>
            <div className="om-dash__grid">
              {collectionTiles.map((c) => (
                <CollectionTile
                  key={c.slug}
                  href={`${adminBase}/collections/${c.slug}`}
                  label={c.label}
                  hint={c.hint}
                  count={c.count}
                  tone={c.tone}
                />
              ))}
            </div>
          </section>
        )}

        {globals.length > 0 && (
          <section className="om-dash__section">
            <header className="om-dash__section-head">
              <div>
                <h2>Site configuration</h2>
                <p>Globals shared across every page of the site.</p>
              </div>
            </header>
            <div className="om-dash__grid">
              {globals.map((g) => (
                <CollectionTile
                  key={g.slug}
                  href={`${adminBase}/globals/${g.slug}`}
                  label={g.label}
                  hint={g.hint}
                  tone="slate"
                />
              ))}
            </div>
          </section>
        )}

        {adminUtilities.length > 0 && (
          <section className="om-dash__section">
            <header className="om-dash__section-head">
              <div>
                <h2>Admin utilities</h2>
                <p>Operational health and observability.</p>
              </div>
            </header>
            <div className="om-dash__grid">
              {adminUtilities.map((c) => (
                <CollectionTile
                  key={c.slug}
                  href={`${adminBase}/collections/${c.slug}`}
                  label={c.label}
                  hint={c.hint}
                  count={c.count}
                  tone={c.tone}
                />
              ))}
            </div>
          </section>
        )}

        <BuildFooter />
      </div>
    </div>
  );
}
