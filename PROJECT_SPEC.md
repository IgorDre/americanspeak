# AmeriSpeak — Final Cursor Prompt

# Real American English · Audio-First · Learning System for Immigrants in the USA

---

## Role

You are a Senior Full-Stack Developer building a focused MVP for a solo developer. Prioritize: simplicity, maintainability, zero operational cost, excellent mobile UX.

---

## Who This Is For

Built by an immigrant in the USA who works in IT/QA and uses English daily. This is a personal project — the developer is the primary user and knows the pain points firsthand.

**Primary users:**

- Immigrants living in the USA
- Their families (including children — School English section)
- IT/QA professionals who want to sound natural at work

**Core insight:** This is NOT general English learning. This is **survival + work + natural communication in America.** Every phrase must answer: *"Will an immigrant in the USA hear or need this in real life?"*

---

## What This App Is

A **phrase learning system** inspired by Anki and Duolingo. Audio-first. Learning-focused. Habit-forming.

**The primary user flow:**

1. Discover phrases (Browse / Import)
2. Add phrases to personal learning queue
3. Study phrases with spaced repetition + audio
4. Track progress and retention over time

**This is simultaneously:**

- A spaced repetition learning system (like Anki)
- An audio-first pronunciation trainer
- A real American English communication guide

**NOT:** a static dictionary, a phrase catalog, a content browser.

---

## MVP Scope

### Build in v1:

- Learning queue — add/remove phrases, study with SRS
- Study session — Anki-style flip card, audio-first
- Audio: normal 🔊 · slow 🐢 · repeat ×3 🔁 — on every phrase, meaning, and example
- Browse + search — discovery, secondary to study
- Phrase of the Day on home screen
- Favorites (localStorage)
- Import system — JSON and CSV phrase packs
- Related phrases on detail page (from PhraseRelation table)
- Categories: Everyday, Work, School, Medical, Immigration, QA English, Small Talk, Phone Calls
- Streak counter (localStorage)
- Dark mode default, light mode toggle
- Mobile-first responsive design

### Do NOT build in v1:

- User auth / accounts
- AI generation
- Images
- Community / sharing
- Pronunciation recording / scoring
- Admin panel
- Visual semantic graph (Phase 2)
- PWA (Phase 2)

---

## Tech Stack — FIXED

```
Framework:   Next.js 14+ (App Router)
Language:    TypeScript (strict)
Styling:     Tailwind CSS + shadcn/ui
Animation:   Framer Motion
Database:    PostgreSQL via Prisma ORM
Hosting DB:  Supabase free tier
Deploy:      Vercel free tier
Auth:        NONE in v1 — localStorage for all user state
Audio:       Web Speech API (SpeechSynthesisUtterance, lang: en-US)
SRS:         ts-fsrs npm package (exact FSRS algorithm — do NOT write custom)

```

No Redis. No AI API. No auth. No images. No background workers.

---

## Design System — Duolingo + Anki + Apple

**Feel:** clean, modern, rounded, calm, friendly, minimal **NOT:** corporate, academic, cluttered, neon, gradient-heavy

### Colors (dark mode default):

```css
--bg:       #0a0a0a    /* page background */
--surface:  #141414    /* card background */
--elevated: #1c1c1c    /* buttons, elevated elements */
--border:   #2a2a2a    /* borders */
--text:     #f5f5f5    /* primary text */
--muted:    #737373    /* secondary text */
--accent:   #a78bfa    /* brand purple — primary CTA */
--green:    #4ade80    /* easy / correct / mastered */
--yellow:   #facc15    /* streak / hard */
--red:      #f87171    /* again / due */
--blue:     #60a5fa    /* info / learning state */

```

### Typography:

- Font: `Geist` (all UI) + `Geist Mono` (IPA notation only)
- Phrase term: 22–24px weight 500
- Body/definition: 14–15px weight 400
- Labels/badges: 11–12px
- IPA: 13px Geist Mono, color --muted

### Key rules:

- Border radius: 20px for cards, 999px for pills/buttons
- Minimum tap target: 48px
- Audio buttons: always purple accent, circular, prominent
- Bottom nav: 5 items — Home, Study, Browse, Saved, Stats

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Frequency {
  VERY_COMMON
  COMMON
  OCCASIONAL
  RARE
}

