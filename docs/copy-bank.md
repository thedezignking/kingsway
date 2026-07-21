# Kingsway — Copy Bank (extracted from the Blueprint drafts)

Source: [KINGSWAY drafts.md](./KINGSWAY%20drafts.md) (Blueprint v1.0). This is the copy that
**actually exists** in the drafts, pulled out and organized by surface so we can wire it into the
build. It is the raw material for on-screen strings — not yet final. Author/refine in Kingsway's
voice before shipping (per PRD §4.2 / §35 Copywriting).

**Status key:** ✅ usable draft · ⚠️ example/illustrative (the drafts flag it as a sample, don't ship verbatim) · ❌ not written yet (TBD).

**Two flags to resolve first (drafts vs. refined PRD):**
1. **Audience wording.** Draft positioning copy says *"ambitious young adults."* The refined PRD
   narrows the audience to **"builders."** Re-point all positioning/landing copy to *builders*
   before use.
2. **Census chapter names.** Draft titles (below) differ from the PRD/`questions.ts` names. Pick one
   set. Draft: *Let's Get to Know You / Where You Are Today / Where You're Going / Your Challenges /
   Kingsway / Welcome Home.* Code (`lib/census/questions.ts`): *About You / Your Current Reality /
   Your Future / Growth / Kingsway / Welcome Home.*

---

## 1. Positioning & pitch (Landing raw material) — §3

- ✅ **One sentence:** "Kingsway is a growth community that helps ambitious young adults build
  meaningful lives through practical conversations, consistent accountability, and genuine community."
- ✅ **Short:** "Kingsway is where ambitious young adults come together every month to gain clarity,
  grow in character, and take practical steps toward the lives they're trying to build."
- ✅ **Positioning statement:** "For ambitious young adults seeking clarity and meaningful growth,
  Kingsway is a community that combines practical guidance, thoughtful accountability, and genuine
  relationships. Unlike traditional online communities that optimize for activity and engagement,
  Kingsway optimizes for trust, consistency, and transformation."
- ✅ **Long version** available in drafts §3 (problem → response framing). Good source for the
  "Why Kingsway Exists" section.
- ⚠️ Adjust all of the above from *"ambitious young adults"* → *"builders"* (see flag #1).

### Landing sections
- **Hero headline / supporting copy** — ❌ not written. (Answers "what is this / who's it for.")
- **FAQ questions** — ✅ (questions only; answers ❌ TBD): "Is Kingsway free?" · "Who is it for?" ·
  "What happens after I join?" · "What is KingsHour?" · "Why is there no WhatsApp group?"
- **Why Builders Join** outcomes — ✅ list: Clarity · Accountability · Perspective · Meaningful
  conversations · Consistency.
- **Final CTA / primary button** — ✅ "Become a King."

---

## 2. King's Census

### Chapter headers (draft) — lines 4876–4954
| Ch | Title (draft) | Emoji | Est. time | Progress shown |
|----|---------------|-------|-----------|----------------|
| 1 | Let's Get to Know You | 👋 | ~30s | 14% |
| 2 | Where You Are Today | 🌱 | ~45s | 29% |
| 3 | Where You're Going | 🎯 | ~45s | 43% |
| 4 | Your Challenges | 🧠 | ~1 min | 57% |
| 5 | Kingsway | 👑 | ~45s | 71% |
| 6 | Welcome Home | ✨ | ~30s | — |

- ✅ **Progress framing rule:** never "Question 12 of 41" → always **"Chapter 3 of 6."**
- ✅ **Progress celebration (identity framing):** "👑 You're becoming a King. — 72% Complete."

### Chapter intro / encouragement & nudges — ⚠️ examples, lines 4974–4999
- Opening tone: "We're simply getting to know you." / "A few more questions so we can serve you better."
- **Halfway nudge:** "You're doing great. This helps us build Kingsway around real people — not
  assumptions."
- **Near-end nudge:** "Just a few more taps and you're officially a King. 👑"

### Question wording — mostly ⚠️ examples
- `season`: "Where are you in life today?" → Student / Founder / Freelancer / Creator / Employee
  (+ "Something else" per PRD).
- `confidence`: "How confident are you?" with a slider 😟────────🙂.
- `topics`: chip helper "Choose up to 5" — Faith / Business / Money / Career / Leadership /
  Discipline / Purpose / Health / Relationships.
- **Ordering principle:** ✅ easy questions first (name, age, country, occupation), harder ones later
  (income, goals, fears) once the builder has invested 2–3 minutes.
- Most other question strings — ❌ TBD (the canonical *behavior/options* live in
  [lib/census/questions.ts](../lib/census/questions.ts); wording is authored separately).

### Income options — ✅ verbatim (already in `questions.ts`)
- **Current monthly income:** No income yet · Under $100 · $100–300 · $300–700 · $700–1,500 ·
  $1,500–3,000 · $3,000+.
- **Desired monthly income (12 months):** First $100 · $100–300 · $300–700 · $700–1,500 ·
  $1,500–3,000 · $3,000–5,000 · $5,000+ (framed positively).

### Ending (Chapter 6 — Welcome Home) — ✅ lines 5134–5148
- Never "Form Submitted." Instead:
  > **Welcome to Kingsway.** You're officially a King. We'll see you at KingsHour.
- (Welcome email confirmation + add-to-calendar copy — ❌ TBD.)

---

## 3. Welcome Experience — §25
- ❌ No verbatim copy in drafts. Must communicate the five items (you're a King · what KingsHour is +
  next date · how email works · why WhatsApp Status + save founder's number · what to expect). The
  census ending line above is the tonal anchor.

---

## 4. Email templates — §26
- ❌ No verbatim body copy in drafts. Categories + intent only (Welcome · KingsHour Invitation ·
  Reminder · Follow-Up · Community Update). Tone: "a thoughtful letter, not a marketing campaign";
  every email ends with **one clear next step**. All bodies TBD.

---

## 5. WhatsApp Status — §27 + "Status Strategy" (lines 5290–5327)
- ✅ **Weekly cadence (founder's Status):** Mon = something you're building · Tue = a lesson from a
  book/conversation · Wed = an opportunity (internship/scholarship/tool) · Thu = behind-the-scenes ·
  Fri = a reflection or question · Sat = KingsHour reminder (when relevant) · Sun = KingsHour or a
  takeaway.
- ✅ Framing line: "Your status becomes your **window**, not a chat room."

---

## 6. Admin dashboard — §29 + "Rough Ideas" (lines 4506–4804)
- ✅ **Admin voice:** "Not pretty. Useful." Six pages: Overview · Kings · Insights · KingsHour ·
  Email · Analytics.
- ✅ **Dashboard question:** "What needs my attention today?"
- ✅ **Overview stat labels** (example values in parens): Total Kings (1,248) · Joined This Week (38) ·
  Next KingsHour (28 Days Away) · Attendance Rate (74%) · Most Requested Topic · Most Common Goal
  (Start a Business) · Average Age (22).
- ✅ **"Kingsway Today" morning brief** (10-second health read):
  > 👑 Total Kings · 🌍 Countries · 📈 joined this week · 🎯 Top goal · 💭 Biggest struggle ·
  > ⏳ days until KingsHour · 📬 % opened the last email.
- ✅ **Insights page question:** "What do our people need right now?" — ranked Top struggles / Top
  goals / Fastest-growing country / Most active age.
- ✅ **Email audience segments (checklist):** Everyone · Students · Founders · Nigeria · Ghana ·
  Interested in Business · Joined this Month · Didn't Attend Last Meeting · Custom.
- ✅ **Session example:** "KingsHour #08 — The Hidden Cost of Comparison — 29 August — Status: Upcoming."

---

## 7. Topic Bank — ✅ REAL titles, lines 5182–5253
**This replaces the placeholder titles in `supabase/seed/topics.sql`.** 7 pillars × 5 = 35 topics.

**Foundation**
1. How to stop drifting through your twenties
2. Discipline when nobody is watching
3. Becoming someone you can trust
4. Building your life one habit at a time
5. The hidden cost of comfort

**Career & Skills**
1. Choosing the right skill in an AI-first world
2. How to get your first paying client
3. Building leverage instead of chasing jobs
4. Learning without getting overwhelmed
5. Becoming genuinely valuable

**Money**
1. Your first $100/month
2. Escaping survival mode
3. Budgeting when your income is inconsistent
4. Why smart people stay broke
5. Building financial confidence before financial freedom

**Business**
1. Should you start a business now?
2. The myth of multiple income streams
3. Solving real problems
4. Building before branding
5. What people actually pay for

**Faith & Character**
1. Ambition without losing yourself
2. Faith in uncertain seasons
3. Integrity when no one is watching
4. Humility and confidence
5. Becoming before achieving

**Relationships**
1. Choosing friends wisely
2. Building a healthy support system
3. Dating while building your future
4. Learning to communicate honestly
5. Boundaries that protect your growth

**Mindset**
1. Comparison is stealing your life
2. Dealing with self-doubt
3. What to do when you're behind
4. Building confidence through action
5. The courage to start again

> Also referenced as a live session title elsewhere in the drafts: **"The Hidden Cost of Comparison"**
> (KingsHour #08) — close to Mindset #1; reconcile when finalizing.

---

## 8. Lead magnets (future / not V1) — lines 5256–5287
- **The King's Blueprint** — "A practical guide to building your next 12 months with intention."
- **The King's Reset** — "A 7-day reset for clarity, discipline, and momentum."
- **The King's Compass** — "Find the area of your life that needs your attention most."
- **25 Mistakes I Made in My Early Twenties**
- **The AI Starter Guide for Young Builders**

---

## 9. The Kingsway Rhythm (cadence framing) — lines 5316–5327
- **Daily** → WhatsApp Status · **Monthly** → KingsHour · **Quarterly** → King's Check-In ·
  **Yearly** → reflection + King's Census refresh. (Quarterly/Yearly are backlog.)

---

## Gaps still to write (❌)
Hero headline · full FAQ answers · per-question census wording · all chapter intro statements (final) ·
the 3–4 micro-acknowledgment lines · Welcome Experience copy · all five email bodies · admin
empty-state / confirmation strings.
