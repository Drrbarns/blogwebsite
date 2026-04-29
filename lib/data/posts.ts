import type { BlogPost, Category, TrendingItem, Tag } from "@/types";

export const categories: Category[] = [
  { name: "Faith", slug: "faith", color: "#fde7e3" },
  { name: "Sport", slug: "sport", color: "#e6f4ea" },
  { name: "Medicine", slug: "medicine", color: "#e0ecff" },
  { name: "Life", slug: "life", color: "#fff4d6" },
  { name: "Reflections", slug: "reflections", color: "#f4e8ff" },
  { name: "Journal", slug: "journal", color: "#fcecd6" },
];

const author = {
  name: "About a Girl",
  avatar: "/images/avatar.jpg",
};

/**
 * Cover art bundled under public/images/blog (see scripts/rewrite-content.ts COVER map).
 */
const cover = {
  flagshipJournal: "/images/blog/cover-life-makola-market.png",
  prayingHands: "/images/blog/cover-worship.png",
  sundayLight: "/images/blog/cover-worship.png",
  hospitalNight: "/images/blog/cover-worship.png",
  bibleCoffee: "/images/blog/cover-worship.png",
  weights: "/images/blog/cover-sport-football-ghana.png",
  runningRoad: "/images/blog/cover-sport-cycling-ghana.png",
  homeGym: "/images/blog/cover-sport-football-ghana.png",
  stethoscope: "/images/blog/cover-medicine-hospital.png",
  doctorPatient: "/images/blog/cover-medicine-hospital.png",
  burnoutCoat: "/images/blog/cover-medicine-class.png",
  booksStack: "/images/blog/cover-medicine-class.png",
  windowJournal: "/images/blog/cover-medicine-class.png",
  womanDawn: "/images/blog/cover-life-makola-market.png",
};

const cat = {
  faith: { name: "Faith", slug: "faith" },
  sport: { name: "Sport", slug: "sport" },
  medicine: { name: "Medicine", slug: "medicine" },
  life: { name: "Life", slug: "life" },
  reflections: { name: "Reflections", slug: "reflections" },
  journal: { name: "Journal", slug: "journal" },
};

/**
 * Single source of truth for every published post.
 *
 * The same array is sliced into the various homepage / blog-page surfaces
 * below (hero, fresh, recent, sidebar, related). Edit this list to add,
 * remove or reorder posts site-wide; then run `npm run reset-content` to
 * push the changes into the live Supabase database.
 */