enum Register {
  CASUAL
  NEUTRAL
  FORMAL
}

model Category {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  emoji     String
  sortOrder Int      @default(0)
  phrases   Phrase[]
}

model Phrase {
  id            String    @id @default(cuid())
  term          String    @unique
  type          String    // "phrase" | "idiom" | "phrasal_verb" | "expression" | "word"
  definition    String    @db.Text
  example1      String    @db.Text
  example2      String?   @db.Text
  example3      String?   @db.Text
  pronunciation String    // IPA: /dʒʌst ə hɛdz ʌp/
  register      Register  @default(CASUAL)
  frequency     Frequency @default(COMMON)
  difficulty    Int       @default(2)    // 1–5
  tags          String[]                 // ["meeting", "slack", "office"] for search/filter
  situations    String[]                 // ["office meetings", "Slack messages", "doctor visits"]
  categoryId    String
  createdAt     DateTime  @default(now())
  category      Category  @relation(fields: [categoryId], references: [id])
  relationsFrom PhraseRelation[] @relation("PhraseFrom")
  relationsTo   PhraseRelation[] @relation("PhraseTo")
}

model PhraseRelation {
  id           String @id @default(cuid())
  fromPhraseId String
  toPhraseId   String
  type         String  // "related" | "synonym" | "same_topic" | "commonly_paired"
  strength     Float   @default(1.0)
  fromPhrase   Phrase  @relation("PhraseFrom", fields: [fromPhraseId], references: [id], onDelete: Cascade)
  toPhrase     Phrase  @relation("PhraseTo",   fields: [toPhraseId],   references: [id], onDelete: Cascade)
  @@unique([fromPhraseId, toPhraseId, type])
}

```

**Why** `situations String[]`**:** Immigrants need to know WHEN to use a phrase, not just WHAT it means. `["doctor's office", "insurance call", "urgent care"]` tells you the real-life context. This is unique value that no dictionary app provides.

**Why** `PhraseRelation` **is back:** When studying "circle back", seeing "touch base / follow up / loop me in" is powerful contextual learning. In v1 this shows as a simple related phrases list. Visual graph comes in Phase 2. The data model is ready now.

**Why enums for** `frequency` **and** `register`**:** Prevents typos in seed and import files. Database enforces valid values.

---

## Home Screen — Learning Dashboard (PRIMARY)

The home screen is a **study dashboard**, not a content browser.

```
┌─────────────────────────────────────────┐
│  Good morning 🔥 7-day streak           │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  Today's progress                │   │
│  │  ████████░░░░  8 / 20 due        │   │
│  │  [▶ Continue studying]           │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Learning queue: 47 phrases             │
│  Due now: 8  ·  New: 5  ·  Review: 3   │
│                                         │
│  ─────── Phrase of the Day ──────────   │
│                                         │
│  "just a heads up"                      │
│  /dʒʌst ə hɛdz ʌp/          🔊 🐢 ×3   │
│  I want to warn you about something.   │
│  Used in: office, Slack, everyday talk  │
│                                         │
│  ─────── Quick categories ───────────   │
│  🏠 Everyday  💼 Work  🎒 School ...    │
└─────────────────────────────────────────┘

```

**Home screen priorities:**

1. Study progress today (cards due, continue button)
2. Learning queue summary (queue size, states)
3. Phrase of the Day
4. Quick category shortcuts (Browse is secondary)

---

## Phrase Card Anatomy

```
┌──────────────────────────────────────────┐
│  [phrasal verb]  [casual] [very common]  │  FRONT
│                                          │
│  "circle back"                           │
│  /ˈsɜːrkəl bæk/                          │
│                                          │
│  🔊 Normal   🐢 Slow   🔁 ×3            │
│                                          │
│  ─────────── tap to reveal ──────────    │
│                                          │
│  Meaning:                     🔊         │  BACK
│  To return to a topic or person          │
│  later to follow up.                     │
│                                          │
│  Examples:                               │
│  • "Let's circle back on this     🔊     │
│     after the standup."                  │
│  • "I'll circle back with you     🔊     │
│     once I have the numbers."            │
│                                          │
│  Used in:                                │
│  office meetings · Slack · work email    │
│                                          │
│  Related: touch base · follow up ·       │
│           loop me in · ping you          │
│           [+ Add to queue]               │
│                                          │
│  + Add to queue    ♡ Save                │
│                                          │
│  ─────────── if in queue ─────────────   │
│  Again        Good          Easy         │
└──────────────────────────────────────────┘

