/**
 * One-shot script to insert the single missing "burnout" post that the main
 * rewrite-content run could not create because its Unsplash cover 404'd.
 *
 *   npm run insert-burnout-post
 */
import { Buffer } from "node:buffer";
import type { getPayload as GetPayloadFn } from "payload";

if (process.env.DATABASE_URI) {
  const next = process.env.DATABASE_URI.replace(":5432/", ":6543/");
  if (next !== process.env.DATABASE_URI) {
    process.env.DATABASE_URI = next;
    console.log("[burnout] using transaction-mode pooler (port 6543)");
  }
}

type PayloadInstance = Awaited<ReturnType<typeof GetPayloadFn>>;
type ID = string | number;

const log = (...a: unknown[]) => console.log("[burnout]", ...a);

const COVER_URL =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&w=1600&q=80";

const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&w=1600&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=1600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&w=1600&q=80",
];

const FMT_BOLD = 1;

const t = (text: string, format = 0) => ({
  type: "text",
  version: 1,
  text,
  format,
  detail: 0,
  mode: "normal",
  style: "",
});
const p = (...children: ReturnType<typeof t>[]) => ({
  type: "paragraph",
  version: 1,
  children: children.length ? children : [t("")],
  format: "",
  indent: 0,
  direction: "ltr",
  textFormat: 0,
  textStyle: "",
});
const ps = (text: string) => p(t(text));
const h2 = (text: string) => ({
  type: "heading",
  tag: "h2",
  version: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});
const h3 = (text: string) => ({
  type: "heading",
  tag: "h3",
  version: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});
const li = (text: string) => ({
  type: "listitem",
  version: 1,
  value: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});
const ul = (...items: string[]) => ({
  type: "list",
  listType: "bullet",
  tag: "ul",
  start: 1,
  version: 1,
  children: items.map(li),
  format: "",
  indent: 0,
  direction: "ltr",
});
const callout = (
  variant: "info" | "warning" | "success" | "quote",
  title: string,
  body: string,
) => ({
  type: "block",
  version: 2,
  format: "",
  fields: { blockType: "callout", variant, title, body },
});
const hr = () => ({ type: "horizontalrule", version: 1 });

