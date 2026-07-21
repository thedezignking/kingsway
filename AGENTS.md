# AGENTS.md — Kingsway build guide

Guidance for Codex (and any AI agent) working in this repo. **Keep this file
updated as work progresses** — it is the running source of truth for what's done, what's
next, and the decisions that shaped the build. Update the "Build progress" and "Decision log"
sections at the end of every working session.

> Full product spec: [kingsway-prd-v1.md](./kingsway-prd-v1.md). **Read PRD §0 first** — it is
> the context that makes every later decision make sense.
>
> **Source of truth = the PRD, always.** During the build, follow the PRD only. The blueprint drafts
> ([docs/KINGSWAY drafts.md](./docs/KINGSWAY%20drafts.md)) and the [copy bank](./docs/copy-bank.md)
> extracted from them are **reference only** — do not pull from them unless Divine explicitly asks.
> Where drafts and PRD conflict, the PRD wins.

---

## What Kingsway is (the 30-second version)

A monthly growth community for **builders**. Members are **Kings**; the one recurring event is
**KingsHour** (monthly, last Sunday, on Google Meet). Every feature exists to get Kings to
KingsHour and keep them coming back. It is deliberately **not** a social network, feed, forum,
course platform, or productivity app.

**The one principle that resolves most arguments:** optimize for **trust, not engagement**. If a
feature would raise engagement while lowering trust, reject it. This is why there are no feeds,
streaks, badges, or notification loops.

**V1 has no member accounts.** Kings never log in. Auth exists **only for admins**. Membership is
**free**. Kings interact via the public census, email, WhatsApp Status, and Google Meet.

## Non-negotiables (do not violate without explicit sign-off)

- **Fixed terminology, never alternate:** *King* (not "member"/"user"), *King's Census* (not
  "survey"/"form"/"registration"), *KingsHour* (not "meeting"/"webinar").
- **Two voices, kept separate:**
  - *Member-facing* (landing, census, welcome, emails): warm, calm, thoughtful — "a mentor and a
    trusted friend." Never hype, corporate, or guru. Speaker is **Kingsway, "we."**
  - *Admin-facing* (dashboard): plain, fast, operational — "not pretty, useful." No warmth, no
    celebration. Neutral/utility voice.
- **Never build (permanent):** infinite feeds, public timelines, forums, leaderboards, like/popularity
  counts, notification spam, streaks, gamification, clickbait reminders, engagement loops.
- **Copy is authored separately** in Kingsway's voice. Code carries *structure and behavior*; do not
  ship the PRD's descriptive phrasings or the scaffold's placeholder strings as final on-screen text.
- **The census is "an experience, not a form."** Restraint is the discipline: auto-advance on
  single-selects, chapter intros, a *capped* 3–4 micro-acknowledgments total (never every answer),
  and an emotional ending (Peak-End) — plus zero friction everywhere else. Fast, not chatty.

---

## Stack & conventions

- **Next.js 14 (App Router) + TypeScript + Tailwind** · **Supabase** (Postgres, admin auth) ·
  **Resend** (transactional email, open tracking, `.ics`) · Vercel-ready · **zero-cost tier**.
- **Google Meet links are created manually and pasted into sessions** — no Meet integration.
- **API-first & modular.** Business logic lives in `lib/modules/*`; route handlers (`app/api/*`) and
  RSC pages stay thin and call into modules, so future surfaces (mobile) reuse the backend.
- **One canonical source for census questions:** [lib/census/questions.ts](./lib/census/questions.ts).
  Never duplicate the question list; the engine and admin both read from it. It is **versioned**
  (`CENSUS_VERSION`) so the census can evolve without breaking stored history.
- **Env is guarded, not required to build:** helpers in [lib/env.ts](./lib/env.ts) throw only when a
  feature actually runs. The skeleton builds and renders with no keys.