```

---

## Learning Queue System

Users control what they study. Phrases are not auto-added.

**Phrase states (stored in localStorage):**

```typescript
type PhraseState = 'new' | 'learning' | 'review' | 'mastered'

type QueueEntry = {
  phraseId: string
  addedAt:  string    // ISO date
  // FSRS fields:
  state:         number  // 0=New 1=Learning 2=Review 3=Relearning
  due:           string  // ISO date
  stability:     number
  difficulty:    number
  reps:          number
  lapses:        number
  elapsedDays:   number
  scheduledDays: number
  lastReview:    string | null
}

```

**Actions:**

- Browse → "Add to queue" button on every card
- Phrase detail → "Add to queue" / "Remove from queue"
- Study session shows only queued phrases that are due
- Home shows queue stats: total / due today / mastered

---

## Audio — Core Feature

```typescript
// lib/speak.ts

type SpeakOptions = {
  rate?:   number   // 0.9 = normal, 0.6 = slow
  repeat?: number   // default 1
}

export async function speakAmerican(text: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const { rate = 0.9, repeat = 1 } = options;

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
      voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))   ||
      voices.find(v => v.lang === 'en-US')
    ) ?? null;
  };

  const voice = getVoice();

  for (let i = 0; i < repeat; i++) {
    await new Promise<void>(resolve => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = 'en-US';
      u.rate  = rate;
      u.pitch = 1.0;
      if (voice) u.voice = voice;
      u.onend = () => resolve();
      window.speechSynthesis.speak(u);
    });
    if (i < repeat - 1) await new Promise(r => setTimeout(r, 400));
  }
}

```

```tsx
// components/AudioButton.tsx — used on every text in the app
'use client';
import { speakAmerican } from '@/lib/speak';
import { useState } from 'react';

interface Props {
  text:    string
  slow?:   boolean
  repeat?: number
  size?:   'sm' | 'md' | 'lg'
  label?:  string
}

export function AudioButton({ text, slow, repeat = 1, size = 'md', label }: Props) {
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    await speakAmerican(text, { rate: slow ? 0.6 : 0.9, repeat });
    setPlaying(false);
  };

  const sz = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';

  return (
    <button
      onClick={play}
      disabled={playing}
      aria-label={`Play: ${text}`}
      className={`
        rounded-full flex items-center justify-center gap-2
        border border-[#3a3a3a] transition-all
        ${playing ? 'bg-[#a78bfa] scale-95' : 'bg-[#1c1c1c] hover:bg-[#a78bfa]'}
        ${label ? 'px-4 h-9' : sz}
      `}
    >
      <span className="text-white text-sm">{playing ? '◼' : '▶'}</span>
      {label && <span className="text-white text-sm font-medium">{label}</span>}
    </button>
  );
}

// Usage:
// <AudioButton text={phrase.term} size="lg" />           — normal
// <AudioButton text={phrase.term} slow label="🐢 Slow" /> — slow
// <AudioButton text={phrase.term} repeat={3} label="🔁 ×3" /> — repeat
// <AudioButton text={phrase.definition} size="sm" />     — on meaning
// <AudioButton text={phrase.example1} size="sm" />       — on each example

```

---

## Import System — Phrase Packs (JSON + CSV)

The developer generates phrase packs externally using ChatGPT or Claude, then imports them directly into the app. This is how the database grows over time.

### JSON format:

```json
{
  "category": "work",
  "phrases": [
    {
      "term": "circle back",
      "type": "phrasal_verb",
      "definition": "To return to a topic or person later to follow up.",
      "example1": "Let's circle back on this after the standup.",
      "example2": "I'll circle back with you once I have the numbers.",
      "pronunciation": "/ˈsɜːrkəl bæk/",
      "register": "CASUAL",
      "frequency": "VERY_COMMON",
      "difficulty": 1,
      "tags": ["meetings", "work", "follow-up"],
      "situations": ["office meetings", "Slack messages", "work email"],
      "relations": [
        { "term": "touch base",  "type": "synonym" },
        { "term": "follow up",   "type": "related"  },
        { "term": "loop me in",  "type": "related"  }
      ]
    }
  ]
}

