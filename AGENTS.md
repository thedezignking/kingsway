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
  templates/admin-recovery.html   (source of truth for the live Supabase recovery email)
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

_Last updated: 2026-07-22_

**Done**
- **Narrow-screen journey boundary correction (2026-07-22):** retained the intended tablet/mobile
  scroll pacing but shortened the physical sticky stage to a content-led `32rem–34rem`. This removes
  the near-full-viewport dotted tail after the final Census copy and lets the normal FAQ section
  follow much sooner. First copy now begins about `6rem` after the hero at the tested tall-narrow
  breakpoint (down from roughly `11rem`), with the faded previous heading shifted in tandem to avoid
  overlap. The post-journey margin is also smaller;
  native scrolling, mobile scene timing, the faded previous heading and hidden future scenes remain.
- **Public return path, Welcome and delivery polish (2026-07-22):** tightened only the five outer
  hero portraits while preserving the centre crown and its copy, brought the constellation inward,
  and added a small proof-line gap. Desktop scrollytelling now divides the complete visible journey
  into three equal reading windows; mobile reaches FAQ sooner after the final scene. Every Census
  visit starts fresh, but a completed King is detected at the email step and shown a calm return
  state with Welcome/use-another-email actions. The server guard prevents an existing King from being
  downgraded, overwritten, or sent another Welcome email, and the completion draft race that could
  re-open celebration was removed. Fraunces was removed product-wide: public UI, Census, Welcome,
  emails and legal pages now use Hanken Grotesk, with IBM Plex Mono retained for utility copy.
  Welcome is a more ceremonial open path with the same filled ink crown language. The Welcome email
  retains its substantial "thousands" opening and personal letter voice, while using one first-party
  CTA, a reply invitation, an inline canonical crown and a lighter dotted structure; Resend tracking
  was verified off. Canonical Open Graph/Twitter metadata, a 1200x630 social image, and an email-safe
  crown image route were added. Production build and responsive browser checks pass; work remains
  intentionally uncommitted.
- **Landing hero + welcome mark correction (2026-07-22):** restored the last committed hero portrait
  composition after the compact Alvinn-style pass felt too small, but reduced only the surrounding
  portrait boxes slightly so the visual is lighter without losing the intended spread. Added more
  breathing room between the hero CTA and portrait visual. The hero, final CTA, Welcome page and
  post-census celebration now share the same filled ink crown language (dark fill, light crown) rather
  than using brown/brass crown badges. Journey copy remains the calmer PRD/drafts-informed version:
  building can get heavy, KingsHour receives the real month, and the King's Census starts by listening.
  Mobile scrollytelling spacing was tuned specifically at `<=700px`, and the iPhone browser/status-area
  theme color uses the near-white canvas.
- **Kingsway public experience redesign (2026-07-21):** canonical human-facing brand casing remains
  **Kingsway** across product UI, admin, emails, Supabase templates, metadata and documentation;
  compatibility-sensitive lowercase technical identifiers remain unchanged. Landing is now a
  soft-white, sans-led one-read hero with a central brass crown surrounded by five real-King portrait
  slots, verified city proof, and a dotted path that continues into a reversible three-scene sticky
  narrative (recognition → KingsHour → King’s Census). Future scenes stay hidden until scroll;
  the immediately previous scene remains at 25% opacity. FAQ and final invitation are open text,
  not cards; reduced-motion/no-JS fall back to normal stacked content. Public Census/Welcome inherit
  the lighter system, Welcome cards became an open path, and Census location now explicitly asks for
  **current residence** while preserving `{ country, state_city }`, subdivision automation, phone
  dial-code seeding, persistence and backend contracts. Real assets belong in
  `public/images/kings/hero/king-01.jpg`…`king-05.jpg` (1:1; 1200px+); neutral crown placeholders
  render until supplied. Browser QA passed at desktop, tablet, mobile and short-height viewports:
  first-scene isolation, forward/reverse scene state, 25% previous-scene fade, dotted-path progress,
  no horizontal overflow, and a single semantic scene set shared by enhanced/reduced-motion/no-JS
  modes. Changes intentionally remain uncommitted until Divine approves.