- Package manager: **npm**. `_`-prefixed params are intentionally-unused (ESLint is configured to
  allow them).

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # typecheck + lint + prerender (use this to verify a change end-to-end)
npm run lint
```

Apply DB schema (needs a Supabase/Postgres target — no CLI is installed locally yet):
```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
# After a Supabase project exists, regenerate types:
# npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
```
The `topics` table starts empty — topics are admin-entered (no seed). Candidate ideas are kept in
[docs/copy-bank.md](./docs/copy-bank.md) as reference, not committed data.

## Map of the codebase

```
app/
  (public)/   Landing (/) · Census (/census) · Welcome (/welcome) · RSVP (/rsvp/[sessionId])
  admin/      layout (auth shell) · Overview · Kings(+[id]) · Insights · KingsHour(+[id]) · Email · Analytics
  api/        census · rsvp/[sessionId] · admin/email · admin/sessions   (thin; logic in lib/modules)
components/   landing/ · census/ · admin/ · shared/    (currently placeholder stubs)
lib/
  census/     questions.ts (CANONICAL bank) · types.ts
  supabase/   client (browser) · server (RSC + service role) · types
  email/      resend · ics · templates/{welcome,invitation,reminder,followUp,update}
  analytics/  events.ts (typed event names + track())
  modules/    auth · census · members · kingshour · communication · analytics   (service layers)
  env.ts
supabase/
  migrations/0001_init.sql   (topics table starts empty — admin-entered, no seed)