```

### CSV format (simpler, for quick imports):

```
term,type,definition,example1,pronunciation,register,frequency,difficulty,tags,situations,category
"circle back",phrasal_verb,"To return to a topic later.","Let's circle back after standup.","/ˈsɜːrkəl bæk/",CASUAL,VERY_COMMON,1,"meetings|work","office meetings|Slack",work

```

### Import API route:

```typescript
// app/api/import/route.ts
// POST /api/import
// body: FormData with file (JSON or CSV)
// - validates structure
// - skips duplicates (upsert by term)
// - creates category if not exists
// - creates PhraseRelation entries from relations array
// - returns: { imported: number, skipped: number, errors: string[] }

```

### Import UI:

- Simple page at `/import`
- Drag-and-drop or file picker
- Preview first 5 rows before confirming
- Shows import results: "47 imported, 3 skipped (duplicates)"

---

## SRS — ts-fsrs

```typescript
// lib/srs.ts
import { createEmptyCard, fsrs, generatorParameters, Rating } from 'ts-fsrs';

const f = fsrs(generatorParameters({ enable_fuzz: true }));

export const RATINGS = {
  again: Rating.Again,
  good:  Rating.Good,
  easy:  Rating.Easy,
} as const;

export type RatingKey = keyof typeof RATINGS;

export function scheduleCard(stored: any | null, rating: RatingKey) {
  const card   = stored ?? createEmptyCard();
  const result = f.repeat(card, new Date());
  return result[RATINGS[rating]].card;
}

```

---

## localStorage — All User State

```typescript
// lib/storage.ts

export const STORAGE = {
  queue:     'as_queue',       // Record<phraseId, QueueEntry>
  favorites: 'as_favorites',   // string[]
  streak:    'as_streak',      // { count: number, lastDate: string }
  sessions:  'as_sessions',    // { date: string, studied: number, correct: number }[]
} as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; }
  catch { return fallback; }
}

// Queue
export const queue = {
  getAll: ()                      => get<Record<string, any>>(STORAGE.queue, {}),
  get:    (id: string)            => queue.getAll()[id] ?? null,
  add:    (id: string, card: any) => { const q = queue.getAll(); q[id] = card; localStorage.setItem(STORAGE.queue, JSON.stringify(q)); },
  remove: (id: string)            => { const q = queue.getAll(); delete q[id]; localStorage.setItem(STORAGE.queue, JSON.stringify(q)); },
  has:    (id: string)            => !!queue.get(id),
  getDue: ()                      => {
    const now = new Date();
    return Object.entries(queue.getAll())
      .filter(([, card]) => new Date(card.due) <= now)
      .map(([id]) => id);
  },
};

// Favorites
export const favorites = {
  getAll: ()           => get<string[]>(STORAGE.favorites, []),
  toggle: (id: string) => {
    const favs = favorites.getAll();
    const idx  = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    localStorage.setItem(STORAGE.favorites, JSON.stringify(favs));
    return idx === -1;
  },
  has: (id: string) => favorites.getAll().includes(id),
};

// Streak
export const streak = {
  get: () => get(STORAGE.streak, { count: 0, lastDate: '' }),
  bump: () => {
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const s         = streak.get();
    if (s.lastDate === today) return s.count;
    const count = s.lastDate === yesterday ? s.count + 1 : 1;
    localStorage.setItem(STORAGE.streak, JSON.stringify({ count, lastDate: today }));
    return count;
  },
};

```

---

## API Routes

```
GET  /api/phrases                    ?search=&category=&limit=20&offset=0
GET  /api/phrases/[id]               phrase + relations (includes related phrases)
GET  /api/phrases/phrase-of-day      today's phrase (dayOfYear % total)
GET  /api/phrases/batch?ids=a,b,c    fetch multiple by id (for study session)
GET  /api/categories                 all with phrase counts
POST /api/import                     import JSON or CSV phrase pack

```

### Phrase of the Day:

```typescript
// dayOfYear % phrases.length — safe, even, works after deletes
const phrases = await prisma.phrase.findMany({ orderBy: { createdAt: 'asc' } });
const day     = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
return phrases[day % phrases.length];