- **Landing refinement (2026-07-21):** retained the new open, scroll-led direction and added the
  finish the earlier design handled better: more space below the nav, orchestrated hero/portrait/
  crown/path entrances, staggered scene copy, animated FAQ disclosures and a stronger full-width
  invitation where the dotted way resolves. Journey and FAQ copy now speak more directly to the
  quiet reality of building without promising outcomes. At `<=960px`, journey scenes use one stable
  reading position while the previous scene moves up and reduces to a faded heading; browser bounds
  checks confirm no overlap and the full King's Census paragraph remains visible at desktop, tablet
  and mobile. The welcome email keeps its copy and delivery behavior but now uses the same lighter
  sans-led canvas, compact brass crown and dotted connected block. Reduced-motion remains static.
- **Public type correction (2026-07-21):** restored the softer sans treatment from the first redesign
  by loosening hero/journey/FAQ/CTA tracking, reducing public heading weight, and easing the wordmark
  back from the compressed startup-style treatment. The new open landing structure stays intact; only
  the over-tight type drift from the latest pass was corrected.
- **Landing responsiveness + flow refinement (2026-07-21):** added the mono hero label
  "A COMMUNITY OF BUILDERS"; replaced fixed hero spacing with viewport-aware clamps; settled the hero
  headline at a controlled middle width; changed the hero crown mark background to the ink/
  secondary-button color; and restored the last committed portrait-cluster geometry after the
  short-screen compression pass made the hero visual feel distorted. A dotted connector-wire idea was
  tested and rejected because it made the hero feel diagrammatic instead of premium. The
  tablet journey breakpoint is now `<=1100px`, with a separate faded previous-heading layer on
  tablet/mobile instead of overlapping article boxes. FAQ and final CTA are normal post-journey
  sections with in-view reveal only, not sticky/scrollytelling layers; the CTA is simplified to one
  heading, one support sentence and one button. Verified no horizontal overflow, no journey copy
  overlap, active copy visibility, reduced-motion stacked layout and no-JS fallback.
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
  Production page collection is pinned to one worker in `next.config.mjs` because Next 14 can
  intermittently lose generated route modules under parallel collection on Windows.

- **Welcome email identity + brand line (2026-07-21):** sender is now consistently
  `Divine from Kingsway <hello@thedezignking.com>` with replies routed to
  `learn@thedezignking.com`. The sentence uses **“the King’s way” in the normal body face** (brass
  retained; serif/italic emphasis removed). Canonical line lives in [lib/brand.ts](./lib/brand.ts):
  `Do it the King’s way.` / display lockup `DO IT THE KING’S WAY`; used with restraint in the email
  footer, site footer, and census ending. Email design and tracking settings were otherwise left
  unchanged. Gmail category placement remains recipient-controlled; the established `hello@`
  identity is the deliverability improvement, not a visual redesign.
- **Welcome email idempotency (2026-07-21):** welcome delivery is now a one-time member lifecycle
  event, not a welcome-page side effect. [0002_welcome_email_idempotency.sql](./supabase/migrations/0002_welcome_email_idempotency.sql)
  removes historical duplicate welcome logs and adds a partial unique index allowing one welcome
  communication per King. `sendWelcome` atomically claims that row before contacting Resend and also
  uses a deterministic Resend idempotency key, covering refreshes, retries, multiple tabs, and
  concurrent completion requests. The migration has been applied to the live Supabase project.
- **Admin access control + Operations Desk UI — BUILT (2026-07-21):** `/admin` dashboard routes now
  live inside a server-protected route group. Supabase Auth verifies the request; protected
  `app_metadata` explicitly grants an active role; **TOTP AAL2 is mandatory** before any dashboard
  or `/api/admin/*` access. Login uses the approved admin email + password, with a branded recovery/
  first-password email, a 14-character minimum, first-use MFA enrollment, returning-session MFA
  verification, sign-out, safe internal redirects, no public signup, `noindex`, and independent
  401/403 API checks. First live Super Admin provisioned:
  `divineukanwa@gmail.com`. Role matrix remains extensible. Admin visual direction is deliberately
  operational: Hanken interface + IBM Plex Mono utility labels, precise left rail, warm neutral
  surfaces, brass only for state/focus; no member-facing serif, crown, Cadence, or celebration.
  Verified: `npx tsc --noEmit`; production `npm run build` (24 routes); anonymous `/admin` → 307
  `/admin/login`, login → 200, anonymous admin API → 401. **Supabase Auth URL config is live:** Site
  URL = `https://kingsway.thedezignking.com`; redirect allow-list includes the branded domain, Vercel
  fallback, and localhost `/admin/auth/callback` routes. Applied through the Management API after the dashboard save endpoint
  returned 500; every temporary personal access token was revoked immediately after verification.
  **Supabase Auth custom SMTP is live through Resend** under `divineukanwa@gmail.com`, using the
  verified `thedezignking.com` domain and a domain-scoped, sending-only credential. Auth sender is
  `Divine from Kingsway <hello@thedezignking.com>`; the same replacement credential is installed in
  local env and Vercel Production + Preview. The prior full-access and wrong-account Kingsway keys
  were revoked; only the domain-scoped `Kingsway delivery` key remains for this app.