```

**Data model** (see PRD §6 + [lib/supabase/types.ts](./lib/supabase/types.ts)): one **Member** = one
record; everything links to it. Member 1→N CensusResponses / Registrations / Communications.
Session N→1 Topic; Session 1→N Registrations.

---

## Build order (PRD §7) — the roadmap

1. **DB schema + Supabase + seed Topic Bank + canonical census questions** — ✅ done (scaffold).
2. **King's Census engine** + response storage + resumability — *the core asset.* ← **NEXT**
3. **Welcome Experience + Welcome Email automation** (first end-to-end loop).
4. **Landing Page** + analytics events (opens the funnel).
5. **Admin:** auth, Overview, Kings.
6. **KingsHour:** sessions, RSVP, attendance + the three lifecycle emails.
7. **Email page** (segmented sends) + Insights + Analytics.

## How to update this file

**Commit rule (active once we start committing to GitHub):** every commit must include an updated
AGENTS.md, refreshed *in the same commit* to reflect that commit's work. This is the auto-update
mechanism — do not commit code changes without also updating this file. Before running `git commit`:
- **Build progress** — move items between Done / In progress / Next; add dated notes for anything
  non-obvious (workarounds, gotchas, why a decision was made).
- **Decision log** — append any resolved open question or new constraint, with the date.
- **Last updated** — bump the date under "Build progress".

Until we begin committing to GitHub, update this file at the end of each working session instead.

---

## Build progress

_Last updated: 2026-07-21_

**Done**
- **Welcome email revision (2026-07-21):** sender identity is `Divine from Kingsway`; redesigned
  as an email-client-safe Brass & Ink personal letter with first-name subject/personalization,
  porcelain canvas, restrained cadence header, one brass pill CTA, and a plain-text alternative.
  Production links resolve from the configured public app URL, falling back to Vercel's production
  host rather than leaking localhost. Resend response errors are now surfaced in server logs.
- **GitHub connected** — project is its own git repo (isolated from the home `velora-atelier` repo),
  pushed to `github.com/thedezignking/kingsway`. Live **Supabase + Resend keys live in `.env.local`**
  (gitignored); `.env.example` is a secret-free template. `NEXT_PUBLIC_FOUNDER_WHATSAPP` is a wa.link
  URL — [lib/whatsapp.ts](./lib/whatsapp.ts) now handles URL-or-number (`whatsappLink`/`whatsappDisplay`/
  `whatsappConfigured`). Founder socials (Substack/X) wired via env → footer.
- **Design revision 2 (Divine):** buttons are now **full pills** with the **glow removed** (dropped
  `shadow-brass`) and **no → arrows**; nav "Become a King" is a real **pill button**, not a text
  link. **Dark mode removed — light only** (`darkMode: "class"` + `color-scheme: light only`). Landing
  **footer** added ([Footer](./components/shared/Footer.tsx), wordmark + tagline + configured-only
  socials + Privacy/Terms placeholder routes). **Motion pass:** scroll-reveal on landing sections
  ([Reveal](./components/shared/Reveal.tsx), one-shot IntersectionObserver, `<noscript>` fallback so
  content never stays hidden) + hover lifts on buttons/cards/chips. Welcome KingsHour CTA toned down to
  a calm inline pill.
- Scaffold: Next.js 14 + TS + Tailwind app; full route + component skeleton (typed placeholder stubs).
- DB schema [supabase/migrations/0001_init.sql](./supabase/migrations/0001_init.sql) — all §6 entities,
  enums, indexes, and RLS enabled. Applied to live Supabase; Census submissions persist successfully.
- Canonical census bank [lib/census/questions.ts](./lib/census/questions.ts) — **18 questions** after
  the UX pass (cut `success_definition`, `overwhelm`, `whatsapp_optin`; name is one field; `country`
  + `state_city` merged into one composite `location` screen).
- Copy bank extracted from the blueprint drafts → [docs/copy-bank.md](./docs/copy-bank.md) (landing,
  census, admin, WhatsApp, Topic Bank ideas, lead magnets). Two conflicts flagged there to resolve:
  audience wording ("ambitious young adults" vs "builders") and census chapter names (drafts vs code).
- Topic Bank: **no seed.** `topics` table starts empty; the founder enters topics himself and edits
  later. The ~35 candidate titles are kept as ideas in the copy bank, not committed data.
- **Full acquisition-to-welcome loop — BUILT & verified** (build order steps 2–5, member-facing side):
  - **Landing** ([app/(public)/page.tsx](<./app/(public)/page.tsx>)) — real sections (Hero…FinalCTA),
    first-pass "builders"-voice copy, single CTA into the census.
  - **King's Census engine** ([components/census/CensusEngine.tsx](./components/census/CensusEngine.tsx))
    — one question/screen, chapter-level progress, auto-advance on single-selects, chapter intros,
    capped micro-acknowledgments (season / ambitious income_desired / obstacles), mid+near-end nudges,
    name reuse, localStorage resume, gentle validation, emotional celebration + add-to-calendar `.ics`.
    Logic split: [lib/census/copy.ts](./lib/census/copy.ts) (strings), `sequence.ts` (flow+validation),
    `storage.ts` (resume). All input variants real in [QuestionScreen](./components/census/QuestionScreen.tsx).
  - **Server**: [lib/modules/census](./lib/modules/census/index.ts) `saveCensus`/`completeCensus`
    (member upsert by unique email → responses → progress → promote to King → `sendWelcome`);
    [communication.sendWelcome](./lib/modules/communication/index.ts) (Resend + logs to timeline);
    [app/api/census/route.ts](./app/api/census/route.ts) POST=save / PATCH=complete.
  - **Welcome** ([WelcomeExperience](./components/welcome/WelcomeExperience.tsx)) — 5 items, next
    KingsHour (last-Sunday math in [lib/kingshour/schedule.ts](./lib/kingshour/schedule.ts)), add-to-calendar.
  - **Admin reads**: Kings list + search, member profile (census responses + comms timeline), Insights
    (aggregates obstacles/topics/need_most/country/age), Overview stats — all real from Supabase with a
    graceful "not configured" state when keys are absent.
- Verified in-browser (dev server): landing → census (intro→questions→chapters→celebration) →
  completion fired **PATCH /api/census** → Welcome greets by name; admin shows graceful no-keys state;
  API returns `{persisted:false}` (not a crash) without keys; **no console errors**. `npm run build`
  compiles + lints clean; 16 routes.
- Toolchain notes: added `server-only` dep (guards server modules); `tsconfig` target set to ES2017
  (Map iteration); new env var `NEXT_PUBLIC_FOUNDER_WHATSAPP`.
- **Census UX pass (Divine's review) — BUILT & verified in-browser:** country is now a **searchable
  select** ([CountrySelect](./components/census/inputs/CountrySelect.tsx)) over
  [lib/geo/countries.ts](./lib/geo/countries.ts); **phone has a dial-code prefix** seeded from the
  chosen country ([PhoneInput](./components/census/inputs/PhoneInput.tsx), stores E.164); **sample
  placeholders** on text fields; the boring confidence slider is now a **tap-one segmented scale**
  ([ScaleInput](./components/census/inputs/ScaleInput.tsx)); **chapter intros rewritten** as tone-setters
  (name used once, sparingly); **first + last name** (last optional) with greetings using the **first
  token only**; **how_found** options reworked (Divine invited me / shared / WhatsApp Status / …);
  celebration + welcome now show a **"Connect on WhatsApp"** action → `wa.me` ([lib/whatsapp.ts](./lib/whatsapp.ts)).
  Fixed a **stale-closure bug** in auto-advance (an `answersRef` so the ~160ms auto-advance reads the
  just-picked value).
- **Census UX pass 2 (Divine):** name is a **single "What should we call you?" field** (no last-name
  screen; greetings extract the first token). Country + state/city merged into **one `location` screen**
  ([LocationSelect](./components/census/inputs/LocationSelect.tsx)) — pick country, the state field
  appears under it; stored as `{ country, state_city }` (member mapping + admin profile handle the
  composite). The state field is a **dependent dropdown** of that country's subdivisions when known
  ([lib/geo/states.ts](./lib/geo/states.ts)), else a free-text fallback; the label follows the country
  (state/region/county/province/governorate/emirate). Coverage: **~38 countries** — most of Africa
  (Nigeria, Ghana, Kenya, South Africa, Cameroon, Egypt, Ethiopia, Tanzania, Uganda, Rwanda, Zimbabwe,
  Zambia, Botswana, Namibia, Malawi, Senegal, Côte d'Ivoire, Angola, Mozambique, Morocco, Tunisia,
  Niger, Mali, Burkina Faso, DRC) + popular global (US, Canada, India, UK, Australia, Germany, France,
  Brazil, Mexico, UAE, Pakistan, Saudi Arabia, Philippines). Keys must match `countries.ts` names;
  adding more is a one-line edit. Verified in-browser (Cameroon 10 regions; Egypt 27 governorates;
  France 18 regions; UAE 7 emirates; unlisted country falls back to text).
  NOTE: run `npm run dev` and `npm run build` against separate `.next` state — a production build
  reused by the dev server causes spurious whole-document hydration warnings (wipe `.next` if seen).

- **Welcome email identity + brand line (2026-07-21):** sender is now consistently
  `Divine from Kingsway <hello@thedezignking.com>` with replies routed to
  `learn@thedezignking.com`. The sentence uses **“the King’s way” in the normal body face** (brass
  retained; serif/italic emphasis removed). Canonical line lives in [lib/brand.ts](./lib/brand.ts):
  `Do it the King’s way.` / display lockup `DO IT THE KING’S WAY`; used with restraint in the email
  footer, site footer, and census ending. Email design and tracking settings were otherwise left
  unchanged. Gmail category placement remains recipient-controlled; the established `hello@`
  identity is the deliverability improvement, not a visual redesign.
- **Admin access control + Operations Desk UI — BUILT (2026-07-21):** `/admin` dashboard routes now
  live inside a server-protected route group. Supabase Auth verifies the request; protected
  `app_metadata` explicitly grants an active role; **TOTP AAL2 is mandatory** before any dashboard
  or `/api/admin/*` access. Login is passwordless (one-time email link), with callback, first-use MFA
  enrollment, returning-session MFA verification, sign-out, safe internal redirects, no public
  signup, `noindex`, and independent 401/403 API checks. First live Super Admin provisioned:
  `divineukanwa@gmail.com`. Role matrix remains extensible. Admin visual direction is deliberately
  operational: Hanken interface + IBM Plex Mono utility labels, precise left rail, warm neutral
  surfaces, brass only for state/focus; no member-facing serif, crown, Cadence, or celebration.
  Verified: `npx tsc --noEmit`; production `npm run build` (23 routes); anonymous `/admin` → 307
  `/admin/login`, login → 200, anonymous admin API → 401. **Supabase Auth URL config is live:** Site
  URL = `https://kingsway-steel.vercel.app`; redirect allow-list includes the production and localhost
  `/admin/auth/callback` routes. Applied through the Management API after the dashboard save endpoint
  returned 500; the temporary personal access token was revoked immediately after verification.

- **Visual design system — "Brass & Ink" (frontend-design pass), BUILT & verified in-browser.**
  Distinctive identity for the member-facing surfaces, inspired by Wise/Linear/Notion but its own:
  warm porcelain + deep royal indigo-ink + a single **brass** jewel (crown, primary CTA, focus,
  completion). Type: **Fraunces** (display), **Hanken Grotesk** (body), **IBM Plex Mono** (labels/
  dates) via `next/font/google`. Tokens are semantic CSS vars in [globals.css](./app/globals.css) +
  [tailwind.config.ts](./tailwind.config.ts) (`surface/fg/muted/line/ink/bone/brass`), light + dark.
  Signature = **"The Cadence"** ([components/shared/Cadence.tsx](./components/shared/Cadence.tsx)):
  the month's rhythm with the last Sunday (next KingsHour) lit in brass — the product's heartbeat,
  echoed as the census progress (a crown rides the brass track). Restyled: landing (Hero+Cadence,
  Problem, HowItWorks, Outcomes, FAQ, FinalCTA), census (ChapterShell, QuestionScreen chips/inputs,
  ChapterIntro, Interstitial, Celebration crown-rise, Ack toast), welcome. Admin kept **utilitarian**
  (tokens only, mono nav — no member flourish, per PRD §5). Verified light-mode in-browser across
  landing → census (chips/progress/celebration) → welcome; `npm run build` clean, no console errors.
  ⚠️ Tailwind **theme/config changes need a dev-server restart** (HMR doesn't reload the theme —
  utilities silently no-op until restart).
- **Design revision 2 (Divine):** buttons are now **full pills** with the **glow removed** (dropped
  `shadow-brass`) and **no → arrows**; nav "Become a King" is a real **pill button** (ink), not a text
  link. **Dark mode removed — light only** (`darkMode: "class"` never added + `color-scheme: light only`;
  stays light even under OS-dark). Welcome KingsHour CTA toned down to a small inline pill (was a
  shouty full-width glowing block). **Motion added**: scroll-reveal on landing sections
  ([components/shared/Reveal.tsx](./components/shared/Reveal.tsx), IntersectionObserver, one-shot,
  reduced-motion + `<noscript>` fallbacks so content is never stuck hidden) + hover lifts on
  buttons/cards/chips. Verified in-browser.

**In progress**
- (nothing active)

**Next**
- Build order step 6 — the **KingsHour loop**: session entity + admin CRUD, one-click RSVP
  (`/rsvp/[sessionId]`), attendance marking, and the three lifecycle emails (Invitation/Reminder/
  Follow-Up, with `.ics`). Since there's no Topic Bank seed or management UI in V1, include a minimal
  inline "add a topic" in the session-creation flow so topics can be created on the fly.
- Build order step 7 — **Email page** (segmented sends), plus finishing **Analytics** (funnel + charts).
- After the pushed build deploys, use `/admin/login` once to complete the Super Admin authenticator
  enrollment. Also verify one fresh live Census submission in Gmail with the new `hello@` sender and
  `learn@` Reply-To; inbox category cannot be forced by application code.

**Known gaps / cautions**
- No `psql`/`supabase` CLI is installed locally; schema changes are currently applied through the
  Supabase dashboard.
- Census copy in [lib/census/copy.ts](./lib/census/copy.ts) + landing/email strings are **first-pass**,
  on-voice but not final — refine without touching the engine.
- Design: dark-mode ink blocks (FinalCTA, HowItWorks last card) sit only slightly
  darker than the dark surface — acceptable, could add a hairline for more definition. `next/font/
  google` (Fraunces/Hanken/IBM Plex Mono) fetches at build — needs network on first build/dev.
- `lib/supabase/types.ts` is hand-written; regenerate from Supabase once a project exists.
- GitHub is connected at `thedezignking/kingsway`; this folder is an isolated repository on `main`.

## Decision log

- **2026-07-20** — Scaffold depth = "what PRD §7 lays out" (skeleton + fully-built step 1), not feature
  logic. Git left untouched. Backend wired with env-var placeholders, no live keys.
- **2026-07-20** — No Topic Bank seed. Topics are still ideas the founder will input and edit himself;
  committing 35 placeholder rows would make example data look canonical. Table stays; starts empty;
  candidate titles preserved in docs/copy-bank.md.
- **2026-07-20** — PRD is the sole source of truth during the build; drafts + copy bank are reference
  only (use only when Divine asks). This resolves the two prior conflicts by PRD default: audience
  voice = "builders"; census chapter names = About You / Your Current Reality / Your Future / Growth /
  Kingsway / Welcome Home (already in lib/census/questions.ts).
- **2026-07-20** — Census UX review (Divine): cut `success_definition` (overlaps `biggest_goal`, slow
  typing screen) and `overwhelm` (soft data never scored; boring slider); removed `whatsapp_optin`.
  Sliders → tap-one segmented scales. `how_found` options reworked around "Divine invited me".
- **2026-07-20** — Census UX pass 2 (Divine): reverted name to a **single "What should we call you?"
  field** (two name pages was bad UX); greetings extract the first token. **Country + state/city are
  one screen** (composite `location`): after picking the country, the state/city field auto-appears
  under it — no separate screen, and no more state landing awkwardly after the phone number.
- **2026-07-21** — Canonical brand line is **“Do it the King’s way.”** (display lockup uppercase).
  Use it at high-value brand moments, not as repetitive decoration. In welcome-email prose,
  “the King’s way” stays in the regular body font and brass color.
- **2026-07-21** — Email identity is **Divine from Kingsway** via established sender
  `hello@thedezignking.com`; Reply-To is `learn@thedezignking.com`. Keep the designed email. Gmail
  decides inbox categories per recipient; no header or HTML switch can guarantee Primary.
- **2026-07-21** — Admin authentication = approved Supabase Auth identity in service-controlled
  `app_metadata` + passwordless email link + mandatory TOTP MFA (AAL2). No public signup. This avoids
  shared/temporary passwords while preserving an extensible role model and immediate server checks.
- **2026-07-21** — Supabase Auth production URL is `https://kingsway-steel.vercel.app`; allowed
  redirects are the production and localhost `/admin/auth/callback` routes. Keep these synchronized
  if the canonical domain changes, otherwise Supabase falls back to its Site URL in auth emails.

## Open questions to confirm before building (carried from PRD §7)

Not blockers for scaffolding, but resolve before the relevant feature:
- **RSVP mechanism** — V1 assumes a one-click link (`/rsvp/[sessionId]`). Confirm.
- Is **KingsHour always live**? Is **attendance ever mandatory**? Max community size before cohorts?
  How do future paid experiences fit?
- **Confirm the *(proposed)* census option sets** in PRD §4.2: `age_range`, `priorities`, `obstacles`,
  `need_most`, `meeting_time`, `email_prefs` (flagged `proposed: true` in questions.ts).
- **Enumerate the real Topic Bank titles** (current seed is a placeholder).
