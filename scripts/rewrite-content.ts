/**
 * One-shot content reset for the About a Girl rebrand.
 *
 *   npm run rewrite-content
 *
 * Replaces the original mock content (Ontario / AI / crypto seed) with 14
 * comprehensive long-form essays organised under the new About a Girl
 * categories: Faith, Sport, Medicine, Life, Reflections, Journal.
 *
 * Safe to re-run — the script deletes existing categories/tags/posts and
 * recreates them from the in-script POSTS array. Cover images are fetched
 * from Unsplash; if a fetch fails the post falls back to whatever cover
 * the original record already had.
 */
import { Buffer } from "node:buffer";
import type { getPayload as GetPayloadFn } from "payload";

// Switch to the Supabase transaction-mode pooler (port 6543) BEFORE Payload's
// config module is loaded.  Vercel's running deployment holds session-mode
// (5432) connections, so a one-shot script cannot get one.  Mutating
// process.env here is only effective if it happens before payload.config is
// required — which is why payload + config are imported lazily inside main().
if (process.env.DATABASE_URI) {
  const next = process.env.DATABASE_URI.replace(":5432/", ":6543/");
  if (next !== process.env.DATABASE_URI) {
    process.env.DATABASE_URI = next;
    console.log("[rewrite] using transaction-mode pooler (port 6543)");
  }
}

type PayloadInstance = Awaited<ReturnType<typeof GetPayloadFn>>;
type ID = string | number;

const log = (...args: unknown[]) => console.log("[rewrite]", ...args);
const warn = (...args: unknown[]) => console.warn("[rewrite]", ...args);

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";

// ────────────────────────────────────────────────────────────────────────────
//  Categories + tags
// ────────────────────────────────────────────────────────────────────────────

const CATEGORIES: Array<{ slug: string; name: string; color?: string }> = [
  { slug: "faith", name: "Faith", color: "#b07e85" },
  { slug: "sport", name: "Sport", color: "#5b8c7c" },
  { slug: "medicine", name: "Medicine", color: "#4a6fa5" },
  { slug: "life", name: "Life", color: "#c97e4f" },
  { slug: "reflections", name: "Reflections", color: "#7a6c8d" },
  { slug: "journal", name: "Journal", color: "#8d6e63" },
];

const TAGS: Array<{ slug: string; name: string }> = [
  { slug: "prayer", name: "Prayer" },
  { slug: "devotion", name: "Devotion" },
  { slug: "scripture", name: "Scripture" },
  { slug: "resident-life", name: "Resident life" },
  { slug: "running", name: "Running" },
  { slug: "strength-training", name: "Strength training" },
  { slug: "discipline", name: "Discipline" },
  { slug: "patient-care", name: "Patient care" },
  { slug: "burnout", name: "Burnout" },
  { slug: "boundaries", name: "Boundaries" },
  { slug: "habits", name: "Habits" },
  { slug: "friendship", name: "Friendship" },
  { slug: "solitude", name: "Solitude" },
  { slug: "identity", name: "Identity" },
  { slug: "mental-health", name: "Mental health" },
  { slug: "cooking", name: "Cooking" },
  { slug: "letter-to-self", name: "Letter to self" },
  { slug: "presence", name: "Presence" },
];

// ────────────────────────────────────────────────────────────────────────────
//  Lexical helpers — produce the AST shape Payload's lexical editor expects
// ────────────────────────────────────────────────────────────────────────────

type LexNode = Record<string, unknown>;

const FMT_BOLD = 1;
const FMT_ITALIC = 1 << 1;

const t = (text: string, format = 0): LexNode => ({
  type: "text",
  version: 1,
  text,
  format,
  detail: 0,
  mode: "normal",
  style: "",
});

const tb = (text: string) => t(text, FMT_BOLD);
const ti = (text: string) => t(text, FMT_ITALIC);