```

### Search — searches term + definition + examples + tags:

```typescript
where.OR = [
  { term:       { contains: search, mode: 'insensitive' } },
  { definition: { contains: search, mode: 'insensitive' } },
  { example1:   { contains: search, mode: 'insensitive' } },
  { tags:       { has: search.toLowerCase() } },
];

```

---

## Screens

### Home (`/`) — Study Dashboard

- Today's progress bar + "Continue studying" CTA
- Queue stats: due / new / review / mastered counts
- Phrase of the Day (with full audio row)
- Quick category grid

### Study (`/study`)

- Full-screen flip card (Framer Motion 3D flip)
- Front: term + IPA + 🔊 🐢 ×3 buttons
- Tap to reveal: meaning 🔊 + examples each with 🔊
- "Used in" context tags
- Related phrases (click to add to queue)
- Rating: Again / Good / Easy
- Progress bar: X of Y due today

### Browse (`/browse`)

- Search bar — prominent at top, searches everything
- Category filter pills
- Phrase list: term + type badge + audio button + "Add to queue"
- Tap → phrase detail

### Phrase Detail (`/phrase/[id]`)

- Full phrase card with all audio buttons
- "Used in" situations
- Related phrases list (from PhraseRelation) with "+ Add to queue"
- Add to queue / Remove from queue toggle
- Add to Favorites toggle

### Saved (`/saved`)

- Favorited phrases list

### Stats (`/stats`)

- Streak heatmap (GitHub-style)
- Cards studied today / week
- Queue breakdown by state (new / learning / review / mastered)
- Accuracy rate

### Import (`/import`)

- Drag-and-drop JSON or CSV
- Preview table
- Import button + results

---

## Folder Structure

```
/
├── app/
│   ├── page.tsx                       ← Home / Study Dashboard
│   ├── study/page.tsx                 ← Study session
│   ├── browse/page.tsx                ← Browse + search
│   ├── phrase/[id]/page.tsx           ← Phrase detail
│   ├── saved/page.tsx
│   ├── stats/page.tsx
│   ├── import/page.tsx                ← Phrase pack import
│   └── api/
│       ├── phrases/route.ts
│       ├── phrases/[id]/route.ts
│       ├── phrases/phrase-of-day/route.ts
│       ├── phrases/batch/route.ts
│       ├── categories/route.ts
│       └── import/route.ts
├── components/
│   ├── AudioButton.tsx                ← 🔊 used everywhere
│   ├── FlashCard.tsx                  ← study flip card
│   ├── PhraseCard.tsx                 ← browse list card
│   ├── PhraseOfDay.tsx
│   ├── RatingButtons.tsx              ← Again / Good / Easy
│   ├── QueueButton.tsx                ← Add/Remove from queue
│   ├── RelatedPhrases.tsx             ← list from PhraseRelation
│   ├── CategoryGrid.tsx
│   ├── SearchBar.tsx
│   ├── StreakBadge.tsx
│   ├── StudyProgress.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── db.ts                          ← Prisma singleton
│   ├── speak.ts                       ← Web Speech API
│   ├── srs.ts                         ← ts-fsrs wrapper
│   └── storage.ts                     ← all localStorage (queue, favorites, streak)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                        ← 400–500 phrases
├── docker-compose.yml
└── .env.example

```

---

## Seed — 400–500 Phrases

**One strict rule for every entry:**

> "Would an immigrant in the USA hear or need this phrase in real daily life?"

Content rules:

```
❌ "She leveraged synergistic methodologies."
✅ "She really killed it in that presentation."

❌ "I will return to this matter at a future time."
✅ "I'll circle back on this."

❌ "Please be advised of potential traffic congestion."
✅ "Just a heads up — traffic is brutal today."

```

Categories and counts:

```
Everyday Life   80 — sounds good, my bad, I got you, no worries, hang tight...
Work & Office   70 — I'll ping you, circle back, loop me in, I'm blocked...
School English  60 — field trip, report card, parent-teacher conf, drop-off...
Medical         50 — co-pay, deductible, in-network, make an appointment...
US Life         50 — DMV, credit score, routing number, HOA fees, FICO...
QA English      40 — can't repro, CI is red, flaky test, edge case, happy path...
Small Talk      50 — how's it going, not too bad, long time no see...
Phone Calls     40 — you're on mute, I'll call you back, can you hear me...