- **Cross-browser admin recovery (2026-07-21):** the live Supabase recovery template now links to
  `/admin/auth/confirm` with Supabase's one-time token hash instead of relying on a PKCE verifier
  stored in the browser that requested the email. The public confirm route verifies only `recovery`
  tokens, rejects unapproved identities, and sends the approved admin to password creation **before**
  mandatory MFA. The source template is
  [supabase/templates/admin-recovery.html](./supabase/templates/admin-recovery.html); subject is
  `Set your Kingsway admin password`. The simple transactional template has no remote images, custom
  fonts, or tracking links. Domain DKIM/SPF are verified, DMARC is present, and Resend tracking is
  disabled; Gmail still makes the final Spam/Inbox decision from sender reputation and recipient
  behavior. Supabase's project-wide auth-email quota was raised from its exhausted default of 2/hour
  to a restrained 10/hour (custom SMTP is active); the first new-template recovery email was
  confirmed delivered by Resend. The temporary Supabase Management API token used to apply this
  template was revoked.
- **Reliable password completion (2026-07-21):** password creation now submits through the protected
  `updateAdminPassword` server action instead of calling Supabase Auth from a freshly recovered
  browser client. The former client call could stall before reaching `/auth/v1/user`; the server
  action validates the approved admin session and both password fields, saves through the
  cookie-aware server client, reports a definite error, and redirects to MFA only after success.
- **Reliable MFA completion (2026-07-21):** authenticator factor discovery, stale unverified-factor
  cleanup, TOTP enrollment, and challenge verification now use the cookie-aware server client. The
  enrollment page renders its QR code from server-prepared data instead of waiting on a browser auth
  client; both enrollment and returning-session codes submit through `verifyAdminMfa` and redirect
  only after AAL2 verification succeeds.

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
- Use only the newest recovery email with subject **“Set your Kingsway admin password.”** It should
  open password creation first and authenticator enrollment second; previously issued PKCE recovery
  emails follow the superseded browser-bound flow.
  Also verify one fresh live Census submission in Gmail with the new `hello@` sender and `learn@`
  Reply-To; inbox category cannot be forced by application code.

**Known gaps / cautions**
- No `psql`/`supabase` CLI is installed locally; schema changes are currently applied through the
  Supabase dashboard.
- Census copy in [lib/census/copy.ts](./lib/census/copy.ts) + landing/email strings are **first-pass**,
  on-voice but not final — refine without touching the engine.
- `next/font/google` (Hanken Grotesk and IBM Plex Mono) fetches at build and needs network on the
  first build/dev run. Fraunces has been removed; do not reintroduce a serif without explicit sign-off.
- `lib/supabase/types.ts` is hand-written; regenerate from Supabase once a project exists.
- GitHub is connected at `thedezignking/kingsway`; this folder is an isolated repository on `main`.

## Decision log

- **2026-07-22** — On tablet/mobile, preserve the scrollytelling cadence but size the sticky stage to
  its content instead of the full viewport. This keeps the focused one-scene interaction while ending
  the dotted path close to the final copy and avoiding a large empty tail before FAQ.
- **2026-07-22** — Fraunces is no longer part of Kingsway. Use Hanken Grotesk for all human-facing
  display and body typography, with IBM Plex Mono reserved for labels, dates and operational utility.
- **2026-07-22** — A public Census visit always begins fresh. At the email step, an address belonging
  to a completed King stops the flow without mutating stored membership or responses and offers a
  calm route to Welcome or a different email. Welcome delivery remains a one-time lifecycle event.
- **2026-07-22** — Welcome email copy may remain emotionally substantial; improve Primary-inbox odds
  through personal single-purpose structure, one first-party CTA, a genuine reply invitation, and no
  tracking—not by flattening Kingsway's voice. Resend tracking is off; Gmail retains final category
  control. Email and social assets use the canonical geometric crown rather than a substitute icon.