const p = (...children: LexNode[]): LexNode => ({
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

const h2 = (text: string): LexNode => ({
  type: "heading",
  tag: "h2",
  version: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});

const h3 = (text: string): LexNode => ({
  type: "heading",
  tag: "h3",
  version: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});

const li = (text: string): LexNode => ({
  type: "listitem",
  version: 1,
  value: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});

const ul = (...items: string[]): LexNode => ({
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

const quote = (text: string): LexNode => ({
  type: "quote",
  version: 1,
  children: [t(text)],
  format: "",
  indent: 0,
  direction: "ltr",
});

const callout = (
  variant: "info" | "warning" | "success" | "quote",
  title: string,
  body: string,
): LexNode => ({
  type: "block",
  version: 2,
  format: "",
  fields: { blockType: "callout", variant, title, body },
});

const hr = (): LexNode => ({ type: "horizontalrule", version: 1 });

const lex = (...blocks: LexNode[]) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: blocks,
  },
});

// ────────────────────────────────────────────────────────────────────────────
//  Posts — comprehensive long-form essays, ~1200–1800 words each
// ────────────────────────────────────────────────────────────────────────────

interface PostSpec {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverUrl: string;
  publishedAt: string;
  featured?: boolean;
  content: ReturnType<typeof lex>;
}

const POSTS: PostSpec[] = [
  // ── 1. Faith — Quiet Hours After Call ────────────────────────────────────
  {
    title: "Finding God in the Quiet Hours After Call",
    slug: "finding-god-in-the-quiet-hours-after-call",
    excerpt:
      "The most honest prayers I pray happen in the empty hospital car park at 6 a.m., still in scrubs. Here's what those quiet hours have taught me about faith, exhaustion, and the God who sits with tired women.",
    category: "faith",
    tags: ["prayer", "resident-life", "solitude", "devotion"],
    coverUrl:
      "https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&w=1600&q=80",
    publishedAt: "2026-04-26T06:30:00.000Z",
    featured: true,
    content: lex(
      ps(
        "There is a particular kind of silence that lives in a hospital car park at six in the morning, after a thirty-hour stretch of calls. The cleaners haven't started shifts. The day team is still in traffic. The night team is exhaling. You walk out, badge swinging, eyes burning, and the air feels almost sacred — the way church feels sacred when you arrive before anyone else.",
      ),
      ps(
        "I never planned to meet God in a hospital car park. I planned to meet Him in long mornings with worship music and a leather-bound Bible. But seasons of life have a way of relocating the altar. And in this season — residency, late twenties, single, far from home — the altar has moved. It is now a Toyota Vitz with the engine off, the dashboard glowing soft, and a heart so tired that pretence is no longer an option.",
      ),
      ps(
        "I want to write about that. Not about prayer in theory, but about what prayer actually looks like for a girl who works in scrubs and prays in the gaps. About the kind of faith that survives when there is no time, no platform, no production — only fluorescent corridors and the quiet hours after call.",
      ),
      h2("Why I stopped pretending I had a quiet time"),
      ps(
        "For most of medical school, I carried a particular guilt: I was not having a 'proper' quiet time. I had read every book that suggested an hour with the Word at five a.m., a journal, a candle, and an immaculate prayer life that ended in journaled gratitude lists. I tried. I really did. But residency happens. Calls happen. Anaemic mothers in resus happen. And one morning, around the third week of internship, I sat on my bed in a hostel and realised I had not opened my Bible in nine days.",
      ),
      ps(
        "Guilt arrived first, as guilt often does. But underneath it was a quieter, more honest question: what if the version of devotion I had inherited was not actually built for this life? What if God was not waiting for me to perform a quiet time, but to come — even at six a.m., still in scrubs, with nothing prepared?",
      ),
      ps(
        "It took me embarrassingly long to believe Him on that. But the day I did, something shifted. The car park became the cathedral. The empty Vitz with its dashboard glow became the prayer closet. And I began to understand that the depth of my walk with God was not measured by the aesthetic of my mornings, but by the honesty of my conversation with Him.",
      ),
      callout(
        "quote",
        "What I tell my younger self",
        "God is not impressed by the architecture of your devotion. He is moved by the willingness of your presence. Show up tired. Show up empty. Show up in scrubs. He is there.",
      ),
      h2("The architecture of a tired prayer life"),
      ps(
        "I think we underestimate how spiritually formative tired seasons can be. When you have nothing to perform with, you discover what is actually there. When the inspiration runs out, you find out whether you love God or whether you love feeling spiritual. Those are very different things.",
      ),
      ps(
        "Here is the architecture of my current prayer life — written down not because it is impressive, but because someone reading this needs to know that a faithful walk with God can look like this and still be a faithful walk:",
      ),
      ul(
        "Three sentences in the car before I drive home. Just three. Sometimes 'thank You', 'forgive me', 'help me'. That is the entire liturgy.",
        "A psalm in the bathroom while the water runs. Usually Psalm 23 or 121 — short enough to memorise, deep enough to soak in.",
        "One song on the drive in. The whole drive. Loud enough to drown out the to-do list. Worship counts as prayer when you let it.",
        "A scripture lock-screen. Not a verse-of-the-day app — a single verse for a season. Currently: Isaiah 40:31.",
        "Sunday as the long meal. Two hours, a real Bible, real journaling, the slow feast that the week could not host.",
      ),
      ps(
        "It is not glamorous. It will never make a Pinterest board. But it is real, and it is mine, and slowly it is changing me.",
      ),
      h2("Praying between patients"),
      ps(
        "There is a practice that I have come to love. I call it 'doorway prayer'. It is exactly what it sounds like: in the half-second between leaving one patient's bedside and arriving at the next, I pray. Not eloquently. Not aloud. Just a hand on the door frame and a sentence: 'Lord, help me see her.'",
      ),
      ps(
        "On busy days that prayer becomes a rhythm. Door, prayer, patient, door, prayer, patient. By the end of the round I have prayed forty times. Forty short, ragged, half-formed prayers — and I am convinced that God hears every one of them with the same attention He gives to the tidy hour-long ones I used to write in journals.",
      ),
      ps(
        "Doorway prayer also keeps me honest. It is hard to walk into a patient's room with God on your lips and contempt in your heart. The practice slowly, slowly, files down the edges. It reminds me that medicine is not just a job; it is a sanctuary in which I am being formed.",
      ),
      h2("The verses I keep returning to"),
      ps(
        "Different seasons send you back to different scriptures. In medical school I lived in Romans. In internship I lived in Psalms — particularly the angry ones, the ones nobody preaches. In this current season I keep landing in three places, almost without choosing them:",
      ),
      ul(
        "Isaiah 40:28–31 — 'He gives strength to the weary and increases the power of the weak.' I have read this in a call room at 3 a.m. and felt it lift the cement off my chest.",
        "Matthew 11:28–30 — 'Take My yoke upon you and learn from Me, for I am gentle and humble in heart.' Gentleness is not a word doctors hear about themselves often. He keeps offering it.",
        "Psalm 139 — particularly the part about being known. When you have spent the day knowing other people's bodies, it is a kind of grace to remember that you, too, are known.",
      ),
      h2("What faith is doing in me"),
      ps(
        "I used to think faith was the thing that made me a better person. Now I think faith is the thing that gives me somewhere to put the parts of me that are not better yet. The exhaustion. The frustration with the system. The grief I do not have time to feel during the day. The quiet anger about the patient we lost on Tuesday.",
      ),
      ps(
        "Prayer is the place I bring those things. Not to be rid of them — God is not a vending machine for catharsis — but to set them down somewhere safe. The car park, the bathroom, the doorway, the drive in. These are the small altars of a tired girl trying to walk faithfully with God in a season that does not always feel sacred.",
      ),
      ps(
        "If you are reading this and your devotion looks nothing like the books told you it should — be encouraged. The God who met Elijah under the broom tree, who fed him bread and let him sleep before asking him a single question, is the same God who meets us in our scrubs. Show up. Whisper the three sentences. Let the dashboard be the candle. He is not asking for the architecture. He is asking for you.",
      ),
      hr(),
      ps(
        "Tomorrow I will be on call again. Somewhere in the small hours I will pray a doorway prayer that will not make it into any book. And it will count.",
      ),
    ),
  },

  // ── 2. Faith — Daily Devotion for a Resident ─────────────────────────────
  {
    title: "What Daily Devotion Actually Looks Like for a Resident Doctor",
    slug: "daily-devotion-for-a-resident-doctor",
    excerpt:
      "Forget the Pinterest morning routine. Here is a real, working ten-minute devotion built for ward rounds, night shifts, and the kind of week where you forget what day it is. Practical, biblical, and unapologetically small.",
    category: "faith",
    tags: ["devotion", "scripture", "habits", "resident-life"],
    coverUrl:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&w=1600&q=80",
    publishedAt: "2026-04-22T07:00:00.000Z",
    content: lex(
      ps(
        "If you ask the internet what a Christian woman's morning routine should look like, you will be told to wake at four-thirty, light a candle, drink lemon water, journal three pages, read four chapters, and pray for fifteen minutes — all before the sun rises. Then you will be expected to go to work, come home, mother small humans, and host community group on Wednesdays. The image is beautiful. The image is also a fantasy for anyone working a fifty-six-hour week in scrubs.",
      ),
      ps(
        "I love a good morning routine. I have tried most of them. Almost none survive contact with a post-call afternoon or a 5 a.m. handover. So I had to build something else — not a hack, not a shortcut, but a small, sustainable rhythm that holds up under the actual conditions of resident life. I want to share it, in case you are also tired and tired of feeling spiritually behind.",
      ),
      h2("Three convictions before the routine"),
      ps(
        "Before any practical structure, I had to settle three things in my heart. They are unsexy and quiet, but they undergird everything that follows.",
      ),
      ul(
        "Devotion is not productivity. The aim of a quiet time is not to get something done. It is to be with Someone. The minute it becomes a task on a list, it has already lost the plot.",
        "Small and consistent beats big and sporadic. Five minutes every day, for a year, will form you in ways that an annual silent retreat cannot.",
        "God is not waiting at the end of a perfect routine. He is in the room already. The routine is the door I open, not the bridge I build.",
      ),
      h2("The ten-minute morning"),
      ps(
        "On a normal day — the kind where I am not on call and not coming off call — my devotion looks like this:",
      ),
      h3("Minute 1 — sit down before you do anything"),
      ps(
        "No phone. No to-do list. Just sit. Let the body remember it is in the presence of God. Sometimes the most spiritual thing a tired woman can do is refuse to rush.",
      ),
      h3("Minutes 2–6 — read one passage, slowly"),
      ps(
        "I follow a one-year reading plan, but I do not race it. If a verse stops me, I stop. I would rather read three verses with attention than three chapters on autopilot. I keep the Bible in print, on the bed, with a single pencil. The pencil is important; underline what stings.",
      ),
      h3("Minutes 7–9 — write three lines"),
      ps(
        "Not a journal. Three lines. A Moleskine, a Post-it, the back of a call sheet. Line one: what I noticed. Line two: who that reveals God to be. Line three: how I will live in the next eight hours because of it. Brutally short. Endlessly fruitful.",
      ),
      h3("Minute 10 — pray, by name"),
      ps(
        "I pray for three people, by name. The list rotates by day of the week so that everyone I love gets prayed for at least once a fortnight. I also pray a single sentence for the patients I will see today: 'Help me see them. Help me serve them. Help me not perform.'",
      ),
      callout(
        "info",
        "Why ten minutes",
        "Ten minutes is small enough to be possible on a bad week and large enough to be transformative when stacked across a year. Aim for the floor, not the ceiling.",
      ),
      h2("The on-call rhythm"),
      ps(
        "Calls break everything. There is no pretending otherwise. So I do not try to keep the morning rhythm on call days. Instead I have a smaller, mobile version that lives in my pocket.",
      ),
      ul(
        "A pre-shift psalm. Read in the locker room before the badge goes on. Usually Psalm 23, 27, 91, or 121. They are short, ancient and they steady you.",
        "Doorway prayers between patients. One sentence at the door of every room. 'Lord, give me eyes for her.'",
        "A single recovery scripture for after the call. I read the same verse for a whole month. Currently it is Isaiah 40:31. Slow repetition is not laziness; it is how scripture becomes furniture in the soul.",
      ),
      h2("What I have stopped trying to do"),
      ps(
        "I want to be honest about the things I had to surrender to make this rhythm work. Some of them were ego dressed up as discipline.",
      ),
      ul(
        "Reading large chapters in one sitting. Lectio beats lecture in a tired week.",
        "Long, themed prayer journals. They were beautiful. They became homework. They had to go.",
        "Christian guilt about missed days. Missed days are not apostasy. Pick the rhythm back up tomorrow without the lecture.",
        "Comparing my devotion to other women's curated versions. The internet is not a discipleship community. Your real-life mentor is.",
      ),
      h2("What grows out of it"),
      ps(
        "After about eighteen months of doing this — imperfectly, with weeks I missed entirely — I noticed something. My theology felt small in a good way. Less abstract. More wired into the actual fabric of patient care, friendship, exhaustion, prayer.",
      ),
      ps(
        "I started to recognise God's voice in the middle of a clinic. I started to feel a hand of restraint on my temper before a difficult patient. I started to want prayer the way you want water on a hot ward — not as a duty, but as a need.",
      ),
      ps(
        "If you are at the start of building something like this, do not aim for impressive. Aim for daily. Build the floor. Let God do the rest.",
      ),
      hr(),
      ps(
        "Devotion is not a personality trait. It is a small, repeatable conversation between a tired girl and a patient God. Ten minutes is enough to start. Tomorrow morning is enough of a beginning.",
      ),
    ),
  },

  // ── 3. Faith — Theology of Bedside Manner ────────────────────────────────
  {
    title: "The Theology of Bedside Manner",
    slug: "the-theology-of-bedside-manner",
    excerpt:
      "Bedside manner is not a soft skill. It is a theological act. Every patient I see bears the image of God, and how I touch, listen and explain says something about what I believe about Him. Here is what faith has done to my hands.",
    category: "faith",
    tags: ["patient-care", "presence", "scripture", "identity"],
    coverUrl:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&w=1600&q=80",
    publishedAt: "2026-04-19T08:00:00.000Z",
    content: lex(
      ps(
        "On my first day of internship, a senior consultant pulled me aside in front of a patient and corrected my hand position on her abdomen. 'Warm your hands. Look at her face. Tell her what you are about to do, in words she can use.' He said it gently, in front of the woman, and she smiled at me like she had been waiting forty years for someone to be told that.",
      ),
      ps(
        "I did not know it then, but he had given me a theology lesson disguised as a clinical correction. Bedside manner is not a soft skill. It is a theological act. Every patient is, in the words of Genesis, made in the image of God — and the way I approach her body says something about what I believe about her, about myself, and about Him.",
      ),
      ps(
        "I want to write about what faith has done to my hands. Not in a sentimental way. In a practical, observable, written-down way. Because I think Christians in medicine sometimes treat faith as the thing that happens at the start of the shift in the chapel, when in fact it is meant to live in our forearms as we examine.",
      ),
      h2("Imago Dei in a paper gown"),
      ps(
        "The doctrine of the image of God is easy to nod at in a sermon and easy to forget in the casualty department at three a.m. when the queue is forty deep. But it is the doctrine that organises all the others.",
      ),
      ps(
        "If a patient is made in the image of God, then her body is not merely a problem to solve. It is a temple I am invited into. Her shame about her body is not silly — it is the echo of Eden, of fig leaves, of being naked and ashamed. My job is not to override her shame in the name of efficiency. My job is to honour it, even as I work.",
      ),
      ps(
        "Practically, that means warming your hands. Not because it is in a textbook. Because cold hands on a frightened body communicate something that is not Christ.",
      ),
      callout(
        "quote",
        "A short rule I keep",
        "Touch like Christ. Speak like Christ. Listen like Christ. If you cannot do all three at once, start with listening — it is the easiest one to do badly while looking like you are doing well.",
      ),
      h2("The four habits I have built"),
      ps(
        "These are four small habits I have folded into my clinical routine. They are not spiritual masterpieces. They are physical disciplines that make space for theology.",
      ),
      h3("1. Sit down at every long conversation"),
      ps(
        "If a conversation will take more than ninety seconds, I sit. I learnt this from a paediatrician who said, 'Standing means I am leaving. Sitting means I have time.' Even when I do not have time, sitting tells the patient that I am giving her the time I have.",
      ),
      h3("2. Use the patient's name out loud, twice"),
      ps(
        "Once at the start, once at the end. It sounds small. It is. It also undoes a lifetime of being called 'the gallbladder in bed three'.",
      ),
      h3("3. Translate, do not perform"),
      ps(
        "Medical jargon is an adult version of showing off. I now translate every diagnosis into one sentence a thirteen-year-old could repeat. If I cannot translate it, I do not understand it well enough to be teaching it.",
      ),
      h3("4. End with the agency question"),
      ps(
        "Before I leave the bedside I ask, 'What is one thing you would like to know that I have not told you?' It opens a door. People walk through it more often than the textbooks predict.",
      ),
      h2("When the theology is hardest"),
      ps(
        "It is easy to practise dignified bedside manner with the patient who is grateful and articulate and well-dressed. It is harder with the man who is rude because he is frightened. With the woman who has been failed by the health system so many times that she expects you to fail her too. With the patient who smells of urine and old grief.",
      ),
      ps(
        "Those are the patients who form me. Because the theology is most real where it costs me something. If the image of God in a patient is only honoured when the patient is pleasant, then it was never the theology that was operating; it was preference.",
      ),
      ps(
        "I have stopped asking, 'Do I like this patient?' I now ask, 'Does this patient know I see her?' Those are very different questions, and only one of them is mine to answer.",
      ),
      h2("On praying for patients without making it weird"),
      ps(
        "I do not lay hands on patients in clinic. I do not ask if they want me to pray with them mid-examination. There is a kind of evangelical performance in clinical settings that I think confuses faithfulness with theatre.",
      ),
      ps(
        "Instead, I pray quietly. In the hand-wash basin between patients. In the doorway. As I open her file on the computer. Sometimes a patient will ask me to pray, and then I will. But the default is silence, and the default is fine. Christ does not need me to brand my care for it to be His.",
      ),
      h2("What I want to be true of me in twenty years"),
      ps(
        "I think a lot about the kind of doctor I want to be in two decades. The technical competence will, God willing, be there. What I want more than competence is this: I want my patients to leave my room feeling more human, not less. I want the way I touched them to remind them that they are loved, even if they cannot name by Whom.",
      ),
      ps(
        "If faith ever becomes something I do off-duty, in church, on Sundays, while my Monday-to-Friday hands behave like everybody else's — then I have missed it. The whole point is for theology to live in the way I lay my stethoscope on a chest.",
      ),
      hr(),
      ps(
        "Bedside manner is not the part of medicine that comes before the real work. It is the real work. Everything else is plumbing.",
      ),
    ),
  },

  // ── 4. Faith — When Prayer Meets a Code Blue ─────────────────────────────
  {
    title: "When Prayer Meets a Code Blue",
    slug: "when-prayer-meets-a-code-blue",
    excerpt:
      "I believe in miracles. I also believe in chest compressions. Most days the gospel and the guidelines are not in conflict — they hold hands. A short essay on faith inside a resus bay.",
    category: "faith",
    tags: ["prayer", "patient-care", "scripture", "presence"],
    coverUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&w=1600&q=80",
    publishedAt: "2026-04-15T09:00:00.000Z",
    content: lex(
      ps(
        "The first cardiac arrest I ever ran was on a Wednesday. I remember because the post-call meeting on Wednesdays serves jollof, and I had been thinking about it just before the alarm went off. The patient — call her Mary — was 64, in for a chest infection that had quietly become more than a chest infection. The monitor went flat. The room reorganised itself the way casualty rooms do, like a small army that has been waiting all morning to be deployed.",
      ),
      ps(
        "I did chest compressions. I called the timing. I asked for the next dose of adrenaline. And somewhere in my mouth, with no audible sound, I prayed — 'Lord, please.' Two words. Not a sermon. Not a request for a sign. Just 'please'. And I kept compressing.",
      ),
      ps(
        "We got her back, briefly. Long enough to call the family. She died at 3.47 a.m., with her daughter at the bedside, holding her wedding ring. I sat in the on-call room afterwards with my scrubs still wet at the chest, and I thought about the relationship between prayer and protocol. Between the gospel and the guidelines. Between miracle and medicine. I want to write down what I have come to believe.",
      ),
      h2("The false binary I had to leave behind"),
      ps(
        "Somewhere in early Christian formation many of us pick up the idea that prayer and clinical action are competing currencies — as though doing more of one means less faith in the other. I was taught, gently and badly, that to pray is to trust and to act is to take matters into your own hands.",
      ),
      ps(
        "Medicine cured me of that. Or, more accurately, scripture re-cured me of it. The Lord who feeds the five thousand also asks the disciples to count the loaves. The Lord who heals the blind also makes mud with His own spit. The pattern in the gospels is rarely 'pray instead'. It is 'pray and'.",
      ),
      callout(
        "quote",
        "Two truths held in one hand",
        "Run the algorithm. Pray the prayer. Both belong. Neither replaces the other. The doctor who only prays is dangerous. The doctor who never prays is incomplete.",
      ),
      h2("What I have learned about prayer in resus"),
      ps(
        "Resus is loud. There is no time for posture, candles, or the architecture of devotion. So the prayers shrink to the size of a breath. Here is the small, mobile theology of prayer I have grown into:",
      ),
      ul(
        "One word at a time is enough. 'Please.' 'Mercy.' 'Help.' God parses brevity.",
        "Pray for clarity, not just outcome. The most useful resus prayer is not 'save her' — it is 'show me what to do next'. The first is His to answer; the second moves my hands.",
        "Pray for the people in the room. The nurses, the porter, the husband sitting in the corridor. Resus has a wider parish than the patient.",
        "Pray after, not just during. The afterwards prayers are the long ones. The ones where I tell God what I felt and what I am afraid of.",
      ),
      h2("On the hard cases"),
      ps(
        "Sometimes prayer feels like shouting into a hurricane. The patient does not survive. The family does not understand. The system fails the most vulnerable. I have stood in mortuaries with parents whose children should still be alive and felt nothing but a cold, theological vertigo.",
      ),
      ps(
        "I do not have easy words for those moments. I do not believe a faithful response is to manufacture peace I do not feel. What I have come to believe is this: God is not afraid of my anger and He is not allergic to my doubt. I can stand in the mortuary and say, 'I do not understand this, and I am angry, and I still trust You.' Three sentences. They have held me up more than any tidy theology has.",
      ),
      h2("What I tell junior interns"),
      ps(
        "I am still very junior myself, but new interns ask me about the spirituality of medicine, and I usually say two things.",
      ),
      ul(
        "Do not weaponise prayer. Praying with patients without their consent is a kind of pastoral malpractice. Patients are not souls you have permission to perform on.",
        "Let the work be the prayer. Hands, careful. Notes, accurate. Listening, attentive. Diagnosis, considered. The work itself, done well, is a liturgy.",
      ),
      h2("What that Wednesday taught me"),
      ps(
        "Mary did not survive. Her daughter, the one with the wedding ring, hugged me at the end and said, 'Thank you for being kind.' She did not say thank you for being skilled. She said thank you for being kind. I have thought about that for two years.",
      ),
      ps(
        "The technical competence is non-negotiable. People deserve doctors who know what they are doing. But after the algorithm has been run and the meds have been given and the chest compressions have been counted, what people remember is whether you were present. Whether you saw them. Whether you treated their loved one like she mattered. That part is not in the textbook. That part is the gospel doing its work in your hands.",
      ),
      hr(),
      ps(
        "Pray. Run the algorithm. Pray again. Sit with the family. Cry in the car if you need to. Then go home and sleep and get up and do it again, by the grace of the Christ whose hands also healed.",
      ),
    ),
  },

  // ── 5. Sport — 5 AM Run ──────────────────────────────────────────────────
  {
    title: "Why I Run at 5 a.m., Even on Post-Call Mornings",
    slug: "why-i-run-at-5am-even-post-call",
    excerpt:
      "I am not a morning person. I am not a natural athlete. But the 5 a.m. run is the load-bearing wall of my week. Here is the case for a small, stubborn habit that has held me together through internship, heartbreak and humid Accra summers.",
    category: "sport",
    tags: ["running", "discipline", "habits", "mental-health"],
    coverUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&w=1600&q=80",
    publishedAt: "2026-04-12T05:30:00.000Z",
    featured: true,
    content: lex(
      ps(
        "There is a particular flavour of madness involved in lacing up at 5 a.m. when you got home from call at 11 p.m. I am aware of how it sounds. I am aware that the most evidence-based advice I could give a tired resident is, 'sleep'. I have read the studies. I have lived through the consequences of ignoring them.",
      ),
      ps(
        "And yet, on most mornings — even the post-call ones — I am out the door before the sun is up. Not because I am disciplined. Not because I am fit. Because I have learnt, the slow way, that this one small habit is the load-bearing wall of my entire week. Take it out and the whole house starts to wobble.",
      ),
      ps(
        "I want to write about why. Not as a productivity gospel. Not as the next morning routine influencer pitch. As a medical student turned junior doctor who needed something other than caffeine to hold her together, and found it on a road in Accra at sunrise.",
      ),
      h2("What the 5 a.m. run actually buys me"),
      ps(
        "I used to think morning workouts were about fat loss and abs. They are about neither, for me. The 5 a.m. run buys me four things, in roughly this order:",
      ),
      ul(
        "A win that is mine before the day starts demanding things of me. By 6 a.m. I have already done a hard thing. The rest of the day is bonus.",
        "Forty minutes alone with my own thoughts before the inbox starts shouting. This is now the only consistent solitude in my week.",
        "A body that can do the job. Internship is physically punishing. The run keeps me strong enough to stay on my feet for fourteen hours without my back giving way.",
        "An honest barometer of how I am doing. The day I cannot face the run is the day I should pay attention to my mental health. The run tells me before my journal does.",
      ),
      h2("The mechanics of getting out the door"),
      ps(
        "I am not naturally disciplined. I have outsourced that. The mechanics of getting out the door at 5 a.m. — without thinking about it — are five rules I do not break:",
      ),
      h3("1. The clothes sleep on the chair"),
      ps(
        "Shorts, sports bra, top, socks, watch. All laid out before bed. The decision to run is made the night before, not the morning of.",
      ),
      h3("2. The phone sleeps in the kitchen"),
      ps(
        "If I check the phone, I will not run. Distance between my bed and the device is the only thing standing between me and a doom-scroll instead of a workout.",
      ),
      h3("3. The first ten minutes are negotiable"),
      ps(
        "I do not promise myself a full workout. I promise the first ten minutes. After ten minutes, I have always finished the run. Not most days — every day. Ten minutes is the lie I tell myself to get out of bed; the rest is just momentum.",
      ),
      h3("4. There is no plan B route"),
      ps(
        "I run the same loop. Choosing routes is decision-making, and tired women do not have decisions to spare at 5 a.m. The same loop, four times a week, for eighteen months. I know every pothole, every dog, every stretch where the church choir practises.",
      ),
      h3("5. The streak matters more than the speed"),
      ps(
        "I would rather run slow for sixty days than fast for ten and quit. Identity is built by repetition, not intensity. I am not chasing a personal best. I am chasing the version of me who shows up.",
      ),
      callout(
        "info",
        "Post-call exception",
        "If I am genuinely sleep-broken — under three hours of sleep — I walk the loop instead of running it. Movement, not mileage. The sacred thing is the going, not the pace.",
      ),
      h2("What running has taught me about medicine"),
      ps(
        "I keep finding that the lessons running teaches me are the lessons medicine asks of me. Both reward consistency over heroics. Both punish the ego that thinks it can skip the foundational work. Both are long games dressed up to look like short ones.",
      ),
      ul(
        "The pace you can sustain on a hard day is more important than the pace you can hit on a good day.",
        "Showing up tired counts. It counts more, in some ways, than showing up fresh.",
        "You cannot out-train an unrested body. You cannot out-medicate an under-cared-for self.",
        "Pain is information, not punishment. Listen to where it is coming from.",
      ),
      h2("What running has taught me about faith"),
      ps(
        "I did not expect this one. I expected the run to be physical. I have found it to be, somehow, deeply spiritual. I think because the body is a kind of liturgy. You do the same small thing, repeatedly, until it shapes you.",
      ),
      ps(
        "On the loop I pray. Not formally — there is no candle on a 5 a.m. road — but the rhythm of breath and footfall makes a strange and welcoming space for God. Some of the most honest conversations I have had with Him have happened around mile three.",
      ),
      h2("On being a woman who runs alone in this country"),
      ps(
        "I am writing this as a young woman in Accra who runs in the dark. I know what is asked of women here. I know the calculations we make. I have my own list — the routes that are well-lit, the watch that pings my flatmate, the headphone in one ear only. I do not pretend it is fearless. It is mostly stubborn.",
      ),
      ps(
        "But I will not give up the road. The road is too important. The 5 a.m. is too sacred. So I keep running, with the small precautions, with the watchful awareness, with my hand on the gospel of stewardship, and I refuse to surrender the morning.",
      ),
      hr(),
      ps(
        "If you are looking for permission to start something small and stubborn — consider this it. Your version may not be a 5 a.m. run. It might be a walk, a prayer, a glass of water, a stretch on the floor before the world starts. Whatever it is, build the floor. The rest of the building will rise from there.",
      ),
    ),
  },

  // ── 6. Sport — Strength Training ─────────────────────────────────────────
  {
    title: "Strength Training for the Long Game: A Doctor's Approach",
    slug: "strength-training-for-the-long-game",
    excerpt:
      "I do not lift to look a particular way. I lift because I want to still be picking up grandchildren when I am seventy. Here is a calm, evidence-led case for why every woman — especially the busy ones — needs to be lifting heavy things.",
    category: "sport",
    tags: ["strength-training", "discipline", "habits", "patient-care"],
    coverUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&w=1600&q=80",
    publishedAt: "2026-04-08T07:00:00.000Z",
    content: lex(
      ps(
        "I want to make a slightly unfashionable case. We have spent two decades telling women to do cardio and Pilates and pretend the squat rack is for boys. I am here, in scrubs and in a sports bra, asking us to reconsider. Strength training is not a vanity project. It is one of the most boring, evidence-backed, transformative things a woman can do for her future self.",
      ),
      ps(
        "I started lifting properly in my third year of medical school. Not because I wanted aesthetic abs. Because I had read the bone density curves for women over forty and found them frightening. I did not want to be the seventy-year-old in clinic with a hip fracture from a fall that should not have mattered. So I picked up a barbell and have not put it down.",
      ),
      ps(
        "I am writing this for the woman who has never lifted, who has been told weights will make her bulky, who is busy and tired and underwhelmed by the gym. This is the calm, doctor-flavoured case for why you should reconsider.",
      ),
      h2("What lifting actually does to a woman's body"),
      ps(
        "Let us be technical for a paragraph. Resistance training drives several adaptations that cardio simply cannot replicate. Skeletal muscle mass increases. Bone mineral density improves — particularly important from age thirty onwards as we begin a slow, decade-by-decade decline. Insulin sensitivity improves. Tendon and connective tissue resilience improves. Posture, balance and proprioception improve, which translates directly into reduced fall risk in later life.",
      ),
      ps(
        "Most importantly: muscle is metabolically expensive tissue. It changes how your body uses glucose, manages stress hormones and recovers from illness. The seventy-year-old who walks confidently into your clinic, lifts her grocery bag without thought and recovers from her chest infection in a week — she is the woman who lifted in her thirties.",
      ),
      callout(
        "info",
        "On the 'bulky' fear",
        "It takes years of dedicated effort, careful nutrition and a particular hormonal profile to build the kind of muscle women fear in stock photos. You will not accidentally become bulky by lifting twice a week. You will become strong, capable and resilient.",
      ),
      h2("What lifting has done to me"),
      ps(
        "Numbers I do not chase, but track. My deadlift has gone from 40 kg to 110 kg over four years. My squat is at body-weight-plus. I can carry a full kit-bag up four flights without my heart making a fuss. I can stand for twelve hours in theatre without my back collapsing.",
      ),
      ps(
        "But the real benefits are quieter. I sleep better on lifting days. My mood is more stable through hard call rotations. My posture, after years of hunching over notes, is straighter. I walk into rooms differently. I do not say that to brag. I say it because the way you hold your body shapes the way you carry yourself in the world. Strength is not just physical.",
      ),
      h2("A four-day program a busy woman can keep"),
      ps(
        "Here is the program I have run on and off for the last eighteen months. It is unsexy. It is repetitive. It works.",
      ),
      h3("Day 1 — Lower body push"),
      ul(
        "Back squat — 4 sets of 5",
        "Walking lunges — 3 sets of 10 per leg",
        "Romanian deadlift — 3 sets of 8",
        "Plank — 3 holds of 45 seconds",
      ),
      h3("Day 2 — Upper body push"),
      ul(
        "Overhead press — 4 sets of 5",
        "Push-ups — 3 sets to near-failure",
        "Dumbbell incline press — 3 sets of 8",
        "Tricep dips — 3 sets of 10",
      ),
      h3("Day 3 — Lower body pull"),
      ul(
        "Conventional deadlift — 4 sets of 5",
        "Hip thrusts — 3 sets of 10",
        "Single-leg Romanian deadlift — 3 sets of 8 per leg",
        "Hanging knee raises — 3 sets of 10",
      ),
      h3("Day 4 — Upper body pull"),
      ul(
        "Pull-ups (or assisted) — 4 sets of 5",
        "Barbell rows — 3 sets of 8",
        "Face pulls — 3 sets of 12",
        "Bicep curls — 3 sets of 10",
      ),
      ps(
        "Forty-five minutes a session. Four days a week. Compound movements first, accessories second. Add weight when the last set feels easy. That is, in essence, the entire game.",
      ),
      h2("Form is the entire fight"),
      ps(
        "If you take one thing from this essay, take this: lift with good form before you lift heavy. The biggest reason women hurt themselves with weights is loading up before the movement is correct. Spend a month with light weights and excellent technique. Film yourself. Get a coach for two sessions if you can. The first six weeks are the foundation. Build them well and the next thirty years are easy.",
      ),
      h2("Recovery is half the work"),
      ps(
        "I cannot say this loudly enough. Sleep, protein and rest days are not optional accessories. They are the actual mechanism by which strength is built. Lifting breaks down muscle. Recovery rebuilds it. If recovery is missing, the program does not work — it just makes you tired.",
      ),
      ul(
        "Aim for 1.4–1.8 g of protein per kg body weight on training days.",
        "Sleep is the most important supplement. Protect it like a relationship.",
        "One full rest day a week, minimum. Two if you have been on call.",
        "If a movement hurts in a sharp way, stop. Pain is data; ignore it at your peril.",
      ),
      h2("Why this matters to me as a doctor"),
      ps(
        "I see, every week, the cost of decades of inactivity in women's bodies. Hip fractures. Sarcopenia. Falls that take six months to recover from. Diabetes that is largely a story of muscle that did not exist in time. The interventions we offer at sixty-five are valuable — but they are downstream of decisions made at thirty-five.",
      ),
      ps(
        "When I lift, I am not chasing aesthetics. I am voting with my time for the seventy-year-old version of me. I would like her to be capable. I would like her to be strong. I would like her to pick up her grandchildren without asking for help. So I pick up the barbell now.",
      ),
      hr(),
      ps(
        "Lift heavy things. Lift them slowly. Lift them for years. The future you, in scrubs or in a kitchen or in a garden, will thank you in ways the gym mirror never will.",
      ),
    ),
  },

  // ── 7. Sport — Long Run ──────────────────────────────────────────────────
  {
    title: "Lessons From the Long Run About Patience and Pain",
    slug: "lessons-from-the-long-run-about-patience-and-pain",
    excerpt:
      "Distance running is the cheapest therapist I have. After a year of building from 5 km to a half marathon, I have a small notebook of things the long run has taught me about the body, the mind, and the slow grace of going on.",
    category: "sport",
    tags: ["running", "discipline", "patience", "mental-health"],
    coverUrl:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&w=1600&q=80",
    publishedAt: "2026-04-04T06:00:00.000Z",
    content: lex(
      ps(
        "A year ago I could not run 5 km without my lungs threatening me. Last month I finished my first half marathon, slowly, alone, in a lightly raining Saturday morning that nobody photographed. I was not fast. I did not place. I crossed the line in two hours and thirteen minutes, walked another two kilometres home in a kind of sacred daze, and ate a banana while standing on my balcony.",
      ),
      ps(
        "I want to write about what those twelve months taught me. Not the training plan — there are a thousand of those online — but the inner architecture that grew while my legs grew. The long run, more than anything else I have ever done, has been a kind of slow seminary. It has taught me about patience, pain, faith and the shape of a self that can keep going.",
      ),
      h2("On the deceptive smallness of the early kilometres"),
      ps(
        "When I started training, I could not understand why coaches kept saying, 'go slower'. I am a doctor. I am used to reading evidence and obeying it. But going slower felt like cheating. The runs were so easy I doubted they were doing anything.",
      ),
      ps(
        "Eight months later I understood. The slow runs were not the appetiser. They were the meal. The slow kilometres were where my heart muscle thickened, my mitochondria multiplied, my tendons learnt to absorb and return force. The fast runs got the credit; the slow runs did the work.",
      ),
      ps(
        "This pattern is everywhere in life. The flashy seasons are not where the foundation is built. The boring kilometres are. Show up to the slow work. Trust the unglamorous repetition.",
      ),
      callout(
        "quote",
        "What I keep on a Post-it",
        "You do not rise to the level of your goals. You fall to the level of your foundations. Build the foundations.",
      ),
      h2("On the second wall — the one nobody warns you about"),
      ps(
        "Everyone talks about the wall in marathon running — the famous mile twenty crash. The half-marathon has its own version, smaller and meaner. It arrives at about kilometre fourteen. You are too far to give up and too tired to romanticise it. The body negotiates with the mind in real time.",
      ),
      ps(
        "I have learnt to expect it now. The first time it hit me, on a training run, I sat down on a kerb and cried. The second time, I just kept moving and let the negotiation happen out loud. The third time, I had a script: 'You can be tired. You cannot be done. Tired and done are different things. Pick which one you are.'",
      ),
      ps(
        "It turns out you are tired far more often than you are done. Almost every wall is a tired wall, not a done wall. Naming the difference is half the battle.",
      ),
      h2("On running through grief"),
      ps(
        "I lost a patient at the end of December last year. A woman my mother's age, who I had known for three weeks of a long admission. She died on a Saturday and I ran sixteen kilometres on the Sunday and I cannot tell you exactly why except that it was the only thing I knew how to do.",
      ),
      ps(
        "I do not recommend running as a substitute for grief. I recommend it as a place where grief can move. The body holds what the mind has not finished processing. Movement does not solve grief; it gives it somewhere to live until you are ready to think about it.",
      ),
      ps(
        "Some of the most important conversations of my life have happened in my own head between kilometres eight and twelve. Cheaper than therapy. Not better. Just different. Both belong.",
      ),
      h2("On the company of the early morning"),
      ps(
        "There is a community of people you only meet at 5 a.m. on the road. The two retired gentlemen who walk together every morning. The man with three children who runs in a yellow vest. The young woman with the white headphones who never says hi but nods. The taxi drivers waving from their windows at the small parade of madness.",
      ),
      ps(
        "We do not know each other's names. But we recognise each other. There is something deeply un-lonely about being part of a quiet, anonymous community of people who all decided to do a hard thing today. The road is not crowded but it is peopled. That has mattered more to me than I expected.",
      ),
      h2("On pain as a teacher"),
      ps(
        "I will not romanticise pain. I am a doctor. I know what pathological pain is and I know what training pain is and I know the difference matters. But I have come to a slightly heretical view: a small amount of voluntary, controlled discomfort is one of the most important things a comfortable, busy life can include.",
      ),
      ps(
        "Discomfort teaches you that you are bigger than your moods. The morning you did not want to run and ran anyway is the morning that proves to your nervous system that mood is not law. That is a small psychological win that compounds over years.",
      ),
      ps(
        "We live in a culture that is allergic to discomfort. The long run is one of the cheapest, most accessible ways to push back. You are not training to be punished. You are training to be free of the tyranny of how you happen to feel that morning.",
      ),
      h2("On going slow enough to last"),
      ps(
        "If I could give one piece of advice to the woman about to start running, it would be this: go slower than your ego wants you to. Run at a pace where you could hold a conversation. Build for months. Add distance, not speed. Speed will come; longevity will not unless you protect it from your impatience.",
      ),
      ps(
        "I want to be running at sixty. The way to do that is not to chase a personal best at twenty-eight. The way is to build a body that does not break, a habit that does not need motivation, and a mind that has befriended the slow.",
      ),
      hr(),
      ps(
        "The long run is, in the end, a small parable. It is a story about a person who got out of bed and did one hard thing slowly until it became a life. I cannot think of a better description of the kind of woman I am trying to be.",
      ),
    ),
  },

  // ── 8. Medicine — Things Med School Does Not Teach ───────────────────────
  {
    title: "Things Med School Does Not Teach You About Being a Doctor",
    slug: "things-med-school-does-not-teach-you",
    excerpt:
      "Six years of training and you still arrive at internship knowing very little about how to actually do this job. Here is the unofficial curriculum I wish someone had handed me on day one — paperwork, hierarchy, food, sleep and the small dignities that keep a junior doctor alive.",
    category: "medicine",
    tags: ["resident-life", "patient-care", "habits", "letter-to-self"],
    coverUrl:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&w=1600&q=80",
    publishedAt: "2026-04-01T08:00:00.000Z",
    content: lex(
      ps(
        "On my first day of internship, I knew the Krebs cycle, three differential diagnoses for almost any presenting complaint, and the precise mechanism of action of about forty drugs. I did not know how to find the photocopier, where to eat between rounds, or what to say when a senior consultant told me, in front of the entire team, that my hand-written notes were 'unreadable nonsense'.",
      ),
      ps(
        "Medical school teaches you medicine. It does not teach you how to be a doctor. The two are related but not identical. There is an unofficial curriculum — practical, social, emotional — that nobody hands you and everybody assumes you have already learned. I want to write some of it down, because I wish someone had handed it to me on day one.",
      ),
      h2("The paperwork is the job"),
      ps(
        "Medicine is mostly clerical. Mostly. The brilliant intervention you imagined when you wrote your personal statement is twelve per cent of the day. The other eighty-eight per cent is documentation, requisitions, discharge summaries, drug charts, calls to colleagues, calls to families, and the slow shuffling of paper from one tray to another.",
      ),
      ps(
        "Make peace with this early. The doctors who burn out fastest are often the ones who treat paperwork as an insult to their education. The paperwork is not the obstacle. The paperwork is the work. A clean drug chart saves more lives than a clever differential.",
      ),
      ul(
        "Write notes as if a court will read them. Because, occasionally, one will.",
        "Discharge summaries written before lunch will be twice as good as those written at 5 p.m. Plan your day around this.",
        "Find a system for your to-do list. Paper, app, sticky note — anything. Holding it in your head is how things fall through cracks.",
      ),
      h2("Hierarchy is real, and the hierarchy you choose to honour will shape your career"),
      ps(
        "Every hospital has at least three hierarchies. There is the official one — interns, residents, registrars, consultants. There is the medical knowledge hierarchy — who actually knows what they are talking about. And there is the moral hierarchy — who actually treats people, including junior staff, with dignity.",
      ),
      ps(
        "Junior doctors learn quickly to map all three. Watch carefully. Honour the official hierarchy publicly. Learn from the medical hierarchy quietly. But internalise the moral hierarchy as your model. The senior who is famous for his diagnoses but humiliates the nurses is not a model. The slightly less famous senior who makes time for a confused intern at 11 p.m. is.",
      ),
      callout(
        "info",
        "Find your people early",
        "Identify two senior people in your first month: a senior who will teach you medicine and a senior who will teach you how to be a person in medicine. They are rarely the same individual. Both are precious.",
      ),
      h2("Food is medicine — yours included"),
      ps(
        "I have seen interns faint on rounds because they had not eaten. I have seen registrars miss diagnoses because their blood sugar was crashing at 2 p.m. The body you bring to work is your most important diagnostic instrument. Feed it.",
      ),
      ul(
        "Carry a snack at all times. A boiled egg, a banana, a granola bar. Hunger has a remarkable ability to convert good doctors into careless ones.",
        "Drink water deliberately. Most hospital staff are mildly dehydrated by 10 a.m. and severely so by 4 p.m. Carry a water bottle. Refill it every break.",
        "Eat sitting down at least once during a shift, even for ten minutes. Eating while walking is not eating; it is fuel-grade insult.",
      ),
      h2("Sleep is not a luxury — it is a clinical tool"),
      ps(
        "There is a particular kind of pride junior doctors take in being sleep-deprived. It is dangerous and it is not impressive. The evidence is unambiguous: sleep-deprived doctors make more errors, take longer to make correct decisions, and have measurably worse interpersonal skills. You cannot opt out of this physiology.",
      ),
      ps(
        "Protect your sleep with the same fierceness you protect your patients' airways. On non-call days, be in bed by ten. On post-call days, sleep without guilt. The night you sacrificed for one more episode of a series will visit you in the form of the dosage error you almost made the next afternoon.",
      ),
      h2("Talking to families is its own subspecialty"),
      ps(
        "Nobody teaches us this in lectures. We are expected to learn by osmosis, by being in the room when a senior breaks bad news. The reality is that most of us learn by accident, often by getting it wrong on a Tuesday afternoon and being haunted by the conversation for a week.",
      ),
      ul(
        "Sit down. Always. Even if the conversation is brief. A standing doctor is a leaving doctor.",
        "Use the patient's name, often. 'Mary', not 'your mother'. It restores dignity.",
        "Pause more than you think necessary. Silence does the work that sentences cannot.",
        "Repeat the key information twice, in different words. Grief is amnestic.",
        "Offer something specific to do next. 'I will be back at six' is more comforting than 'we will see how she does'.",
      ),
      h2("On admitting you do not know"),
      ps(
        "The most important sentence in medicine is, 'I do not know — let me find out.' Not 'I do not know' alone. The full sentence. It tells the patient you are honest. It tells your senior you are safe. It tells you that you are still learning.",
      ),
      ps(
        "The interns who get into trouble are not the ones who do not know things. Everybody does not know things. The trouble starts when not knowing is hidden. Hidden ignorance becomes confident error. Confident error harms patients. Honest ignorance becomes conversation, which becomes learning, which becomes competence.",
      ),
      h2("On crying about it"),
      ps(
        "You will cry. Probably more than once. In a stairwell, in a car, in a bathroom cubicle. This is not a sign of weakness. It is a sign of a heart still capable of sorrow. The day medicine no longer makes you cry is the day to worry, not the day you weep.",
      ),
      ps(
        "Find one or two people you can be wrecked in front of. A peer who is going through it with you. A senior who once cried in a stairwell and remembers. A friend outside medicine who can hold the story without trying to fix it. You will need all three at different times.",
      ),
      h2("On still loving the work"),
      ps(
        "It is possible — necessary, even — to be honest about the brokenness of the system and still love the work. To name the bureaucracy, the underfunding, the staffing shortages, the moral injury, and still walk back into a clinic on Monday morning ready to be useful.",
      ),
      ps(
        "Cynicism is the easy posture. It is also the most expensive one. It costs you the joy of the work and your patients the doctor you were meant to be. Resist it. Name the bad things; do not let them rewrite your love of the calling.",
      ),
      hr(),
      ps(
        "Med school taught me medicine. The wards are teaching me how to be a doctor. The two are still not the same thing. They never will be. The space between is where most of us actually grow.",
      ),
    ),
  },

  // ── 9. Medicine — Breaking Bad News ──────────────────────────────────────
  {
    title: "How to Break Bad News With Grace",
    slug: "how-to-break-bad-news-with-grace",
    excerpt:
      "Telling a family that their loved one will not survive is the hardest sentence in medicine. There is a framework, but there is also an art. After two years of doing this badly, then less badly, then occasionally well — here is what I have learned.",
    category: "medicine",
    tags: ["patient-care", "presence", "boundaries", "scripture"],
    coverUrl:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&w=1600&q=80",
    publishedAt: "2026-03-28T09:00:00.000Z",
    content: lex(
      ps(
        "There is no good way to tell a mother her son will not wake up. There are less bad ways. And there are catastrophic ways. The difference between them is not skill in a clinical sense. It is presence, language, and the slow accumulation of small choices made in the right order.",
      ),
      ps(
        "I have had to break bad news many times now — too many for someone my age, not enough to ever feel comfortable. There is a published framework called SPIKES which is taught in medical schools and which I will summarise below, because it is genuinely useful. But there is also an art that the framework does not capture, and that art only grows by doing the hard thing badly until it becomes the hard thing done with grace.",
      ),
      h2("The framework: SPIKES, briefly"),
      ps(
        "SPIKES is a six-step protocol developed by a team of oncologists for breaking serious news. I find it most useful as a checklist for what NOT to forget when adrenaline is high. It stands for:",
      ),
      ul(
        "S — Setting. Choose a private space. Sit down. Switch off the bleep if you can. Bring tissues. Bring a colleague.",
        "P — Perception. Ask what the family already understands. 'Tell me what the team has shared with you so far.'",
        "I — Invitation. Ask how much they want to know. 'Are you the kind of person who wants every detail, or do you prefer the headline first?'",
        "K — Knowledge. Deliver the news in plain words. One sentence. Then stop.",
        "E — Emotion. Acknowledge what you see. Sit with it. Do not rush.",
        "S — Strategy and summary. Offer next steps and a clear plan.",
      ),
      ps(
        "That is the scaffolding. The house you build inside it is what makes the difference.",
      ),
      callout(
        "quote",
        "The single most useful sentence",
        "'I am so sorry. I have very difficult news.' Then stop. Let the silence do its work. The family has waited for this sentence; the worst thing you can do is fill the air around it.",
      ),
      h2("The fifteen seconds before you walk in"),
      ps(
        "I now think the most important part of breaking bad news happens before the conversation begins. The fifteen seconds in the corridor, with my hand on the door, are when the conversation is shaped.",
      ),
      ps(
        "I do four things in those fifteen seconds, in this order: I stop. I check that I know the patient's name and the right details. I take three slow breaths to settle my own heart rate. I pray a single sentence: 'Lord, give me the right words and the right silences.' Then I walk in.",
      ),
      ps(
        "Without that pause, I rush. With it, I am present. The difference is enormous. The family does not see the fifteen seconds, but they receive its fruit.",
      ),
      h2("The four sentences I avoid"),
      ps(
        "Years of being on the receiving end of clinician-speak have given me a strong allergy to certain phrases. I have crossed them off my own vocabulary.",
      ),
      ul(
        "'There was nothing more we could do.' This is rarely true and almost never helpful. Something can always be done; sometimes that something is comfort, dignity, presence.",
        "'She passed away.' I now say 'died'. Euphemism reduces clarity. Families are not children. They deserve the word.",
        "'I know how you feel.' You do not. They know you do not. Replace with: 'I cannot imagine what this is like for you.'",
        "'It was God's plan.' Do not theologise on a family's behalf, especially not at the bedside. If they want to say it, sit with it. Do not put it in their mouth.",
      ),
      h2("On silence"),
      ps(
        "Junior doctors are afraid of silence. We rush to fill it because the silence is uncomfortable for us. But silence is one of the most important clinical tools in this conversation. The family needs space to feel. They cannot feel and process simultaneously while you are talking.",
      ),
      ps(
        "I have learned to count to ten in my head after delivering the headline. Sometimes longer. Sometimes a minute of nothing but the sound of someone's breathing. It feels endless. It is what the family needs.",
      ),
      h2("On being present without performing"),
      ps(
        "There is a temptation, especially for women in medicine, to perform empathy. To over-touch, over-cry, over-explain. Performed empathy is a kind of self-soothing dressed up as care. The family senses it.",
      ),
      ps(
        "Real presence is quieter. It is sitting at eye level. It is not checking your watch. It is letting the conversation take the time it takes. It is one hand on a forearm, briefly, only if it feels right. It is being able to leave the room with the family knowing you would have stayed if they had needed you to.",
      ),
      h2("On what to do after"),
      ps(
        "After delivering devastating news, you have done a hard thing. The family has been blown apart, but you also need looking after. The single most important post-conversation discipline I have built is this: I do not go straight to the next clinical task. Even five minutes. Sit. Drink water. Tell a trusted colleague what just happened in two sentences. Wash your hands slowly. Then re-enter the day.",
      ),
      ps(
        "If you skip this step, the conversations stack up in your nervous system. You think you are coping. You are accumulating. Eventually it comes out in irritability, exhaustion, or a quiet kind of professional numbing. The five-minute pause is not weakness. It is sustainable practice.",
      ),
      h2("On the long arc of getting better at this"),
      ps(
        "I am not yet good at this. I am better than I was. The first time I broke bad news, I cried more than the family. The fifth time, I rushed the headline. The fifteenth time, I forgot the family member's name. Each conversation taught me something the textbook had not.",
      ),
      ps(
        "If you are early in your training and dreading these conversations, take heart: nobody starts good. The compassionate seniors you admire were once junior doctors who fumbled the words and had to learn. Show up. Be honest about getting it wrong. Ask a senior to debrief you. Slowly, slowly, the words become more true and the silences become more steady.",
      ),
      hr(),
      ps(
        "Breaking bad news is a sacred act. It is one of the few moments in a person's life they will remember in detail forty years later. Treat it accordingly. Be gentle. Be clear. Be present. Be slow. Then close the door behind you, lean against the wall for ten seconds, and go on.",
      ),
    ),
  },

  // ── 10. Medicine — Listening ─────────────────────────────────────────────
  {
    title: "The Underrated Skill of Listening Like a Doctor",
    slug: "the-underrated-skill-of-listening-like-a-doctor",
    excerpt:
      "Eighty per cent of diagnoses are made in the first five minutes of a patient interview — if you actually listen. Here is how I am training myself to be quieter, more curious, and more useful in the consultation room.",
    category: "medicine",
    tags: ["patient-care", "presence", "habits", "discipline"],
    coverUrl:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&w=1600&q=80",
    publishedAt: "2026-03-24T08:00:00.000Z",
    content: lex(
      ps(
        "There is a famous study, often quoted in medical education, that found doctors interrupt patients on average within eleven seconds of the patient beginning to speak. Eleven seconds. The patient has not even arrived at the verb yet. If that statistic is broadly true — and my own informal observation suggests it is — then most consultations are over before they have begun. The patient leaves feeling unheard. The doctor leaves with an incomplete history. Both lose.",
      ),
      ps(
        "I want to write about listening as a clinical skill. Not as a soft, optional, you-are-such-a-kind-doctor skill. As a hard, technical, evidence-rooted skill that determines diagnostic accuracy, patient satisfaction, treatment adherence and even legal risk. Listening is medicine.",
      ),
      h2("The two-minute rule"),
      ps(
        "I now run a private rule that I do not break unless there is a clinical emergency: I do not interrupt for the first two minutes. The patient gets two uninterrupted minutes to tell me what they think is wrong. I time it on my watch when I remember.",
      ),
      ps(
        "Two minutes feels long when you have a queue of forty. It is, in fact, an excellent investment. By the end of the two minutes I usually have the diagnosis, or at least the right tree of differential to explore. The questions I ask afterwards are sharper and fewer because the patient has already given me the architecture.",
      ),
      ps(
        "Try it. The next outpatient clinic, next ward round, next late-night casualty. Two uninterrupted minutes. You will be astonished how often the patient hands you the answer in the first ninety seconds — provided you do not crash into them with a directed question that sends the conversation off in your direction instead of theirs.",
      ),
      callout(
        "info",
        "What to do with your face",
        "Listening is more than not talking. Soften your eyes. Tilt your head slightly. Nod occasionally. Take notes only after the patient pauses, not during their words. The face is part of the consultation.",
      ),
      h2("What patients are really saying"),
      ps(
        "Patients rarely say the most important thing first. They warm up. They test you. They check whether you are the kind of doctor who can be trusted with the deeper material before they reveal it. The classic example: the elderly man who comes in for 'just a check-up' and, fifteen minutes in, mentions in passing that he has been having chest pains for a week.",
      ),
      ps(
        "If I had cut him off in the first two minutes to direct him toward the routine examination, I would have missed it. He needed permission to arrive at the real reason. Listening is partly about giving people the time to find the courage to say what brought them.",
      ),
      ul(
        "Listen for what is mentioned twice. Repetition is a flag.",
        "Listen for what is said in passing, often as a 'oh, by the way' on the way out. The hand on the door reveals more than the chair.",
        "Listen for who comes with them. The family member is part of the history.",
        "Listen for what is not said. Silence around a topic is itself diagnostic.",
      ),
      h2("On asking better questions"),
      ps(
        "Once I have listened, I ask. Better questions have changed my clinical practice more than any new investigation has. A few I have stolen from senior colleagues and now use almost daily:",
      ),
      ul(
        "'What worries you most about this?' — uncovers fear, which is often the real reason for the visit.",
        "'What were you hoping I might be able to do today?' — aligns expectations early.",
        "'How is this affecting your day-to-day life?' — pivots from biomedicine to the lived experience.",
        "'Has anyone in your family had something similar?' — opens family history without making it a checklist.",
        "'Is there anything else I should know?' — at the end. Always. The answer is often the most important thing.",
      ),
      h2("Cultural humility as a listening discipline"),
      ps(
        "I work in a setting where patients come from many tribes, many languages, many beliefs about health, illness and the body. Listening here requires a particular humility. I cannot assume the patient's framework matches mine.",
      ),
      ps(
        "Some practical commitments I have made:",
      ),
      ul(
        "Use the patient's words for their symptoms. If she says 'my heart is hot', I write 'heart is hot' in my notes and explore what she means before I translate it into clinical vocabulary.",
        "Ask about traditional treatments respectfully and without judgement. People take them. Knowing about them changes prescriptions.",
        "Use translators when there is any doubt about understanding. A child interpreting for a parent is rarely a safe arrangement.",
        "Say back what I think I have heard, in the patient's own words, before I move on.",
      ),
      h2("On note-taking that does not destroy listening"),
      ps(
        "The computer is the enemy of listening. The moment your eyes move to the screen, the patient feels demoted. I have shifted to taking notes in two phases: I listen with full attention for the opening minutes, then I deliberately pause and say, 'Let me write a few things down so I do not forget — please give me a second,' and then I do, openly, before returning my eyes to them.",
      ),
      ps(
        "It costs ninety seconds. It buys an entire consultation worth of trust.",
      ),
      h2("On staying silent through difficult disclosures"),
      ps(
        "When a patient discloses something hard — domestic violence, suicidal thoughts, a long-buried diagnosis, a family secret — the temptation is to fill the silence with reassurance. Resist it. The silence is not awkward; it is sacred. The patient is checking whether you can hold what they have said.",
      ),
      ps(
        "Sit with it. A few breaths. Then a short, true, uninflated sentence. 'Thank you for trusting me with this.' Or, 'That sounds incredibly hard.' Then more silence, if needed. You do not need to solve it in the consultation. You need to receive it without flinching.",
      ),
      h2("Why listening matters more in your career than skill"),
      ps(
        "It is hard to say this without sounding sentimental, but it is true: in twenty years your patients will not remember your differential diagnosis. They will remember whether you looked at them. Whether you spoke gently. Whether you knew their name and their fear and their grandmother's history of strokes.",
      ),
      ps(
        "You can be a brilliant diagnostician and a poor doctor. You cannot be a great doctor without being a great listener. The skill is not optional. It is the foundation under everything else.",
      ),
      hr(),
      ps(
        "Two minutes. The patient's words first. Your face soft. Your hands still. Your follow-up question shaped by what you actually heard. That is the entire art. Practise it for a year and you will be a more useful doctor than any extra qualification will make you.",
      ),
    ),
  },

  // ── 11. Medicine — Burnout ───────────────────────────────────────────────
  {
    title: "On Burnout, Boundaries, and the Word 'No'",
    slug: "on-burnout-boundaries-and-the-word-no",
    excerpt:
      "Burnout is not a failure of character. It is the predictable injury of a profession that has not yet learned to protect its workers. Here is what I have learned about saying no, recovering well, and continuing to love the work without being destroyed by it.",
    category: "medicine",
    tags: ["burnout", "boundaries", "mental-health", "resident-life"],
    coverUrl:
      "https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&w=1600&q=80",
    publishedAt: "2026-03-19T07:30:00.000Z",
    content: lex(
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
    ),
  },

  // ── 12. Life — Cooking for One ───────────────────────────────────────────
  {
    title: "Cooking for One When Work Eats Your Week",
    slug: "cooking-for-one-when-work-eats-your-week",
    excerpt:
      "I live alone, work fifty-six hours a week, and still cook real food most nights. Here is the small, repeatable system that keeps me out of takeaway containers without taking my Sundays hostage.",
    category: "life",
    tags: ["cooking", "habits", "discipline", "solitude"],
    coverUrl:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&w=1600&q=80",
    publishedAt: "2026-03-15T18:00:00.000Z",
    content: lex(
      ps(
        "There is a particular shame around cooking for one. The cookery shows are for families. The recipes serve four. The supermarket sells everything in packs that punish the single woman. The implicit message is: cook properly only when there is somebody to cook for. Anything else is a kind of waiting — a holding pattern until your real life arrives.",
      ),
      ps(
        "I want to push back on that. I have lived alone for nearly four years now. I am not waiting. The life I have right now is not a draft of something else; it is mine. And one of the small acts of self-respect I have built is to feed myself well, most days, without pretending it is anything other than ordinary.",
      ),
      h2("Why I refuse to live on takeaway"),
      ps(
        "There are practical reasons. Takeaway every day is expensive. The sodium in restaurant food is ridiculous. Most takeaway lunches leave me hungrier in two hours than when I started. As a doctor, I know what those macros do over a decade.",
      ),
      ps(
        "But the bigger reason is harder to articulate. Cooking my own food is one of the few daily acts of agency I have in a life that mostly tells me what to do. The hospital owns my hours. The on-call rota owns my weekends. My dinner is mine. Insisting on cooking it — even simply — is a small declaration that I am still a person, not just a worker.",
      ),
      callout(
        "quote",
        "What I tell myself on tired Tuesdays",
        "Future you wants to be fed. Present you, hold the knife.",
      ),
      h2("The Sunday system"),
      ps(
        "Almost everything depends on Sunday. Two hours, once a week, in the kitchen — and the rest of the week becomes possible. This is not meal-prep in the bodybuilder sense. There are no plastic containers stacked with chicken breasts. It is a softer system, shaped around dinner.",
      ),
      h3("Step 1 — Choose two anchors"),
      ps(
        "I pick two cookable bases for the week. One is usually a grain or starch (jollof, brown rice, roasted potatoes, pasta). The other is usually a protein-vegetable combination (a stew, a tray of roasted vegetables with chickpeas, a curry). Together they form the backbone of about four dinners.",
      ),
      h3("Step 2 — Cook them once, eat them differently"),
      ps(
        "The point is not to eat the same meal four nights. It is to recombine. The roasted vegetables become a salad on Monday, a wrap on Tuesday, a hash with eggs on Wednesday, a grain bowl on Thursday. Same base, different shape. The brain stays interested. The fridge slowly empties.",
      ),
      h3("Step 3 — Buy the supporting cast on Wednesday"),
      ps(
        "Mid-week I buy fresh things — a head of lettuce, an avocado, a packet of cherry tomatoes, a piece of fruit. The supporting cast keeps the anchors interesting. Without it the week feels heavy by Thursday.",
      ),
      h2("The five-ingredient meals I keep returning to"),
      ps(
        "When I am too tired to think about food, I have a small list of five-ingredient meals I can cook on autopilot. They are not impressive. They are kept alive precisely because they ask nothing of me.",
      ),
      h3("Garlic, lemon and chickpea pasta"),
      ps(
        "Pasta. Olive oil. Garlic. Lemon. A tin of chickpeas. Salt. Cook pasta. Sauté garlic and chickpeas in oil while pasta cooks. Drain pasta. Toss everything together with lemon zest and juice. Done in fifteen minutes. Comforts like a small Italian grandmother.",
      ),
      h3("Egg-fried rice with vegetables"),
      ps(
        "Cold rice from the fridge. Two eggs. Whatever vegetables are surviving in the drawer. Soy sauce. Sesame oil. Stir-fry the vegetables, push them aside, scramble the eggs in the same pan, toss in the rice, sauce. Six minutes. The single woman's salvation.",
      ),
      h3("Avocado, tomato and feta salad with toast"),
      ps(
        "Tomato. Avocado. Feta. Olive oil. Sourdough toast. Sliced and layered, salt and pepper, eaten on the balcony if it is not raining. Three minutes. A meal that pretends to be brunch even at 8 p.m.",
      ),
      h3("Sweet potato, spinach and lentils"),
      ps(
        "Roast cubed sweet potato. Cook lentils with stock and a bay leaf. Wilt spinach in olive oil and garlic. Plate together with a dollop of yoghurt. It will keep you fed for two days; it will make you feel held.",
      ),
      h2("A small philosophy of solo eating"),
      ps(
        "I have come to take seriously the small ceremonies of eating alone. They are not optional accessories. They are the things that turn fuel into a meal.",
      ),
      ul(
        "Set the table, even for one. A plate, not the pan. A glass of water. A linen napkin if you have one.",
        "No screens during dinner. Music is fine. The phone is not. You will miss what your body is telling you.",
        "Sit down. Do not eat standing in the kitchen. Sitting is part of the meal.",
        "Take twenty minutes, even if the food took five. Pace is part of the practice.",
        "Light a candle on Friday nights. It is the smallest possible Sabbath.",
      ),
      h2("On feeding others occasionally"),
      ps(
        "I have stopped saving 'real cooking' for hosting. But I do still host, and I have come to love it more for being rare. Once a month I cook for two or three friends. Something slow. Something that needs eating immediately. Something that is too much to make for myself.",
      ),
      ps(
        "Hosting reminds me that food is a love language, and that I am still capable of speaking it. It also reminds me that the daily small dinners are not less than the big monthly meals. They are the same impulse — the desire to sit with another person, even when that other person is the version of me who came home at 7 p.m. and is tired and worth feeding.",
      ),
      h2("On the spiritual aspect of food"),
      ps(
        "I think a lot, lately, about the way Christ kept feeding people. He fed the five thousand, but he also cooked breakfast on a beach for a handful of his closest friends. The mass and the small are both his. Hospitality is not always a banquet; it is sometimes a quiet meal for one, eaten well, with thanks.",
      ),
      ps(
        "Saying grace before dinner alone has been a quiet rediscovery this past year. Not an audible prayer, mostly. Just a moment of pause. A naming of the source of the food, the hands that grew it, the body about to receive it. It changes the meal. The food has not changed. The eater has.",
      ),
      hr(),
      ps(
        "Cook for the woman in front of the stove. Lay the table. Light the candle if you must. The dinner you make for yourself is not a rehearsal for a real meal someone else will share with you one day. This — tonight — is the meal. This is the life. Feed it well.",
      ),
    ),
  },

  // ── 13. Life — Friendship in Late 20s ────────────────────────────────────
  {
    title: "Female Friendship in Your Late Twenties: A Field Guide",
    slug: "female-friendship-in-your-late-twenties",
    excerpt:
      "The friendships you have at twenty-eight will not survive on the autopilot that sustained the friendships you had at eighteen. Here is what I have learned about keeping the long ones alive, building the new ones, and grieving the ones that are quietly leaving.",
    category: "life",
    tags: ["friendship", "habits", "identity", "presence"],
    coverUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&w=1600&q=80",
    publishedAt: "2026-03-09T19:00:00.000Z",
    content: lex(
      ps(
        "Nobody warned me that friendship gets harder in your late twenties. They warned me about money, about romantic relationships, about the body's small betrayals. They did not warn me that the friends who lived on autopilot through school and university would, one by one, stop replying as quickly. That marriages and migrations and motherhood would scatter people. That the WhatsApp group that used to hum would go quiet for months. That I would have to learn, painfully, to make the new friendships and protect the old ones with intention I had not previously had to apply.",
      ),
      ps(
        "I want to write about female friendship at twenty-eight. The shape of it. The work of it. The quiet grief of its erosion when it erodes, and the new joy of it when something genuine takes root. There are very few essays about this; I want to add one to the small pile.",
      ),
      h2("Why the friendships of your twenties get harder"),
      ps(
        "It is not just busyness, though it is partly that. It is that life starts diverging. In school you lived in the same building five days a week. In university you lived in the same dorm. By twenty-eight you live in different cities, on different schedules, with different priorities. The default architecture of friendship — proximity and free time — is gone. Friendship has to be built, on purpose, on top of the rubble of the easy version.",
      ),
      ul(
        "Some friends will marry and disappear into a couple, and you will lose them before they realise they have changed.",
        "Some friends will have babies and become unreachable for two years, and your job is to wait without resentment.",
        "Some friends will move countries and time zones and become a series of voice notes, and that will be the friendship now.",
        "Some friends will quietly outgrow you — or you them — and the friendship will go to sleep without a funeral, and you will feel it a year later.",
      ),
      ps(
        "All of this is normal. Most of it is no one's fault. But none of it makes itself easier just because it is normal.",
      ),
      h2("The friendships I have learned to protect"),
      ps(
        "I have stopped trying to maintain twenty friendships at the same medium intensity. I cannot. Nobody can. I now think in concentric circles, and I have made peace with the fact that the circles change shape over time.",
      ),
      h3("The inner four"),
      ps(
        "Four people. The ones who can call me at 11 p.m. with no preamble. The ones who know about the patient I lost on Tuesday and the man I went on a bad date with on Saturday. They get the most of me — and they require it. We text most weeks. We call most months. We see each other when geography allows. They are not negotiable.",
      ),
      h3("The next twelve"),
      ps(
        "Friends I love deeply but cannot speak to weekly. We catch up every quarter, sometimes longer. Birthdays are remembered. Big news is shared. The friendship is real but it lives at a slower frequency. I had to stop feeling guilty about not maintaining everyone at maximum closeness; some friendships are designed for less, and that is not failure.",
      ),
      h3("The wider acquaintance circle"),
      ps(
        "People I am genuinely glad to see, but with whom I do not have an ongoing relationship. Old classmates, work colleagues, fellow runners, the women from church. We exchange warmth when we meet. We do not pretend to be more than we are. There is nothing dishonest about friendly acquaintance.",
      ),
      callout(
        "info",
        "On the inner four",
        "Be deliberate about your inner four. They will not stay there by accident. Three or four times a year, ask yourself: did I tend to these people this quarter? If not, send the message before the day ends.",
      ),
      h2("The small disciplines that keep friendship alive"),
      ps(
        "I have noticed that the friendships that survive are not the ones with the most dramatic devotion. They are the ones with the most small, repeated, undramatic acts.",
      ),
      ul(
        "The voice note instead of the typed message. Voice carries warmth that text cannot.",
        "The unsolicited check-in. 'Thinking of you. No need to reply.' Removes the burden of response. Communicates love.",
        "Remembering the small details. Her sister's name. The interview she had on Tuesday. The book she said she was reading.",
        "Showing up for the unphotogenic moments. The midweek dentist appointment. The new job's first awkward day. The hospital admission of a parent.",
        "Being early to the joys. Sending congratulations the day the news comes out, not the week after.",
        "Being late and still showing up to the griefs. A condolence message six weeks later, when everyone else has stopped, is more useful than the one in the first three days.",
      ),
      h2("On making new friends in your late twenties"),
      ps(
        "It is harder than school. There is no enforced proximity. You have to choose to be in the rooms where friendships start, and then you have to be the one who follows up. I have found three rooms reliably useful in this season.",
      ),
      ul(
        "A small group at church. Recurring. Same time each week. Long enough that conversation moves past pleasantries.",
        "A regular activity with the same people. A run club. A book club. A craft class. The activity is the excuse; the people are the point.",
        "Friends-of-friends, intentionally cultivated. Ask your existing friends to introduce you to the woman they keep telling you about. The one who 'reminds them of you'.",
      ),
      ps(
        "After meeting a new person you actually like, the rule is simple: be the one who suggests the next thing. People tend to wait. Be the un-waiter. The pattern of the new friendship is set in the first two follow-ups.",
      ),
      h2("On the friendships that are leaving"),
      ps(
        "Some friendships are quietly ending right now and you may not have named it yet. The replies are slower. The visits are rarer. The conversations have lost the texture they used to have. Sometimes this is recoverable; often it is not. The kindest response, I have learned, is honesty followed by lightness.",
      ),
      ps(
        "Honesty: name it to yourself. The friendship has changed. Do not pretend otherwise. Pretending costs you energy that could go elsewhere.",
      ),
      ps(
        "Lightness: let it go gently. Do not stage a funeral for a friendship that simply got smaller. Wish her well. Stay open to a return. Some friendships go quiet for years and then come back beautifully. Hold the door open without standing at it.",
      ),
      h2("On marriage, motherhood, and the friendships that survive them"),
      ps(
        "I am writing this as a single woman without children. Many of my closest friends are now married, several with babies. The friendships that have survived this transition have done so because both of us did the work.",
      ),
      ps(
        "I have learned not to interpret a slow reply as cooling. I have learned to send shorter messages that do not require replies. I have learned to visit her, instead of waiting for her to come to me. I have learned to bring food, not gifts, and to wash the dishes before I leave.",
      ),
      ps(
        "She has learned to send me a voice note in the car between school runs. She has learned to remember that my single life is not a holding pattern but a real life with real depths. She has learned to ask about my work, my faith, my running, with genuine interest. The friendship adapts because both of us are committed to it adapting. That is the entire trick.",
      ),
      hr(),
      ps(
        "Friendship in your late twenties is not what it was at eighteen. It is harder, slower, less photogenic and, in many ways, deeper. The autopilot is gone; the manual flying begins. Take the controls. Send the message. Make the visit. Tend the inner four. The friendships you build now are the ones who will be sitting with you in the hospital waiting room when you are sixty. Build accordingly.",
      ),
    ),
  },

  // ── 14. Reflections — Letter to Med-School Self ──────────────────────────
  {
    title: "What I Would Tell My First-Year-Med-School Self",
    slug: "what-i-would-tell-my-first-year-med-school-self",
    excerpt:
      "A letter to the version of me who walked into anatomy lab eight years ago, carrying too much fear and too little grace. Things I wish she had known about medicine, faith, the body, the men, and the slow work of becoming a doctor and a woman.",
    category: "reflections",
    tags: ["letter-to-self", "identity", "habits", "scripture"],
    coverUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&w=1600&q=80",
    publishedAt: "2026-03-04T20:00:00.000Z",
    content: lex(
      ps(
        "Dear small girl in the white coat, two sizes too big, walking into anatomy lab on a Monday morning in 2018 — let me try to tell you a few things you do not yet know. I know you will not entirely listen. None of us would have, at your age. But some of this is going to land in the next decade and save you a year or two of unnecessary suffering. So I will write it anyway, with affection.",
      ),
      ps(
        "You will become a doctor. You will become tired in ways you cannot yet imagine. You will lose patients and grow up and lose people who were not patients. You will pray more than you used to and cry more than you used to and run more than you used to. You will grow into a woman whose hands know what they are doing. Be patient with the version of you who does not yet.",
      ),
      h2("On the work itself"),
      ul(
        "You do not have to know everything to be safe. You have to know how to find out and when to ask. The latter is more important than the former.",
        "Anatomy will get easier. The first cadaver lab will not. You will remember the smell for the rest of your life. That is the price of the calling.",
        "The students who terrify you with their confidence in first year are not the best clinicians five years on. Quiet competence is more durable than performance.",
        "Failing an exam is not a referendum on your worth. It is information. Use it; do not become it.",
        "The nurses know more than you. Listen to them. Especially the ones with grey hair. They have saved more patients than you ever will.",
      ),
      h2("On the body — yours"),
      ul(
        "You have a body. You will keep forgetting this for years. The library is not a substitute for sleep. Coffee is not a substitute for water. Stress is not a personality trait.",
        "Start lifting weights now. Do not wait until you are twenty-six and reading studies about bone density at 3 a.m. with regret. Future you will thank you.",
        "Eat food, not whatever was on the cafeteria counter. Your concentration depends on it. So does your mood, in ways you do not yet recognise.",
        "Sleep as if your patients depend on it. They do. The hour you stayed up rereading paediatrics is the hour you wish you had back during the 4 a.m. on-call.",
      ),
      callout(
        "quote",
        "A sentence I want you to memorise",
        "Your body is not the price you pay for your education. It is the instrument with which you will practise medicine for fifty years. Take care of the instrument.",
      ),
      h2("On faith"),
      ul(
        "You will go through a season where God feels far. He will not be. Distance is sometimes a form of formation.",
        "Stop comparing your devotion to the Christian women on Instagram. They have curated your envy on purpose. Read your Bible. Pray. Show up. The rest is noise.",
        "Find a church that will know you, not just preach to you. The auditorium model will not survive your residency. You need people who will sit with you in the waiting room.",
        "Memorise scripture in your twenties. It is the most portable comfort you will ever own. You will need it on a night you cannot yet imagine.",
        "Theology done in a library is not the same as theology done at a bedside. Both matter. The second one shapes you more.",
      ),
      h2("On men"),
      ul(
        "The boy in second year will not turn out the way you hope. Be sad about it for a season, then keep going. He was not the answer.",
        "Do not date someone who does not respect your work. The hours of medicine ask too much of a relationship for it to also be carrying disrespect. You will not have the energy.",
        "The right man will be quietly impressed by your competence, not threatened by it. Settle for nothing less. Your career is not the obstacle to a good marriage; the wrong man is.",
        "Stop apologising for being ambitious. The world will already do enough of that for you. You are allowed to want both — the work and the partnership. Refuse to choose.",
      ),
      h2("On friendship"),
      ul(
        "The friends you make in medical school will become the most important people of your life, alongside your family. Tend them well.",
        "Be the one who sends the first message. Be the one who shows up. Be the one who remembers the dates. The economy of friendship runs on small, deliberate gestures.",
        "It is okay to outgrow some friendships. It is not okay to outgrow them and then resent them for not keeping up. Let them go gently.",
        "You will be lonely sometimes. Lonely is not the same as alone. Loneliness teaches you something solitude can also teach you, if you let it.",
      ),
      h2("On money and the small dignities"),
      ul(
        "You are going to earn a salary one day. Save twenty per cent of it from the first paycheck. You will not miss it; future you will be grateful.",
        "Do not buy the bag. Buy the books. Buy the running shoes. Buy the flight to see your sister. Spend money on becoming and on being-with, not on appearing.",
        "Furniture lasts decades. Do not rush it. A well-loved second-hand chair is better than a new one you regret.",
        "Pay your debts on time. It is a small daily discipline that protects your peace.",
      ),
      h2("On the kind of doctor you want to be"),
      ul(
        "Be the doctor your patients will quote ten years from now. Not the most famous. The kindest. The clearest. The one who looked them in the eye.",
        "Never miss a chance to honour a nurse, a porter, a cleaner, a kitchen hand. The hospital functions because of them. Acknowledge it.",
        "If you are wrong, say you are wrong. Quickly. Specifically. Without performance. Then move on.",
        "Do not become cynical. The system is broken in many of the same ways it has always been. Cynicism does not fix it; it only joins it.",
      ),
      h2("On the woman you are becoming"),
      ps(
        "You will not be the woman you imagined at eighteen. She was a sketch. The woman you will become is more complicated, more disappointed in some places, more delighted in others. She will have laugh lines from a thousand things you have not laughed at yet. She will have shoulders that have learned to carry weight without complaint. She will have a deep, slow love for the work and an honest, sometimes weary love for God.",
      ),
      ps(
        "Do not try to be her too quickly. You are not behind. You are arriving on time, by the long road. Show up to your formation. Do the small things daily. Trust that God is doing in you what you cannot yet do in yourself.",
      ),
      hr(),
      ps(
        "I love you. I am proud of you. Pick up the bag, put on the white coat, walk into the lab. Be brave. Be slow. Be honest. Pray more than you think you need to. Cry when you need to. Get the sleep. Drink the water. Lift the weights. Send the message. Read the Bible. Eat the food. Be kind to the woman in the mirror. She is doing better than she thinks.",
      ),
      ps(
        "— Your future self, who is finally, slowly, becoming someone you would have been proud to know.",
      ),
    ),
  },
];

// ────────────────────────────────────────────────────────────────────────────
//  Database helpers
// ────────────────────────────────────────────────────────────────────────────

async function findAdminId(payload: PayloadInstance): Promise<ID> {
  // 1) Try the configured admin email first
  const byEmail = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
    overrideAccess: true,
  });
  if (byEmail.docs.length) return (byEmail.docs[0] as { id: ID }).id;

  // 2) Fall back to the first user with an admin role
  const allUsers = await payload.find({
    collection: "users",
    limit: 100,
    overrideAccess: true,
  });
  const adminUser = allUsers.docs.find((u) => {
    const roles = (u as { roles?: string[] }).roles ?? [];
    return roles.includes("admin") || roles.includes("editor");
  });
  if (adminUser) {
    log(`using existing admin: ${(adminUser as { email?: string }).email}`);
    return (adminUser as { id: ID }).id;
  }

  // 3) Last fallback: the very first user in the table
  if (allUsers.docs.length) {
    log(
      `no admin/editor user found — using first user: ${
        (allUsers.docs[0] as { email?: string }).email
      }`,
    );
    return (allUsers.docs[0] as { id: ID }).id;
  }

  throw new Error("No users in the database — create an admin first.");
}