```

Each phrase includes:

- `situations` — 2–3 real-life contexts where it's used
- `relations` — 2–4 related phrases
- `tags` — 3–5 searchable keywords

---

## Build Order

```
1.  docker-compose up → postgres running
2.  Prisma schema → npx prisma migrate dev
3.  Seed 20 phrases (a few per category) → verify structure
4.  AudioButton → TEST American English voice immediately ← DO THIS FIRST
5.  GET /api/phrases + GET /api/categories
6.  PhraseCard (term + IPA + audio button)
7.  Browse page (list + category pills + search bar)
8.  Phrase detail (all audio: term + slow + ×3 + meaning + examples)
9.  Related phrases section on detail page
10. Add to queue / Remove from queue (QueueButton + storage.ts)
11. Phrase of the Day on home screen
12. Favorites (toggleFavorite + Saved page)
13. Home study dashboard (queue stats + due count + continue CTA)
14. Study session (FlashCard 3D flip)
15. FSRS rating buttons + localStorage progress
16. Streak counter (bump on study session end)
17. Import page (JSON + CSV)
18. Stats page
19. Full seed — expand to 400+ phrases
20. Polish: animations, light mode toggle, spacing

```

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
NEXT_PUBLIC_APP_NAME=AmeriSpeak

```

Two variables. No AI keys. No auth secrets.

---

## Docker (local dev only)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: amerispeak
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:

```

---

## Getting Started

```bash
npx create-next-app@latest amerispeak --typescript --tailwind --app --eslint
cd amerispeak
npm install prisma @prisma/client ts-fsrs framer-motion papaparse @types/papaparse
npx shadcn-ui@latest init
npx prisma init
# paste schema → npx prisma migrate dev --name init
# paste seed   → npx ts-node prisma/seed.ts
docker-compose up -d
npm run dev

```

---

## Future Phases

```
Phase 2: PWA — installable on phone, offline study
Phase 3: User auth (Auth.js) — sync queue + progress to DB across devices
Phase 4: Visual semantic graph — explore related phrase clusters
Phase 5: BYOK AI generation — user's own API key, client-side only, zero server cost
Phase 6: Speech recognition — record and compare pronunciation

```

---

## PWA — Required in v1

This app must be installable as a Progressive Web App on iOS and Android.

**Why v1, not later:** This is a habit-based daily learning app. Users open Anki and Duolingo from their home screen, not from a browser. Without PWA, the habit doesn't form.

### Requirements:

- Installable on iOS and Android home screen
- Standalone mode — no browser address bar
- App icon + splash screen
- Offline caching for static assets (JS, CSS, fonts)
- Offline access to previously loaded phrases and study sessions
- Feels like a lightweight native app

### Implementation:

```bash
npm install next-pwa

```

```typescript
// next.config.ts
import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
  ],
});

export default config({ /* your existing next config */ });

```

```json
// public/manifest.json
{
  "name": "AmeriSpeak",
  "short_name": "AmeriSpeak",
  "description": "Real American English for daily life",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#a78bfa",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}

```

```tsx
// app/layout.tsx — add these meta tags for iOS
export const metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AmeriSpeak',
  },
  themeColor: '#a78bfa',
};

// Also add to <head>:
// <link rel="apple-touch-icon" href="/icons/icon-192.png" />

```

### Offline strategy:

- Static assets (JS, CSS, fonts) → CacheFirst — always fast
- API routes (`/api/phrases`, `/api/categories`) → NetworkFirst with 24h cache
- Study session works offline using localStorage queue + cached phrase data
- If offline and phrase not cached → show "Available when online" gracefully

### Install prompt:

Add a subtle "Install App" banner on first visit (dismissable, never shown again after dismiss):

```typescript
// hooks/useInstallPrompt.ts
// Listens for beforeinstallprompt event
// Shows banner: "Add AmeriSpeak to your home screen for daily practice"
// [Install] [Not now]
// Stores dismissal in localStorage so it never shows again

```

### Updated Getting Started:

```bash
npm install next-pwa
# generate icons: create icon-192.png and icon-512.png (purple #a78bfa background, white letter A)
# place in /public/icons/

```

### Updated Build Order — insert after step 20:

```
21. Add next-pwa + manifest.json
22. Generate app icons (192px + 512px)
23. Test "Add to Home Screen" on iOS Safari and Android Chrome
24. Verify offline study works (airplane mode test)

```