- **2026-07-21** — After an editorial review, **Kingsway** remains the canonical display name; the
  brief camel-case experiment was rejected as too stylized. Preserve lowercase technical identifiers
  (domain/repo/package/env/cookies/storage/
  Supabase metadata/calendar UID domains) to avoid compatibility breaks. Public design direction is
  soft white (`#FCFCFA`), sans-led, no cards/glow/dark CTA, with a crown-centred real-portrait hero
  and native scroll-driven dotted journey. Census `location` means where the King currently lives,
  not origin; storage and schema remain unchanged.
- **2026-07-21** — Keep the new open public direction over the former card-led design. Recover polish
  through stronger copy, spacing and purposeful motion—not by restoring cards, glow or a dark CTA.
  Desktop retains alternating journey scenes; tablet/mobile show the previous heading above one
  complete active scene so copy never overlaps or clips.
- **2026-07-21** — Public display typography should stay sans-led but soft: Hanken headings use
  moderate weight and light negative tracking only. Do not reintroduce the over-compressed
  `tracking-[-0.04em]` / heavy startup-style treatment unless Divine explicitly asks.

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
  `app_metadata` + account-specific password + mandatory TOTP MFA (AAL2). No shared gate and no public
  signup. Password creation/recovery uses Supabase's one-time recovery link; ordinary sign-in does not
  depend on email delivery.
- **2026-07-21** — Supabase Auth mail uses Resend custom SMTP owned by `divineukanwa@gmail.com`; the
  credential is sending-only and scoped to the verified `thedezignking.com` domain. Auth identity is
  `Divine from Kingsway <hello@thedezignking.com>`. Keep it distinct from unrelated Resend accounts.
- **2026-07-21** — Welcome email delivery is exactly-once per King: database partial unique index +
  pre-send communication claim + deterministic Resend idempotency key. A page refresh or repeated
  Census completion may re-render Welcome but must not send another welcome email.
- **2026-07-21** — Supabase Auth canonical URL is `https://kingsway.thedezignking.com`; allowed
  redirects are the branded domain, `kingsway-steel.vercel.app` fallback, and localhost
  `/admin/auth/callback` routes. Keep these synchronized if the canonical domain changes, otherwise
  Supabase falls back to its Site URL in auth emails.
- **2026-07-21** — Admin recovery `redirectTo` must exactly match the allow-listed callback path (no
  `?next=` query). The intended protected destination and recovery-flow marker are stored in
  short-lived HttpOnly cookies and cleared by the callback. A mismatched redirect causes Supabase to
  fall back to the public Site URL.
- **2026-07-21** — Supabase recovery emails now use `{{ .TokenHash }}` and
  `/admin/auth/confirm?type=recovery`. This supersedes the browser-bound PKCE recovery callback for
  newly issued emails, so opening a link in Gmail or another browser still reaches password creation
  before MFA. Keep `/admin/auth/callback` for normal OAuth/PKCE compatibility and previously issued
  links.
- **2026-07-21** — Supabase's project-wide auth-email limit is 10/hour. The former 2/hour limit was
  exhausted by two setup tests and blocked a legitimate recovery request despite healthy Resend SMTP.
  Keep the limit modest because `/admin/login` is public even though only approved Auth identities can
  receive a usable recovery session.
- **2026-07-21** — Admin password creation is a server action, not a direct browser Supabase call.
  Recovery establishes the secure cookie session; the server action revalidates the approved admin,
  updates the password, then redirects to MFA. This avoids browser auth-lock stalls during first-time
  setup.
- **2026-07-21** — Admin MFA setup and verification are server-managed for the same reason. Do not
  reintroduce browser Supabase auth calls into the password/MFA path; render prepared enrollment data
  from the protected page and submit six-digit challenges through server actions.

## Open questions to confirm before building (carried from PRD §7)

Not blockers for scaffolding, but resolve before the relevant feature:
- **RSVP mechanism** — V1 assumes a one-click link (`/rsvp/[sessionId]`). Confirm.
- Is **KingsHour always live**? Is **attendance ever mandatory**? Max community size before cohorts?
  How do future paid experiences fit?
- **Confirm the *(proposed)* census option sets** in PRD §4.2: `age_range`, `priorities`, `obstacles`,
  `need_most`, `meeting_time`, `email_prefs` (flagged `proposed: true` in questions.ts).
- **Enumerate the real Topic Bank titles** (current seed is a placeholder).