async function deleteAllInCollection(
  payload: PayloadInstance,
  slug: string,
): Promise<number> {
  let deleted = 0;
  while (true) {
    const batch = await payload.find({
      collection: slug as never,
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const doc of batch.docs) {
      try {
        await payload.delete({
          collection: slug as never,
          id: (doc as { id: ID }).id,
          overrideAccess: true,
        });
        deleted++;
      } catch (err) {
        warn(`failed to delete ${slug}#${(doc as { id: ID }).id}:`, (err as Error).message);
      }
    }
  }
  return deleted;
}

async function uploadCover(
  payload: PayloadInstance,
  url: string,
  alt: string,
): Promise<ID | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";
    const safeAlt = alt.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().slice(0, 60);
    const filename = `${safeAlt}-${Date.now()}.jpg`;

    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: filename,
        size: buffer.length,
      },
      overrideAccess: true,
    });
    return (doc as { id: ID }).id;
  } catch (err) {
    warn(`cover fetch failed for "${alt}":`, (err as Error).message);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
//  Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI is not set — copy .env.local.example first");
  }

  log("connecting to Payload...");
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });

  const adminId = await findAdminId(payload);
  log("admin user:", adminId);

  log("deleting old posts...");
  const postsDeleted = await deleteAllInCollection(payload, "posts");
  log(`  → ${postsDeleted} posts deleted`);

  log("deleting old tags...");
  const tagsDeleted = await deleteAllInCollection(payload, "tags");
  log(`  → ${tagsDeleted} tags deleted`);

  log("deleting old categories...");
  const catsDeleted = await deleteAllInCollection(payload, "categories");
  log(`  → ${catsDeleted} categories deleted`);

  log("deleting old media (cover images)...");
  const mediaDeleted = await deleteAllInCollection(payload, "media");
  log(`  → ${mediaDeleted} media docs deleted`);

  // Categories
  log("creating new categories...");
  const catIds = new Map<string, ID>();
  for (const c of CATEGORIES) {
    const doc = await payload.create({
      collection: "categories",
      data: { name: c.name, slug: c.slug, color: c.color },
      overrideAccess: true,
    });
    catIds.set(c.slug, (doc as { id: ID }).id);
  }
  log(`  → ${catIds.size} categories created`);

  // Tags
  log("creating new tags...");
  const tagIds = new Map<string, ID>();
  for (const t of TAGS) {
    const doc = await payload.create({
      collection: "tags",
      data: { name: t.name, slug: t.slug },
      overrideAccess: true,
    });
    tagIds.set(t.slug, (doc as { id: ID }).id);
  }
  log(`  → ${tagIds.size} tags created`);

  // Posts
  log("creating new posts...");
  let postsCreated = 0;
  for (const post of POSTS) {
    const coverId = await uploadCover(
      payload,
      post.coverUrl,
      `${post.title} — cover image`,
    );
    if (!coverId) {
      warn(`skipping "${post.title}" — no cover image`);
      continue;
    }

    const categoryId = catIds.get(post.category);
    if (!categoryId) {
      warn(`skipping "${post.title}" — unknown category ${post.category}`);
      continue;
    }

    const postTagIds = post.tags
      .map((slug) => tagIds.get(slug))
      .filter((id): id is ID => Boolean(id));

    try {
      await payload.create({
        collection: "posts",
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: categoryId,
          tags: postTagIds,
          authors: [adminId],
          coverImage: coverId,
          featured: post.featured ?? false,
          publishedAt: post.publishedAt,
          _status: "published",
        },
        overrideAccess: true,
      });
      postsCreated++;
      log(`  ✓ ${post.title}`);
    } catch (err) {
      warn(`failed to create "${post.title}":`, (err as Error).message);
    }
  }
  log(`  → ${postsCreated}/${POSTS.length} posts created`);

  log("done");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