export const aboutAGirlPosts: BlogPost[] = [
  // ──────────────────────────────────────────────────────────────────── 1
  {
    id: "p-flagship",
    slug: "about-a-girl-the-story-behind-this-blog",
    title: "About a Girl: The Story Behind This Blog",
    excerpt:
      "Why I'm finally writing it down — a doctor's notebook on faith, sport, medicine and the quiet work of becoming.",
    coverImage: cover.flagshipJournal,
    category: cat.journal,
    categories: [cat.journal, cat.reflections, cat.life],
    tags: ["introduction", "identity", "beginnings"],
    author,
    publishedAt: "2026-04-29",
    readingTime: 6,
    featured: true,
    content: [
      {
        type: "p",
        text: "I am a girl. I am also a doctor, a believer, an early-morning runner, an over-keen meal-prepper, a sister, a friend, and on most Sundays a back-row alto in a small church choir. I keep being asked which of those is the 'real' one. The honest answer is all of them, and the more honest answer is that they only make sense together.",
      },
      {
        type: "p",
        text: "About a Girl is the place where I'm finally writing that down. Not as a brand, not as a feed — as a notebook with a public-facing cover. A blog for her, about her, by her, because the her in question is several women living in one body and they all deserve a paragraph.",
      },
      {
        type: "h2",
        text: "Why now",
      },
      {
        type: "p",
        text: "I almost started this blog four times. The first time I was a third-year medical student and the only person I would have written for was the version of me sitting in the next lecture. The second time I was on a surgical rotation and too tired to spell my own name. The third time I had the title and the colour palette but no nerve. The fourth time was last week, when a patient asked what I did with the 'rest' of my life and I realised I didn't have an answer that wasn't a shrug.",
      },
      {
        type: "p",
        text: "I want a record. Of the call nights and the prayer nights, of the long runs and the longer rounds, of the books that rearranged me and the conversations that taught me something a textbook couldn't. Mostly I want one place where the parts of me are allowed to talk to each other without anybody apologising.",
      },
      {
        type: "h2",
        text: "What you'll find here",
      },
      {
        type: "p",
        text: "Six small rooms. Each one is a category at the top of the site, and each one is a part of me you can knock on whenever you like.",
      },
      {
        type: "ul",
        items: [
          "Faith — what it actually looks like to follow Jesus when your pager has plans for you. Devotion, doubt, sabbath in a sixty-hour week.",
          "Sport — running, lifting, pick-up games, and the slow argument I keep winning with my body that it's allowed to be strong.",
          "Medicine — the ward, the clinic, the patients I will never forget, and the things they wish their doctor knew.",
          "Life — books, recipes, money, mornings, the small instruments that make the rest of it work.",
          "Reflections — the longer thoughts, the ones I needed to write twice before I understood them.",
          "Journal — the personal entries: where I am right now, what I'm learning, what I'm afraid of and praying through.",
        ],
      },
      {
        type: "h2",
        text: "What it isn't",
      },
      {
        type: "p",
        text: "It isn't a brand-safe, polished, every-post-is-a-pillar-post kind of website. It isn't a place to give you medical advice (please see a real doctor, ideally in person). It isn't going to pretend to be neutral about faith — Jesus shows up in the margins of almost everything I write because He shows up in the margins of almost everything I do.",
      },
      {
        type: "p",
        text: "It also isn't going to be daily. I'd rather write one good thing on Sunday than five tired ones during the week. Subscribe to the letter if you want to know the moment something new goes up; otherwise wander in whenever the title catches your eye.",
      },
      {
        type: "quote",
        text: "We are not problems that need solving. We are people that need recognising. I'm trying to recognise myself, in writing, in real time.",
      },
      {
        type: "h2",
        text: "If we've never met",
      },
      {
        type: "p",
        text: "Hi. I'm a junior doctor working in West Africa. I love the local church, long-distance running, my patients, used books and a good Sunday meal that takes all afternoon. I'm a girl with many sides; this site is the side that takes notes.",
      },
      {
        type: "p",
        text: "Make a cup of something warm. Pick a category. Stay as long as you like.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 2
  {
    id: "p-praying-shifts",
    slug: "praying-through-the-long-shifts",
    title: "Praying Through the Long Shifts: How Faith Anchors a Doctor on Call",
    excerpt:
      "A practical, honest field guide to keeping a prayer life when your pager won't let you finish a sentence.",
    coverImage: cover.prayingHands,
    category: cat.faith,
    categories: [cat.faith, cat.medicine],
    tags: ["prayer", "on-call", "devotion", "faith-at-work"],
    author,
    publishedAt: "2026-04-26",
    readingTime: 9,
    featured: true,
    content: [
      {
        type: "p",
        text: "It is 03:14 in the morning. The on-call room smells like microwaved rice and disinfectant. My pager has gone off four times in the last hour, the last one for a young man with a falling oxygen saturation who needs me at his bedside in the next ninety seconds. Somewhere between the doorway and the lift, I close my eyes for half a step and ask God to please, please, give me wisdom in the next room.",
      },
      {
        type: "p",
        text: "That is what prayer looks like on call. Not the candlelit, journal-and-coffee version. The half-step version. The walking version. The one nobody warned me about in seminary or in medical school but which, I am slowly learning, is the version Jesus mostly modelled.",
      },
      {
        type: "h2",
        text: "Why a prayer life feels impossible at first",
      },
      {
        type: "p",
        text: "Most of the books I read on prayer when I was younger assumed I had a quiet hour first thing in the morning, a chair I always sat in, and a cup of coffee that didn't go cold while I read Psalm 119 in twelve sittings. None of those assumptions survive a clinical rotation. You don't know what time you'll wake up. You don't know whether your morning will involve a code blue or a coffee. You don't know if you'll see your bed before the next sundown.",
      },
      {
        type: "p",
        text: "If your idea of a prayer life depends on the right chair, you will lose your prayer life the first time the chair is taken from you. If your idea of a prayer life depends on Jesus actually being with you in the lift, in the cubicle, in the canteen, in the car park at 11pm — you'll find yourself praying more than you ever did before.",
      },
      {
        type: "h2",
        text: "The five-prayer day",
      },
      {
        type: "p",
        text: "I keep a small mental rhythm of five prayers, each tied to a moment that happens whether I plan it or not. They are short. They are ugly. They are also the spine of every shift I work.",
      },
      {
        type: "ul",
        items: [
          "Before the badge — when I clip my ID on, I ask God to make me a kind doctor today, not just a competent one.",
          "Before the round — between handover and the first patient, I ask Him to slow me down enough to actually see who I am about to walk in on.",
          "At the basin — every time I wash my hands (and I wash them a lot), I let the water be a small reset. 'Lord, I receive what You're giving in this room.'",
          "At the door — before I tell a family hard news, I stop, breathe, and say, 'Be the kindness in my voice.'",
          "At the lift down — at the end of the shift, I ride the lift in silence and hand the day back to Him. Mistakes included.",
        ],
      },
      {
        type: "p",
        text: "None of these prayers are paragraphs. Most are sentences. A few are just names. They are the equivalent of texting a friend rather than writing a letter. The friendship is what carries them.",
      },
      {
        type: "h2",
        text: "Scripture in your pocket",
      },
      {
        type: "p",
        text: "I have stopped trying to read big chunks of the Bible during a clinical week. I read one verse and let it follow me around. The week I learned to put a fluid line under pressure, the verse was Isaiah 41:10. The week I lost a patient I was very fond of, it was Psalm 34:18. Right now it is Lamentations 3:22-23.",
      },
      {
        type: "p",
        text: "The trick is not the verse. The trick is letting the verse interrupt me. When my hands are busy, my mind is loud, and a single sentence of Scripture is loud enough to be heard over the noise. A chapter would drown.",
      },
      {
        type: "h2",
        text: "Praying for patients without preaching at them",
      },
      {
        type: "p",
        text: "I almost never pray out loud for patients unless they ask. What I do is pray as I walk to their bed, while I take their history, while I write up their notes. I pray for their fear, for their family, for the next person who'll see them. I pray for the things I can't fix and the things I can.",
      },
      {
        type: "p",
        text: "Sometimes a patient asks. When that happens, the prayer is rarely long; it is rarely beautiful. It is mostly, 'Father, please be near so-and-so tonight.' That has been enough every single time.",
      },
      {
        type: "quote",
        text: "Prayer on call is not what you do when you have time. It is what you do because you don't.",
      },
      {
        type: "h2",
        text: "When the prayer goes quiet",
      },
      {
        type: "p",
        text: "There are weeks when none of this works. When I'm too tired to text my own mother let alone the God of the universe. When I climb into bed and realise I haven't said anything to Him in three days. Those weeks used to terrify me. Now I just tell Him about them and start again.",
      },
      {
        type: "p",
        text: "Prayer is not a performance review. It is a relationship. The relationship is steady whether the conversation is or not. He does not love me less on the days I don't call. He doesn't love me more on the days I do. He is — in the unbearably good language of the Psalms — a Father who pities. He knows my frame.",
      },
      {
        type: "h2",
        text: "A short challenge if you're trying this",
      },
      {
        type: "p",
        text: "Pick one moment that already happens in your day — your first sip of water, the lift ride home, the moment you put your bag down — and let that moment be a prayer. Don't add anything to your schedule. Just let one ordinary cue become a doorway. Do it for two weeks. Then come and tell me what changed.",
      },
      {
        type: "p",
        text: "I'm still mostly a 03:14 in the lift kind of girl. But I have started looking forward to the lift.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 3
  {
    id: "p-sunday-matters",
    slug: "why-sunday-still-matters-in-a-sixty-hour-week",
    title: "Why Sunday Still Matters in a Sixty-Hour Week",
    excerpt:
      "Sabbath is not a luxury for the lightly-loaded. It's the only thing standing between me and burning down my own life.",
    coverImage: cover.sundayLight,
    category: cat.faith,
    categories: [cat.faith, cat.life],
    tags: ["sabbath", "rest", "weekly-rhythm", "discipline"],
    author,
    publishedAt: "2026-04-22",
    readingTime: 7,
    featured: false,
    content: [
      {
        type: "p",
        text: "I used to think Sabbath was something invented for tired people in robes. A nice idea for a less complicated century. Then I worked five Sundays in a row and discovered something the people in robes have been saying all along: rest isn't a reward for finishing the work. It's the thing that lets you finish the work without finishing yourself.",
      },
      {
        type: "h2",
        text: "What I mean by Sunday",
      },
      {
        type: "p",
        text: "I don't mean an ideology. I mean a day a week, every week, where I deliberately stop being the person who solves things. I cannot always have it on Sunday. Sometimes the on-call rota means it lands on Tuesday. But it is always twenty-four hours, and it always has the same rules.",
      },
      {
        type: "ul",
        items: [
          "I do not open my work email.",
          "I do not pick up the on-call phone unless I'm rota'd.",
          "I do not 'just quickly' look at the rota for next month.",
          "I cook something slow. I read something long. I sit somewhere quiet.",
          "I go to church if I can. I sing in the choir if I'm scheduled. I sit in the pew if I'm not.",
          "I take a walk that has no destination.",
        ],
      },
      {
        type: "h2",
        text: "Why it works",
      },
      {
        type: "p",
        text: "The first reason is theological: I am not the engine of my own life. My production is not my worth. The day off is the weekly sermon I preach to myself about who's actually in charge.",
      },
      {
        type: "p",
        text: "The second reason is mechanical: I am a worse doctor without it. I make sloppier decisions. I am shorter with patients. I forget the names of the people I work with. The first half of the week after a worked Sunday feels like trying to draw a straight line on a moving train.",
      },
      {
        type: "h2",
        text: "What Sabbath isn't",
      },
      {
        type: "p",
        text: "It isn't a productivity hack. If you take a day off purely because it makes Monday more profitable, you've turned the day into a tool for the very thing it was meant to dethrone. Sabbath is a refusal to let work be the centre of your gravity, even for one day.",
      },
      {
        type: "p",
        text: "It also isn't an extra chore. The point isn't to fit more spiritual stuff into the day; the point is to fit fewer things in general. If I spend Sunday running errands I didn't have time for during the week, I have not rested. I have just renamed the workshop.",
      },
      {
        type: "quote",
        text: "Six days a week I make plans. One day a week I let God remind me whose week it actually is.",
      },
      {
        type: "h2",
        text: "If you can't have a whole day",
      },
      {
        type: "p",
        text: "Start with three hours. Pick the same three hours every week. Phone away. Notifications off. One activity that puts you in your body — cooking, walking, drawing, sitting in a service. After a month, see if you can stretch it to a morning. After three months, see if you can stretch it to a day.",
      },
      {
        type: "p",
        text: "You will be surprised how much of your week starts to organise itself around the day instead of the day getting squeezed by the week.",
      },
      {
        type: "h2",
        text: "And on the weeks you can't",
      },
      {
        type: "p",
        text: "You will work Sundays. You will be on call over Christmas. The point of Sabbath isn't a perfect record. The point is the rhythm. Take the next available day. Treat it the same way. The God who made the rhythm understands the rota; He invented the lung. He knows how the breathing is meant to work.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 4
  {
    id: "p-god-far-icu",
    slug: "when-god-feels-far-in-the-icu",
    title: "When God Feels Far in the ICU: Lessons in Holding On",
    excerpt:
      "Faith inside intensive care is rarely a feeling. It's a posture, a practice, and most days, the willingness to keep showing up.",
    coverImage: cover.hospitalNight,
    category: cat.faith,
    categories: [cat.faith, cat.medicine, cat.reflections],
    tags: ["doubt", "suffering", "icu", "faith"],
    author,
    publishedAt: "2026-04-18",
    readingTime: 10,
    featured: true,
    content: [
      {
        type: "p",
        text: "There is a particular silence on an ICU night. Monitors beeping in different keys. The hum of a ventilator finding its rhythm. The squeak of a nurse's shoes. And underneath all of it, sometimes, the loud, obvious, embarrassing absence of God.",
      },
      {
        type: "p",
        text: "I am not going to pretend I have always felt His nearness in those rooms. Some of the most distant I have ever felt from Him has been at three in the morning beside a young mother I could not save. So this isn't a tidy post about how prayer fixes ICU. It's a post about what to do when you are a believer and the room you are in does not feel believed-in.",
      },
      {
        type: "h2",
        text: "The honesty of lament",
      },
      {
        type: "p",
        text: "The Bible has a whole genre for this and we hardly ever quote it. About a third of the Psalms are lament. They include sentences like, 'How long, O Lord?' and, 'Why have you forsaken me?' If those sentences are in the songbook, they are allowed in our mouths.",
      },
      {
        type: "p",
        text: "When I cannot pray a normal prayer in the ICU, I pray a lament. 'God, I cannot feel You. This is unbearable. I do not understand.' Saying it out loud has, more than once, been the difference between staying in the room and walking out.",
      },
      {
        type: "h2",
        text: "Why feelings are not the test",
      },
      {
        type: "p",
        text: "If feelings were the test, I would have failed faith roughly 1,200 times by now. They are not. The test, if there is one, is whether I keep showing up to a Person who keeps showing up to me. He is a covenant God, not a vibes God. He keeps appointments I have forgotten making.",
      },
      {
        type: "p",
        text: "On the night I lost the young mother, I did not feel Him. I went home, I slept badly, and the next morning I went to early service because I had told someone I'd help with the coffee. Halfway through a hymn I have known since I was nine, He was, very obviously, in the room with me. He had been all along.",
      },
      {
        type: "h2",
        text: "What to do with your hands when your heart is empty",
      },
      {
        type: "ul",
        items: [
          "Read a Psalm out loud. Pick one even if you don't believe it that morning. Your throat is a chapel.",
          "Write down the names. The names of the patients. The names of the people praying for you. The names of the people you can't save and the names of the ones you can.",
          "Find a friend who knows. Not who can fix it. Who knows. Send them four words by text — 'today is a hard one' — and let them carry your evening.",
          "Show up to corporate worship, even when you'd rather hide in bed. Other people sing the songs over you when you can't sing them for yourself.",
          "Eat something. Sleep. Drink water. The Spirit is not a clean ghost; He works on a body.",
        ],
      },
      {
        type: "quote",
        text: "Faith is not the strength to keep believing in a feeling. Faith is the willingness to keep walking towards the Person, even with no feeling at all.",
      },
      {
        type: "h2",
        text: "The doctor's secret",
      },
      {
        type: "p",
        text: "Here is something nobody tells you in medical school. The patients who taught me the most about God were not the ones who survived. They were the ones who held my hand and said, 'It's okay, doctor. I'm not afraid.' They were saints I had no part in shaping. They were already prepared.",
      },
      {
        type: "p",
        text: "I have come out of ICU rooms, after watching someone die, more sure of God than when I went in — and I cannot fully explain why. Something about a person being so loved, so unafraid, in the middle of a thing I could not fix, has a way of standing as its own argument.",
      },
      {
        type: "h2",
        text: "If you're in the dark right now",
      },
      {
        type: "p",
        text: "Stay. Don't quit on the relationship in the dark; people make the worst decisions in the dark. Tell Him you can't feel Him. Show up to the next thing. Sleep. Then wake up and show up to the thing after that. He has not moved.",
      },
      {
        type: "p",
        text: "I am, very much still, a girl who sometimes cannot feel God in an ICU bay. I am also, very much, a girl who has watched Him be there anyway.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 5
  {
    id: "p-daily-devotion",
    slug: "the-quiet-discipline-of-daily-devotion",
    title: "The Quiet Discipline of Daily Devotion",
    excerpt:
      "How a fifteen-minute morning habit became the most boring, most important hour of my week.",
    coverImage: cover.bibleCoffee,
    category: cat.faith,
    categories: [cat.faith, cat.life],
    tags: ["devotion", "habits", "discipline", "spiritual-formation"],
    author,
    publishedAt: "2026-04-15",
    readingTime: 6,
    featured: false,
    content: [
      {
        type: "p",
        text: "I want to be very clear up front: I am not the morning-quiet-time hero you may have read about elsewhere. My devotional life would not impress your favourite Christian podcaster. I have missed days. I have missed weeks. There is a stretch of internship I would rather not talk about. What I do have, after a few honest years of trying, is a fifteen-minute habit that has done more for me than the four hours I once tried to pull off in a single Saturday.",
      },
      {
        type: "h2",
        text: "Why short matters more than impressive",
      },
      {
        type: "p",
        text: "Anything that depends on me being a hero on the day will not survive a hard week. The point of a devotional habit is not to make me feel pious. The point is to keep me in conversation with God when no part of my week is pious.",
      },
      {
        type: "p",
        text: "Fifteen minutes is short enough that I cannot reasonably tell myself I don't have time. It is long enough that something usually happens. And it is repeatable enough that I can do it tomorrow even if today went sideways.",
      },
      {
        type: "h2",
        text: "What goes in the fifteen minutes",
      },
      {
        type: "ol",
        items: [
          "Three minutes of silence with a cup of coffee, phone face-down. No agenda except being honest about how I feel walking in.",
          "Five minutes of Bible reading — usually one short passage, slowly, sometimes more than once. I'm currently moving through John, a few verses at a time.",
          "Two minutes of journaling: one sentence about what struck me, one sentence about what I want to ask God for today.",
          "Five minutes of prayer: thanksgiving, confession, intercession, then a long sigh. The long sigh is non-negotiable.",
        ],
      },
      {
        type: "h2",
        text: "The rules I set for myself",
      },
      {
        type: "ul",
        items: [
          "I do not check my phone before this happens. I'd rather move it to another room than fight myself at 5:30am.",
          "I keep the same chair, the same mug, the same notebook. The little ritual lowers the activation cost.",
          "If I miss a morning, I pick it up the next morning. No make-up sessions. No guilt trips. No 'I'll do thirty minutes tomorrow to make up.' Just back to normal.",
          "On the weeks I'm on nights, I move the fifteen minutes to before the shift. Not after. Worship before work, never after.",
        ],
      },
      {
        type: "quote",
        text: "Discipline is not the opposite of grace. Discipline is the way grace gets built into the rest of your day.",
      },
      {
        type: "h2",
        text: "What it does (and what it doesn't)",
      },
      {
        type: "p",
        text: "It doesn't make me a saint. It does make me a slightly slower, slightly kinder person to be around in the first hour of the day. It doesn't make hard decisions easy. It does mean that when I make them, my brain is already in the right room.",
      },
      {
        type: "p",
        text: "And on the days when nothing happens — when the passage is dry and the prayer is wooden — the habit is still doing its work. Showing up is the worship. The feeling, when it comes, is the bonus.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 6
  {
    id: "p-doctor-lifts",
    slug: "why-every-doctor-should-lift-weights",
    title: "Why Every Doctor Should Lift Weights",
    excerpt:
      "An argument, in three sets of five, for putting strength training at the centre of a clinical career.",
    coverImage: cover.weights,
    category: cat.sport,
    categories: [cat.sport, cat.medicine, cat.life],
    tags: ["strength", "weights", "doctor-fitness", "longevity"],
    author,
    publishedAt: "2026-04-12",
    readingTime: 8,
    featured: true,
    content: [
      {
        type: "p",
        text: "The first time I deadlifted my own bodyweight, I cried in the changing room. Not because it hurt, although it did, and not because I was proud of the number, although I was. I cried because I had spent my entire life being told that women — and especially women in caring professions — were supposed to be useful but not strong. The bar on the floor disagreed.",
      },
      {
        type: "p",
        text: "A few years and a lot of squats later, I am convinced that strength training is one of the most important things a doctor can do for her own patients. Here is the case, made to my colleagues, in three sets of five.",
      },
      {
        type: "h2",
        text: "Set one: your body is the tool",
      },
      {
        type: "p",
        text: "Medicine is a physical job. We stand for hours. We bend over patients. We carry equipment. We move people. We do CPR. The single most under-trained muscle in a doctor's body is usually her posterior chain — the back, glutes and hamstrings that hold her upright.",
      },
      {
        type: "ul",
        items: [
          "You will not herniate a disc in the way you imagined; you will herniate it lifting a textbook off the floor on a tired Tuesday.",
          "Strong glutes do more for your back than any ergonomic chair you'll ever buy.",
          "A grippy, capable forearm is the difference between an easy procedure and a tired one.",
          "A strong core is what keeps your shoulders from doing your back's job.",
          "The injury most likely to derail your career is a chronic one, slowly accumulated. Strength training is the cheapest insurance you can buy.",
        ],
      },
      {
        type: "h2",
        text: "Set two: it is the best medicine you can prescribe",
      },
      {
        type: "p",
        text: "I cannot, with a straight face, tell my hypertensive patients to exercise if I'm not exercising. I cannot tell my elderly patients to maintain their muscle if I'm letting mine atrophy. I cannot tell new mothers their pelvic floor is trainable if I have never trained mine.",
      },
      {
        type: "p",
        text: "Strength training also produces evidence in the body of evidence-based medicine. The patients I'm closest to, the ones who actually take my advice on movement, are the ones who can see I do it too. There is no faster way to lose a patient's trust than to recommend something you obviously don't believe in enough to do yourself.",
      },
      {
        type: "h2",
        text: "Set three: it is the cheapest mental health intervention I know",
      },
      {
        type: "p",
        text: "The data on resistance training and depression is not subtle. The data on resistance training and anxiety is not subtle. The data on resistance training and stress hormones is not subtle. As doctors, we know this. We rarely apply it to ourselves.",
      },
      {
        type: "p",
        text: "There is also something about lifting heavy that resets the brain. After a difficult day on the ward, I do not need a long, contemplative cool-down. I need to put weight on a bar, do five hard sets, and remember that my body is mine and capable. I leave the gym in a different posture. The patient in bed seven does not get a worse doctor in the morning because of it.",
      },
      {
        type: "quote",
        text: "Strength is not the opposite of softness. Strength is what makes softness sustainable.",
      },
      {
        type: "h2",
        text: "How to actually start",
      },
      {
        type: "ol",
        items: [
          "Pick three sessions a week, an hour each, on the same days. Treat them like a clinic — non-negotiable, non-cancellable.",
          "Learn the squat, the hinge, the press, the row, the carry. Five movements. Add a sixth (a lunge or step-up) once you've earned it.",
          "Use a beginner programme written by someone qualified. Don't freelance for the first six months.",
          "Track three numbers: total weight on bar, sets, reps. Slow, steady, boring progress is the entire game.",
          "Eat enough protein. Sleep enough. Be patient with the body you have for two whole years before judging it.",
        ],
      },
      {
        type: "h2",
        text: "What changes",
      },
      {
        type: "p",
        text: "After six months, your bag will feel lighter. After a year, your patients will start asking what you do differently. After two years, you will have a body that runs the wards instead of being run by them. After five, you will quietly become the kind of doctor your younger patients want to be when they grow up.",
      },
      {
        type: "p",
        text: "The bar on the floor is waiting. So are your patients. Pick it up.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 7
  {
    id: "p-running-long",
    slug: "running-long-the-mental-game-of-distance",
    title: "Running Long: The Mental Game of Distance",
    excerpt:
      "What twenty kilometres on a Saturday morning has taught me about prayer, patience and finishing what I start.",
    coverImage: cover.runningRoad,
    category: cat.sport,
    categories: [cat.sport, cat.reflections, cat.faith],
    tags: ["running", "endurance", "discipline", "mental-health"],
    author,
    publishedAt: "2026-04-08",
    readingTime: 7,
    featured: false,
    content: [
      {
        type: "p",
        text: "I run on Saturday mornings. Not because Saturday is sacred, but because Saturday is the only day no one needs me at six in the morning. The route is the same: out the door, down the road, past the school, past the second roundabout, along the river, over the bridge, and back. Twenty-two kilometres if I go all the way, fourteen if my knees vote otherwise.",
      },
      {
        type: "p",
        text: "Most weeks I leave the house in a bad mood. Most weeks I come back a person I would rather be married to.",
      },
      {
        type: "h2",
        text: "Why I started running long",
      },
      {
        type: "p",
        text: "I started because short runs were not doing what I needed them to do. Five kilometres is enough to clear your head. Twenty is enough to clear your soul. Somewhere around the eighth kilometre your body stops asking you why you're doing this and starts agreeing to it. Somewhere around the fifteenth, you stop having a body in any way you'd recognise — there is just a steady forward motion and the small inner voice you've been avoiding all week.",
      },
      {
        type: "p",
        text: "I do my best praying on long runs. I do my best thinking. I make decisions on the bridge that I have been putting off for months. The shoes are a confessional with a lining.",
      },
      {
        type: "h2",
        text: "What you actually argue with on a long run",
      },
      {
        type: "ul",
        items: [
          "The voice that wants to stop at kilometre four. Acknowledge it. Run another kilometre.",
          "The voice that wants to check your watch. Don't. Look at a tree. Look at a bird. Look at the ground.",
          "The voice that says 'this is not who you are.' It is wrong. Quietly outlast it.",
          "The voice that wants to make a plan. You will make worse plans on a long run than at any other time. Postpone all major decisions until the cool-down.",
          "The voice that prays. Listen to that one.",
        ],
      },
      {
        type: "h2",
        text: "What it teaches that the gym doesn't",
      },
      {
        type: "p",
        text: "Lifting teaches you to be strong. Running long teaches you to be patient. They are different skills. You need both.",
      },
      {
        type: "p",
        text: "Patience is the muscle I most needed as a junior doctor. Most of medicine is not the dramatic moment. Most of medicine is the slow, repetitive, attentive showing up. It is twenty kilometres, not the last hundred metres. Long runs trained the part of me that can do the slow, repetitive, attentive thing without flinching.",
      },
      {
        type: "quote",
        text: "Distance running and clinical practice are the same skill in different shoes: the willingness to stay in the room.",
      },
      {
        type: "h2",
        text: "How to start without injuring yourself",
      },
      {
        type: "ol",
        items: [
          "Run-walk for the first eight weeks. Run two minutes, walk one. Don't be a hero in the first month.",
          "Add no more than 10% to your weekly mileage. Boring is the goal.",
          "One long run a week. Two easier runs. One day of strength. Three rest days. That is the whole thing.",
          "Buy proper shoes from a proper shop. Replace them every 600km whether you feel like it or not.",
          "Eat. A long run is not the time to also be in a calorie deficit. The body needs fuel to do this.",
        ],
      },
      {
        type: "h2",
        text: "Why I keep going back",
      },
      {
        type: "p",
        text: "Because at the end of every long run there is a moment, usually right after the last gasp, when I am unmistakably aware of being alive. The traffic noise sounds different. The water tastes different. I look at my hands and they look like instruments. I think this is what the Psalms mean about being fearfully and wonderfully made.",
      },
      {
        type: "p",
        text: "Twenty kilometres on a Saturday morning is the cheapest cathedral I know.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 8
  {
    id: "p-home-gym",
    slug: "building-a-home-gym-that-survives-night-call",
    title: "Building a Home Gym That Survives Night Call",
    excerpt:
      "A small, ugly, un-Instagrammable corner of the spare room that has done more for my career than any course I've ever paid for.",
    coverImage: cover.homeGym,
    category: cat.sport,
    categories: [cat.sport, cat.life],
    tags: ["home-gym", "fitness", "shift-work", "habits"],
    author,
    publishedAt: "2026-04-04",
    readingTime: 6,
    featured: false,
    content: [
      {
        type: "p",
        text: "My home gym is a corner of the spare room that contains: a single barbell, a small set of plates, a pull-up bar bolted into the doorway, a kettlebell, a yoga mat, a foam roller, and a speaker. It cost less than three months of a commercial gym membership and has been the difference between training consistently and not training at all.",
      },
      {
        type: "h2",
        text: "Why a commercial gym stopped working for me",
      },
      {
        type: "p",
        text: "It wasn't the gym's fault. It was the rota's. When you finish a shift at 22:00 and you're back on the ward at 07:30, the only window you have is morning, and the only morning you have is one with no commute attached to it. By the time I had driven to a gym and changed, half of that window was gone.",
      },
      {
        type: "p",
        text: "A home set-up means I lift in pyjamas if I want to. I lift before I'm fully awake. I lift in the ten minutes between the kettle going on and the toast popping out. The friction is gone, and friction is what kills habits.",
      },
      {
        type: "h2",
        text: "What I'd buy first if I were starting again",
      },
      {
        type: "ol",
        items: [
          "A pull-up bar that wedges into a doorway. Costs almost nothing. Rewards you for the rest of your life.",
          "A 16kg or 24kg kettlebell. One bell, twenty exercises. Buy heavier than you think.",
          "A decent yoga mat. Not for yoga necessarily — for the floor work that you'll do daily once you have one.",
          "A jump rope. Cardio in a backpack. Three minutes equals a kilometre run.",
          "Resistance bands. Underrated. They sneak into your suitcase when you travel.",
        ],
      },
      {
        type: "p",
        text: "If you can stretch a little, add a barbell, plates, and a single stand. That five-piece kit is enough for a decade of progress without ever stepping into a gym.",
      },
      {
        type: "h2",
        text: "The session that fits a fifteen-minute window",
      },
      {
        type: "p",
        text: "Five rounds, alternating, with thirty seconds of rest between rounds:",
      },
      {
        type: "ul",
        items: [
          "Ten kettlebell swings.",
          "Five pull-ups (or three, or one — do what you have).",
          "Ten goblet squats with the kettlebell at your chest.",
          "Twenty seconds of plank.",
        ],
      },
      {
        type: "p",
        text: "Total time: just under fifteen minutes. Total cost: free. Total impact: more than the eighty-minute session you'll never actually do because you'd have to drive to it.",
      },
      {
        type: "quote",
        text: "Consistency beats intensity. Always. The session you do is always better than the session you planned.",
      },
      {
        type: "h2",
        text: "What changes",
      },
      {
        type: "p",
        text: "After three months, you will have lifted weights more often than in the previous three years. After six, your shoulders will sit lower on a long shift. After a year, you will be the colleague who looks suspiciously well-rested. The room is small and the kit is ugly. Both are features, not bugs.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 9
  {
    id: "p-on-call",
    slug: "on-call-a-day-in-the-life-of-a-junior-doctor",
    title: "On Call: A Day in the Life of a Junior Doctor",
    excerpt:
      "What residency actually looks like — minute by minute, pager by pager, mug of cold coffee by mug of cold coffee.",
    coverImage: cover.stethoscope,
    category: cat.medicine,
    categories: [cat.medicine, cat.journal],
    tags: ["residency", "on-call", "junior-doctor", "hospital-life"],
    author,
    publishedAt: "2026-03-31",
    readingTime: 11,
    featured: true,
    content: [
      {
        type: "p",
        text: "People ask me what being a junior doctor is actually like and I never know how to answer in the lift. So here is the answer in a post. This is one on-call day, more or less the way it happens, more or less every time.",
      },
      {
        type: "h2",
        text: "06:30 — wake",
      },
      {
        type: "p",
        text: "The alarm is unkind. I drink water before I touch my phone. I make coffee. I read one psalm and ask God to make me kind today. I press my scrubs because pressed scrubs make me feel like the day has not won yet.",
      },
      {
        type: "h2",
        text: "07:30 — handover",
      },
      {
        type: "p",
        text: "We sit in the small room next to the doctors' office. The night team hands over twenty-three patients. The coffee gets cold during patient nine. We learn that bed seven is unwell, bed twelve is going to theatre, bed eighteen is waiting on a scan, bed twenty-two might be going home if the family can be reached. I write everything in a four-column table I redesigned in second year. The table has saved my life more times than I can count.",
      },
      {
        type: "h2",
        text: "08:15 — the round",
      },
      {
        type: "p",
        text: "The consultant arrives. We start at bed one. I present, the consultant examines, the registrar asks questions, the medical student takes notes I will later have to retype. We move from bed to bed at the speed of a sympathetic glacier. Every bed is a person. Every person has a story I will not have time to hear in full.",
      },
      {
        type: "p",
        text: "The pager goes off twice during the round. Once for a chest pain. Once because the porters have lost a wheelchair. I learn to tell the difference between the two by the rhythm of the beeps. The consultant pretends not to hear. The pager pretends not to notice.",
      },
      {
        type: "h2",
        text: "10:45 — the jobs list",
      },
      {
        type: "p",
        text: "By the end of the round there are forty-seven jobs to do. Some are five seconds long. Some are an hour. The skill of a junior doctor is not memorising medicine; it is sequencing. Which job, in which order, on which patient, before what time. Get the sequencing right and the day flows. Get it wrong and you spend the afternoon putting out small fires.",
      },
      {
        type: "ul",
        items: [
          "Bloods on bed nine before the lab closes at 11:30.",
          "Discharge summary on bed twenty-two before the family arrives at 14:00.",
          "Refer bed eighteen to gastroenterology before the on-call registrar leaves at 16:00.",
          "Update bed twelve's family. Their flight lands at 13:00.",
          "Review the swab on bed three at 12:30. Change antibiotics if needed.",
        ],
      },
      {
        type: "h2",
        text: "12:30 — lunch (in theory)",
      },
      {
        type: "p",
        text: "Lunch is a sandwich eaten in the corridor on the way to a chest x-ray. I have eaten more meals standing up in the last three years than sitting down. I am working on this; I am not yet good at it.",
      },
      {
        type: "h2",
        text: "14:00 — the family meeting",
      },
      {
        type: "p",
        text: "I sit with bed twenty-two's daughter in the relatives' room. I tell her, in plain English, that her father is not going to get better. I do not use any words longer than five letters. I have practised this conversation in my head three times this week. It is still hard. She cries. I listen. I do not fill the silence. The silence is doing work I am not allowed to interrupt.",
      },
      {
        type: "h2",
        text: "16:00 — the wave",
      },
      {
        type: "p",
        text: "Around four o'clock, every junior doctor in the building feels the same wave. The list looks unfinishable. The pager is going off. The night team is hours away. The wave will pass if I keep going. It always does. The only way through is one job at a time.",
      },
      {
        type: "h2",
        text: "18:30 — handover (round two)",
      },
      {
        type: "p",
        text: "The night team arrives. We hand back the same twenty-three patients, plus three new ones, plus a complicated story about bed seven. They take notes. They will be the people who hold these patients through the dark hours. I quietly thank them with my eyes and my voice. I have been them.",
      },
      {
        type: "h2",
        text: "19:30 — the lift",
      },
      {
        type: "p",
        text: "The lift down at the end of the day is its own small ritual. Nobody talks. Everybody is recovering. I pray on the lift. I always do.",
      },
      {
        type: "quote",
        text: "Junior doctoring is not the heroic version of medicine you saw on television. It is the patient, sleeves-rolled, sequencing, listening, lift-praying version. It is enough.",
      },
      {
        type: "h2",
        text: "20:00 — home",
      },
      {
        type: "p",
        text: "I cook something simple. I sit on the floor with my back against the sofa. I open my notebook and write down one thing that went well and one thing I want to do differently. The day is too big to remember in full. The notebook holds the parts I want to keep.",
      },
      {
        type: "h2",
        text: "Why I do it anyway",
      },
      {
        type: "p",
        text: "Because in a single day I get to be present for fifty different moments of someone else's life that they will remember forever. The first time the news lands on bed twenty-two's daughter. The relief on bed twenty-two's face when his pain comes down. The teaching of a third-year student in the corridor. The hand on a stranger's shoulder.",
      },
      {
        type: "p",
        text: "The pager is annoying. The hours are absurd. The work is the closest thing to a vocation I have ever known.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 10
  {
    id: "p-patients-wish",
    slug: "what-every-patient-wishes-their-doctor-knew",
    title: "What Every Patient Wishes Their Doctor Knew",
    excerpt:
      "After three years on the wards, the things patients quietly tell me — and the things they wish I'd remember.",
    coverImage: cover.doctorPatient,
    category: cat.medicine,
    categories: [cat.medicine, cat.reflections],
    tags: ["empathy", "bedside-manner", "patient-care", "communication"],
    author,
    publishedAt: "2026-03-26",
    readingTime: 8,
    featured: true,
    content: [
      {
        type: "p",
        text: "Most of what I have learned about being a good doctor I have learned from patients telling me what their last doctor did wrong. They do not put it that way. They say things like, 'You're the first one who sat down,' or, 'Nobody told me that before,' or, 'I was too scared to ask.' The same notes keep recurring. After three years on the wards, I have a list.",
      },
      {
        type: "h2",
        text: "1. They are terrified, and they are very good at hiding it",
      },
      {
        type: "p",
        text: "By the time a patient is talking to you, they have already been afraid for hours, possibly weeks, possibly years. They have rehearsed the conversation. They have googled their symptoms. They have typed and deleted seven different ways of describing the lump. The calm voice you are listening to is not their actual voice. Their actual voice is in their hands, which are doing the thing hands do when people are trying very hard not to cry.",
      },
      {
        type: "p",
        text: "Sit down. Put your stethoscope away. Look at the hands.",
      },
      {
        type: "h2",
        text: "2. They want to know if you have heard them",
      },
      {
        type: "p",
        text: "Patients do not need you to fix everything they tell you. They need you to repeat back what they said. The single most powerful sentence in clinical practice is, 'So what I'm hearing is —' followed by their words, in their order, with their emphasis. After that, almost any plan you propose has a chance of working.",
      },
      {
        type: "h2",
        text: "3. They want their name",
      },
      {
        type: "p",
        text: "Use it. Three times in the first thirty seconds. 'Good morning, Mrs Adjei. I'm one of the doctors looking after you, Mrs Adjei. How are you feeling today, Mrs Adjei?' It sounds clumsy on paper. It is the kindest thing you can do for a person who has been a bed number all morning.",
      },
      {
        type: "h2",
        text: "4. They want plain English",
      },
      {
        type: "p",
        text: "Not because they are unintelligent. Because they are unwell. The brain on illness has roughly half the bandwidth of a healthy brain. If you say 'pyrexia' you are saying nothing. If you say 'fever' you are saying everything. Use the small words. Earn the right to use the big ones.",
      },
      {
        type: "h2",
        text: "5. They want a number",
      },
      {
        type: "p",
        text: "When you say 'often' they hear something different than when you say 'one in twenty.' If you can give a number, give one. If you can't, say so. Vague reassurance is worse than honest uncertainty.",
      },
      {
        type: "h2",
        text: "6. They want to know what's next",
      },
      {
        type: "p",
        text: "Before you walk out of the room, tell them three things: what you are going to do next, when you will be back, and what would make them call for you. If you cannot tell them when you'll be back, tell them when the next person will be by. Patients can endure almost any wait if they know what they are waiting for.",
      },
      {
        type: "h2",
        text: "7. They notice everything you do not say",
      },
      {
        type: "ul",
        items: [
          "The look you exchanged with the registrar at the foot of the bed.",
          "The way your eyes moved to the chart when they asked the hard question.",
          "The fact you didn't quite answer the bit they wanted you to answer.",
          "The note you didn't write down.",
          "The way you said 'we' instead of 'I' when the news was hard.",
        ],
      },
      {
        type: "p",
        text: "They are paying more attention to you than you are paying to them. Be worthy of the attention.",
      },
      {
        type: "quote",
        text: "Bedside manner is not a soft skill. It is the part of medicine the patient remembers when the rest of medicine has done its work.",
      },
      {
        type: "h2",
        text: "8. They want you to be a person",
      },
      {
        type: "p",
        text: "Not a heroic person. Not a perfect person. A person who looks tired sometimes and admits it. A person who says, 'I don't know — let me find out.' A person who laughs at the joke before composing themselves. A person who, when the news is bad, allows the news to be bad in their face for a second before moving on. Patients do not want a robot in a white coat. They want someone who looks like the friend they would call.",
      },
      {
        type: "h2",
        text: "What I keep practising",
      },
      {
        type: "p",
        text: "Slowing down at the door. Sitting before talking. Asking 'what else?' before closing the conversation. Saying the patient's name once more on the way out. None of this is taught in lectures. All of it is the medicine that survives the discharge.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 11
  {
    id: "p-burnout",
    slug: "burnout-in-white-coats-spotting-it-before-it-spots-you",
    title: "Burnout in White Coats: Spotting It Before It Spots You",
    excerpt:
      "What burnout actually looks like in junior doctors — the early signs nobody warns you about, and the small interventions that make a real difference.",
    coverImage: cover.burnoutCoat,
    category: cat.medicine,
    categories: [cat.medicine, cat.life, cat.reflections],
    tags: ["burnout", "wellness", "physician-life", "mental-health"],
    author,
    publishedAt: "2026-03-22",
    readingTime: 9,
    featured: false,
    content: [
      {
        type: "p",
        text: "The first time I burned out, I didn't know I was burning out. I thought I was lazy. I had stopped enjoying things I used to love. I was short with the people I worked with. I cried in the changing room about a small piece of paperwork. I would have told you, with a straight face, that I was 'just a bit tired.'",
      },
      {
        type: "p",
        text: "I was not just a bit tired. I was burned out, and nobody around me — including me — was reading the signs accurately. Two years and several conversations with wiser doctors later, I have a checklist. I share it now in the hope that you, or someone in your team, will recognise yourself in it sooner than I did.",
      },
      {
        type: "h2",
        text: "What burnout actually looks like in junior doctors",
      },
      {
        type: "p",
        text: "The textbook talks about emotional exhaustion, depersonalisation and reduced personal accomplishment. Useful, but vague. Here is the same thing in the language of a real day on a real ward.",
      },
      {
        type: "ul",
        items: [
          "You stop using patient names. Bed numbers feel safer.",
          "You catch yourself hoping a patient gets transferred so they become someone else's problem.",
          "Your pager going off triggers a small wave of nausea, even when the message turns out to be benign.",
          "You can't remember the last time you laughed at handover.",
          "You spend your one day off recovering from the week, then dread Monday by Sunday lunch.",
          "You stop initiating contact with friends because the energy required to be 'fine' for an evening is more than you have.",
          "You start looking up other careers in the small hours of the morning. Not seriously. Just often.",
        ],
      },
      {
        type: "p",
        text: "If three or more of those are true for you right now, please read the rest of this carefully.",
      },
      {
        type: "h2",
        text: "Why it happens to good doctors",
      },
      {
        type: "p",
        text: "Burnout is not weakness. It is what happens when sustained demand outstrips sustained recovery. The conscientious doctors are usually the ones who burn out first because they are the ones who carry the small extras — the family update, the last set of bloods, the patient who asked one more question. None of those are bad things. The cumulative weight of them, week after week, with no recovery built in, is.",
      },
      {
        type: "h2",
        text: "The small interventions that have actually helped me",
      },
      {
        type: "ol",
        items: [
          "A protected hour every weekday — phone off, no work, no chores. Mine is between 19:00 and 20:00. Yours can be whenever. The point is that it is the same hour every day.",
          "A protected day every week. See the post on Sabbath. This is the single highest-leverage intervention I have ever made.",
          "Regular movement, almost every day. Not as punishment, not for the metrics. For the nervous system.",
          "One conversation a week with a doctor who is at least three years more senior than you. Not for advice. For perspective. Most of what feels uniquely terrible is not unique.",
          "Sleep as a non-negotiable. Less than six hours, more than two nights in a row, and your judgment is already compromised. Treat it like a clinical reading.",
          "A therapist. If you can find one who has worked with healthcare professionals, even better. Therapy is not weakness. It is professional development.",
        ],
      },
      {
        type: "h2",
        text: "What to do if you're already there",
      },
      {
        type: "p",
        text: "Tell someone. The pattern that keeps junior doctors trapped in burnout is the one where they keep their burnout secret because they think it would be unprofessional to admit it. The opposite is true. The most professional thing you can do, when you are not safe to keep going at this pace, is to say so.",
      },
      {
        type: "p",
        text: "Tell your supervisor. Tell your GP. Tell your spouse. Tell your friend. Tell your church. Tell whoever is closest. The single most predictive factor for recovering from burnout is breaking the secrecy around it.",
      },
      {
        type: "quote",
        text: "Burnout is what happens when you treat your soul like a tool. You are not a tool. You are a person who has been entrusted with other people. Take care of the entrusted.",
      },
      {
        type: "h2",
        text: "On asking for time off",
      },
      {
        type: "p",
        text: "If you need time off, take it. Take it before you need it. Take it again when the next quarter is hard. Time off is not a confession of failure; it is the maintenance schedule on a piece of equipment that the world rather urgently needs to keep working.",
      },
      {
        type: "p",
        text: "Your patients do not need a doctor who never stops. They need a doctor who is good when she is on. Time off is part of being good when you are on.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 12
  {
    id: "p-five-books",
    slug: "five-books-that-shaped-me-this-year",
    title: "Five Books That Shaped Me This Year",
    excerpt:
      "A short reading list from a long year — the books that arrived at the right time and quietly rearranged me.",
    coverImage: cover.booksStack,
    category: cat.life,
    categories: [cat.life, cat.reflections],
    tags: ["reading", "books", "personal-growth"],
    author,
    publishedAt: "2026-03-18",
    readingTime: 7,
    featured: false,
    content: [
      {
        type: "p",
        text: "I read forty-three books last year. Most were good. Many were forgettable. Five followed me out of the year and into this one. Here they are, in the order they arrived.",
      },
      {
        type: "h2",
        text: "1. Being Mortal — Atul Gawande",
      },
      {
        type: "p",
        text: "I read this in my second year of medical school and didn't understand it. I re-read it last year and finished it in a single sitting on a quiet Sunday afternoon. Gawande writes about the limits of medicine with a tenderness most physicians lose in their first six months on the wards. He has not lost it. The book changed the way I write end-of-life notes. It changed the way I sit with families. It made me a more honest doctor.",
      },
      {
        type: "h2",
        text: "2. Gentle and Lowly — Dane Ortlund",
      },
      {
        type: "p",
        text: "A small book, mostly about a single sentence in Matthew 11. Ortlund spends two hundred pages on the words, 'gentle and lowly in heart,' and somehow they are not enough. The book tells you nothing new about the gospel and everything new about the heart of the One offering it. It made me a less defensive Christian. It made me kinder to myself.",
      },
      {
        type: "h2",
        text: "3. The Long Loneliness — Dorothy Day",
      },
      {
        type: "p",
        text: "Dorothy Day's autobiography is one of the few Christian memoirs that does not make me want to throw it across the room halfway through. Her account of becoming a Catholic, founding the Catholic Worker movement and serving the poorest is unsentimental, unromantic and unforgettable. Read it if you suspect your faith has become too comfortable. Read it again if you suspect you have become too important.",
      },
      {
        type: "h2",
        text: "4. Bird by Bird — Anne Lamott",
      },
      {
        type: "p",
        text: "I have given this book to three friends and read my own copy twice. It is a writing manual disguised as a memoir, or possibly the other way round. Lamott's chapter on 'shitty first drafts' is the single most helpful chapter on writing I have ever read. It also applies to clinical notes, to relationships, to prayer and to most of life. Take the bird by bird, she says. Don't try to take the whole flock at once.",
      },
      {
        type: "h2",
        text: "5. Ordering Your Private World — Gordon MacDonald",
      },
      {
        type: "p",
        text: "An older book that has aged well. MacDonald argues, gently and persistently, that an unattended inner life will produce a chaotic outer life — and that the inner life cannot be tended in spare moments. It must be tended on purpose. He gave me language for the rhythms I was trying to build. The chapter on the call to listen is worth the price of the book.",
      },
      {
        type: "quote",
        text: "Tell me what you read in the small hours of the morning and I will tell you what kind of person you are becoming.",
      },
      {
        type: "h2",
        text: "What I'm reading next",
      },
      {
        type: "ul",
        items: [
          "The Cost of Discipleship — Bonhoeffer (re-read).",
          "When Breath Becomes Air — Paul Kalanithi.",
          "A Little Life — Hanya Yanagihara (slowly, with breaks).",
          "The Whole Christ — Sinclair Ferguson.",
          "Run Towards the Danger — Sarah Polley.",
        ],
      },
      {
        type: "p",
        text: "If you've read any of these, write to me. I want to know which sentence stayed with you.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 13
  {
    id: "p-quiet-confidence",
    slug: "the-quiet-confidence-of-doing-the-next-right-thing",
    title: "The Quiet Confidence of Doing the Next Right Thing",
    excerpt:
      "How a small phrase from a Frozen song became the operating principle of my twenties.",
    coverImage: cover.windowJournal,
    category: cat.reflections,
    categories: [cat.reflections, cat.faith, cat.life],
    tags: ["philosophy", "discipline", "life-lessons"],
    author,
    publishedAt: "2026-03-13",
    readingTime: 5,
    featured: false,
    content: [
      {
        type: "p",
        text: "There is a song in the second Frozen film called 'The Next Right Thing.' Anna sings it at the lowest moment of her arc, sitting in a cave, sure that everyone she loves has died. She doesn't try to fix everything. She doesn't try to feel better. She decides, slowly and unspectacularly, to take one step. Then the next.",
      },
      {
        type: "p",
        text: "I was twenty-three the first time I really listened to that song. I have been borrowing it as life advice ever since.",
      },
      {
        type: "h2",
        text: "Why grand plans rarely survive",
      },
      {
        type: "p",
        text: "I am as susceptible to a five-year plan as anyone. I have written several. None of them have survived their first contact with reality. Reality, it turns out, has its own ideas. Husbands appear and disappear. Job offers fall through. Pandemics happen. People you love get sick.",
      },
      {
        type: "p",
        text: "A grand plan needs the world to cooperate. The next right thing only needs the next ten minutes.",
      },
      {
        type: "h2",
        text: "What 'the next right thing' actually means",
      },
      {
        type: "ul",
        items: [
          "It is the smallest unit of obedience available to you in this moment.",
          "It is what your wisest friend would tell you to do, if she were standing here.",
          "It is rarely heroic. It is usually boring.",
          "It is almost always either: get up, eat something, move your body, call someone, do the dishes, send the email, say sorry, pray, or sleep.",
          "It does not require knowing the next thing after that. It requires only doing this one.",
        ],
      },
      {
        type: "h2",
        text: "Where this principle has carried me",
      },
      {
        type: "p",
        text: "Through medical school exams I was sure I would fail. Through the death of a patient I was very fond of. Through a breakup I did not see coming. Through a year of night shifts. Through a season of doubt I did not know how to talk about. Through, frankly, this morning.",
      },
      {
        type: "p",
        text: "I did not, in any of those seasons, have a strategy. I had the next right thing, and the next, and the next. The strategy assembled itself in the rear-view mirror.",
      },
      {
        type: "quote",
        text: "Faithfulness is mostly the willingness to do the next small obedient thing, in the order God hands it to you.",
      },
      {
        type: "h2",
        text: "When you can't see the next right thing",
      },
      {
        type: "p",
        text: "Make a cup of tea. That is almost always the next right thing when you can't see the next right thing. By the time the kettle has boiled, the next thing usually shows up.",
      },
      {
        type: "p",
        text: "If it doesn't, drink the tea, and try again in twenty minutes. The point is to keep yourself within reach of obedience. The plan can wait.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── 14
  {
    id: "p-many-hats",
    slug: "on-being-a-girl-who-wears-many-hats",
    title: "On Being a Girl Who Wears Many Hats",
    excerpt:
      "What the world keeps asking me to choose between, and why I keep refusing.",
    coverImage: cover.womanDawn,
    category: cat.reflections,
    categories: [cat.reflections, cat.life, cat.journal],
    tags: ["identity", "womanhood", "vocation", "multifaceted"],
    author,
    publishedAt: "2026-03-09",
    readingTime: 6,
    featured: true,
    content: [
      {
        type: "p",
        text: "The world has a strong preference for one-word descriptions. Doctor. Christian. Athlete. Sister. Friend. The world assumes that if you can be neatly summarised in a single word, it can find a place for you. The world is not wrong about this. It is also not the whole truth.",
      },
      {
        type: "p",
        text: "I am a doctor. I am also a Christian. I am also a runner. I am also a sister, a daughter, a friend, a back-row alto, a cook, a reader, a sometimes-writer, a tired traveller, an early-morning person, a late-night thinker. None of those words is a costume. All of them are hats. The hats fit.",
      },
      {
        type: "h2",
        text: "On the people who try to make you choose",
      },
      {
        type: "p",
        text: "There is a particular kind of well-meaning person — usually older, usually male, usually about to give you advice — who will tell you that you cannot be all of these things well. You will have to choose. Pick a lane. Specialise. They mean it kindly. They are also wrong.",
      },
      {
        type: "p",
        text: "What they are confusing is intensity with identity. They are confusing 'you can't do all of these at maximum volume at the same hour' (true) with 'you cannot, over a lifetime, be all of these' (false). My twenties have been mostly clinical work. My thirties may be mostly something else. The hats are not all on at once. They take turns. The head is the same.",
      },
      {
        type: "h2",
        text: "The cost of being multifaceted",
      },
      {
        type: "ul",
        items: [
          "You will be slightly slower at any single thing than the person who only does that thing.",
          "Your CV will look unconventional. Some employers will love this and some will not.",
          "You will be misunderstood, regularly, by people who only see one of your hats.",
          "You will sometimes envy your single-track friends. The envy will pass; their lives are also hard.",
          "You will have to do the work, repeatedly, of integrating the parts of yourself.",
        ],
      },
      {
        type: "h2",
        text: "The gift of being multifaceted",
      },
      {
        type: "p",
        text: "You will be a better doctor for being a believer, and a better believer for being a doctor. You will be a better runner for the discipline you learned in study, and a better student for the patience you learned on long runs. You will be a better friend for having had to make sense of yourself out loud. You will, when the time comes, be a better mother for having lived long enough to know who you are.",
      },
      {
        type: "p",
        text: "The integration is the work. The integration is also the gift.",
      },
      {
        type: "quote",
        text: "I will not apologise for being more than one thing. The more-than-one-thing is the thing.",
      },
      {
        type: "h2",
        text: "If you are a girl reading this who feels split",
      },
      {
        type: "p",
        text: "Pick up the hat that fits today. Wear it well. Put it down at sundown. Pick up the next one tomorrow. Stop trying to wear them all at once and stop apologising for owning more than one.",
      },
      {
        type: "p",
        text: "You are not a brand. You are a person. The brand was always the lesser thing.",
      },
    ],
  },
];

// ── Display slices ──────────────────────────────────────────────────────────

export const heroFeaturedPosts: BlogPost[] = aboutAGirlPosts
  .filter((p) => p.featured)
  .slice(0, 3);

export const freshPosts: BlogPost[] = aboutAGirlPosts.slice(0, 6);

export const recentArticles: BlogPost[] = aboutAGirlPosts.slice(6, 9);

export const featuredSidebarPosts: BlogPost[] = aboutAGirlPosts
  .filter((p) => p.featured)
  .slice(0, 1);

export const relatedArticles: BlogPost[] = aboutAGirlPosts.slice(9, 12);

export const trendingItems: TrendingItem[] = aboutAGirlPosts
  .slice(0, 5)
  .map((p, i) => ({
    id: `t-${i + 1}`,
    title: p.title,
    category: p.category,
    slug: p.slug,
  }));

export const popularTags: Tag[] = [
  { name: "Faith", slug: "faith" },
  { name: "Prayer", slug: "prayer" },
  { name: "Sabbath", slug: "sabbath" },
  { name: "On Call", slug: "on-call" },
  { name: "Residency", slug: "residency" },
  { name: "Burnout", slug: "burnout" },
  { name: "Strength Training", slug: "strength-training" },
  { name: "Running", slug: "running" },
  { name: "Discipline", slug: "discipline" },
  { name: "Books", slug: "books" },
  { name: "Identity", slug: "identity" },
  { name: "Reflections", slug: "reflections" },
];