const content = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: [
      ps(
        "I want to write carefully about burnout, because I have seen it discussed in two unhelpful ways. There is the wellness-industry version, which suggests burnout is solved by green smoothies and journalling. There is the systemic version, which is correct that the structures are broken but sometimes forgets that the worker still has to live until the structures change. I want to find a third path: clear-eyed about the system, practical about the self.",
      ),
      ps(
        "I went through my own collapse in the second year of internship. Not a public crisis. A quiet one. Bone-tired by Wednesdays. Snapping at people I love. Ten minutes of dread before every shift. I did not call it burnout for a long time. I called it a rough patch. The vocabulary failure is part of the problem.",
      ),
      h2("The clinical signs of your own burnout"),
      ps(
        "We are good at recognising burnout in patients. We are appalling at recognising it in ourselves. Here are the signs I now teach myself to watch for, drawn from the published literature and from being a worse version of myself for nine months.",
      ),
      ul(
        "Cynicism creeping in. The patients begin to feel like obstacles instead of people. Names blur. Compassion thins.",
        "Sleep that does not restore. You sleep eight hours and wake exhausted. Exhaustion has moved from the body to the soul.",
        "Loss of joy in things that used to give you joy. Running. Reading. Friends. Church. The colour drains.",
        "Disproportionate emotional reactions. Tears at small frustrations. Rage at slow internet. The reservoir is empty and small things now overflow it.",
        "Physical symptoms with no clear cause. Headaches. Stomach upset. Frequent infections. The body is telling on you.",
        "Avoidance of the work itself. You take the long route to the ward. You delay opening the inbox. The body pulls back from what the mind has not yet refused.",
      ),
      ps(
        "If three of these have been true for a month, you are not having a rough patch. You are in early burnout. Treat it like the clinical issue it is.",
      ),
      callout(
        "warning",
        "Distinguish burnout from depression",
        "They overlap but are not identical. If you have persistent low mood, anhedonia in domains beyond work, or any thoughts of self-harm — please talk to a professional. Burnout self-help is not a substitute for clinical care.",
      ),
      h2("What I had to surrender to recover"),
      ps(
        "Recovery from burnout is not what wellness Instagram promises. It is not bubble baths. It is harder, less photogenic, and more permanent. Here is what I had to surrender, in the order I had to surrender it.",
      ),
      h3("The myth that more effort solves it"),
      ps(
        "I tried to work my way out of burnout. It is, of course, the worst possible response. The condition is the body's protest at too much; the cure is not more. The cure is less, slowly, with intention.",
      ),
      h3("The identity of the always-available doctor"),
      ps(
        "I had built a quiet identity around being the intern who never said no. Always took the extra call. Always stayed late. Always answered the phone on the day off. That identity was killing me. It also was not making me a better doctor — it was making me a more exhausted one. Patients deserved a rested doctor. Rested doctors say no.",
      ),
      h3("Guilt about boundaries"),
      ps(
        "I had to learn that 'no' is a complete sentence. That declining a non-essential rota swap is not selfish. That a day off is not a luxury. That the institution is not your spouse — your spouse is your spouse, and even your spouse does not get every minute of your life.",
      ),
      h2("The boundaries I now keep, and the language I use"),
      ps(
        "Building boundaries was the hardest part. Mostly because I did not know how to say no in a profession that systematically rewards yes. So I borrowed scripts from older doctors and adapted them. Here are the ones I use most.",
      ),
      ul(
        "'I cannot do that this week.' Notice the absence of explanation. Reasons are negotiating positions. Statements are not.",
        "'Let me come back to you tomorrow.' Buys time. Most asks become smaller or disappear in twenty-four hours.",
        "'That falls outside what I can take on right now.' Polite, firm, no door for re-negotiation.",
        "'I would love to help; this week I cannot.' Warm refusal. Maintains the relationship. Closes the door.",
        "'No, but here is what I can offer.' For the asks that deserve a counter-proposal.",
      ),
      ps(
        "The first time you use these, your hand will shake. By the tenth time they are part of your professional vocabulary. The world does not collapse. The asks reduce. People begin to ask better.",
      ),
      h2("The structural changes nobody tells you about"),
      ps(
        "Beyond language, certain structural changes were transformational for me. I list them not as prescriptions — your context is yours — but as ideas to consider.",
      ),
      ul(
        "I added one full day off per fortnight. Non-negotiable. Not for errands. Not for catching up on emails. For nothing. Sleep, walk, read fiction, see one friend.",
        "I left the work phone in the car at home. Not bedside. Not in the kitchen. In the car. Geographic distance equals psychological distance.",
        "I stopped reading work emails before 7 a.m. or after 7 p.m. The world did not end. The inbox waited. I slept.",
        "I joined a peer support group of doctors at a similar stage. Once a month. Two hours. Honest. It is the cheapest mental health insurance I have ever bought.",
      ),
      h2("On going to therapy"),
      ps(
        "I started therapy in the middle of my recovery. I had resisted for years on the grounds that I was 'fine'. I was not fine. I was high-functioning and quietly fraying. Therapy gave me a vocabulary for what was happening and a structured place to think about it. I cannot recommend it highly enough.",
      ),
      ps(
        "If you are reading this and you have been wondering whether you should go to therapy: yes. Go. The professional risk of ignoring it is far greater than the financial cost of seeing a therapist for six sessions to find out where you actually are.",
      ),
      h2("On loving the work again"),
      ps(
        "The strangest fruit of recovery has been a renewed love for the work. I had assumed burnout was a gateway to exit. For some doctors, it is — and that exit is sometimes the right answer, and we should not shame anyone for it. For me, it became a gateway to a different relationship with the same vocation. Less heroic. Less consuming. More sustainable. Slower. Deeper.",
      ),
      ps(
        "I love medicine again now. Not the system — the system is still broken in many of the same ways it was when I started. But the work itself, the patients, the small repeated act of being useful to a stranger on the worst day of her life. That love came back. It is quieter than the original infatuation, and infinitely more durable.",
      ),
      hr(),
      ps(
        "Burnout is not a personal failure. It is an injury. Treat it accordingly. Rest, recover, build the boundaries, learn the language of no, find the people who will hold you. Then walk back in. Quietly. Wholly. For the long haul.",
      ),
    ],
  },
};

async function uploadCover(payload: PayloadInstance, url: string, alt: string): Promise<ID | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    const filename = `burnout-cover-${Date.now()}.jpg`;
    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: { data: buffer, mimetype: mime, name: filename, size: buffer.length },
      overrideAccess: true,
    });
    return (doc as { id: ID }).id;
  } catch (err) {
    console.warn("[burnout] cover fetch failed:", (err as Error).message);
    return null;
  }
}

async function main() {
  if (!process.env.DATABASE_URI) throw new Error("DATABASE_URI is not set");

  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });

  log("looking up admin / category / tag IDs...");

  const users = await payload.find({ collection: "users", limit: 100, overrideAccess: true });
  const adminUser = users.docs.find((u) => {
    const roles = (u as { roles?: string[] }).roles ?? [];
    return roles.includes("admin") || roles.includes("editor");
  }) ?? users.docs[0];
  if (!adminUser) throw new Error("no users in database");
  const adminId = (adminUser as { id: ID }).id;

  const cat = await payload.find({
    collection: "categories",
    where: { slug: { equals: "medicine" } },
    limit: 1,
    overrideAccess: true,
  });
  if (!cat.docs.length) throw new Error("no 'medicine' category — run rewrite-content first");
  const categoryId = (cat.docs[0] as { id: ID }).id;

  const wantedTags = ["burnout", "boundaries", "mental-health", "resident-life"];
  const tags = await payload.find({
    collection: "tags",
    where: { slug: { in: wantedTags } },
    limit: 50,
    overrideAccess: true,
  });
  const tagIds = tags.docs.map((d) => (d as { id: ID }).id);

  log("fetching cover image...");
  let coverId = await uploadCover(payload, COVER_URL, "On Burnout, Boundaries, and the Word No — cover image");
  for (const fb of FALLBACK_COVERS) {
    if (coverId) break;
    log("trying fallback:", fb);
    coverId = await uploadCover(payload, fb, "On Burnout, Boundaries, and the Word No — cover image");
  }
  if (!coverId) throw new Error("no cover image available — all candidates failed");

  log("checking for existing post by slug...");
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: "on-burnout-boundaries-and-the-word-no" } },
    limit: 1,
    overrideAccess: true,
  });

  const data = {
    title: "On Burnout, Boundaries, and the Word 'No'",
    slug: "on-burnout-boundaries-and-the-word-no",
    excerpt:
      "Burnout is not a failure of character. It is the predictable injury of a profession that has not yet learned to protect its workers. Here is what I have learned about saying no, recovering well, and continuing to love the work without being destroyed by it.",
    content,
    category: categoryId,
    tags: tagIds,
    authors: [adminId],
    coverImage: coverId,
    featured: false,
    publishedAt: "2026-03-19T07:30:00.000Z",
    _status: "published" as const,
  };

  if (existing.docs.length) {
    log("updating existing post...");
    await payload.update({
      collection: "posts",
      id: (existing.docs[0] as { id: ID }).id,
      data,
      overrideAccess: true,
    });
  } else {
    log("creating new post...");
    await payload.create({
      collection: "posts",
      data,
      overrideAccess: true,
    });
  }

  log("done — burnout post inserted");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
