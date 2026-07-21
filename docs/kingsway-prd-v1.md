# Kingsway — Product Requirements Document (V1)

**Status:** Single source of truth for building Version 1.
**Audience:** Engineers and AI coding agents. Read Section 0 first — it's the context that makes every later decision make sense.
**Source:** Kingsway Blueprint v1.0. Where the blueprint held conflicting drafts, the latest and most concrete decision was kept. Redundant questions have been removed (see 4.2, "Cut log").

---

## 0. Context an implementer needs before writing code

**What Kingsway is.** A growth community for *builders* — people intentionally making something (a startup, product, skill, career, business, personal brand). It is deliberately **not** a social network, feed, forum, course platform, or productivity app. Members are called **Kings**. The community's one recurring event is **KingsHour**, a monthly online gathering. Everything else in the product exists to get people to KingsHour and keep them coming back.

**The core loop the product serves:** build → pause → reflect → learn → continue building. Monthly cadence is intentional — people need time between conversations to actually execute.

**Two audiences, two voices — this matters for every string you write:**
- **Member-facing** (landing, census, welcome, emails): warm, calm, thoughtful — "a mentor and a trusted friend," never hype, never corporate, never a guru. Speaker is **Kingsway, "we."**
- **Admin-facing** (the dashboard): plain, fast, operational — "not pretty, useful." No warmth, no celebration, just clarity. Speaker is neutral/utility.

**Fixed terminology** (never alternate): *King*, *King's Census*, *KingsHour*. Not "member," "survey," "meeting."

**The one principle that resolves most product arguments:** optimize for **trust, not engagement**. If a feature would raise engagement while lowering trust, it's rejected. This is why there are no feeds, streaks, badges, or notification loops (see 2, "Never build").

**V1 has no member accounts.** Kings never log in. They interact through the public census, email, WhatsApp Status, and Google Meet. Authentication exists **only for admins.** Membership is **free.**

**What "experience, not a form" means concretely** (the census is the core asset — get this right): a form collects and advances; an experience *acknowledges before it advances*. In practice that's four things — auto-advance on single-select, occasional reflected-back acknowledgments, chapter intro statements, and an emotional ending. Full spec in 4.2. The discipline is restraint: acknowledgment at a few moments plus zero friction everywhere else. It must feel *responsive and fast*, never *chatty and slow*.

---

## 1. Product Overview

**One-line:** A growth community where builders gather monthly (KingsHour) for practical conversation, accountability, and reflection — entered through a conversational onboarding (King's Census), with email as the permanent channel and WhatsApp Status as the lightweight reminder layer.

**Problem:** Builders are drowning in information but starving for direction. Consuming is easy; executing consistently is hard, lonely, and unaccountable. Kingsway adds rhythm and community, not more content.

**Target audience:** Builders at three recurring stages — the *Beginner* (consumes a lot, ships little, needs clarity), the *Consistent* (shipping, needs accountability and reflection), the *Stuck* (lost momentum, needs perspective). Every decision answers: *does this help builders build?*

**Product goal (the question V1 exists to answer):** Will builders consistently join and return for KingsHour because they find it valuable? Success = census completion, KingsHour attendance, month-over-month returning attendance, referrals. **Not** feature count.

---

## 2. MVP Scope

**Included:** (1) Landing Page — one CTA, Become a King. (2) King's Census — six-chapter conversational onboarding, all questions ship. (3) Welcome Experience. (4) Email system — automated lifecycle emails + admin segmented sends. (5) WhatsApp Status layer — founder's personal Status, no groups (small software footprint: capture number, tell members how to connect). (6) KingsHour — monthly, last Sunday, on Google Meet; RSVP, attendance, follow-up. (7) Admin Dashboard — six pages.

**Out of scope (V1):** mobile app; member profiles/dashboards/login; feed; DMs; forums; gamification/badges/streaks/leaderboards; AI coaching; resource library; course platform; payments; public directory.

**Never build (permanent):** infinite feeds, public timelines, forums, leaderboards, popularity/like counts, notification spam, streaks, artificial gamification, clickbait reminders, engagement loops. Not a productivity app, course marketplace, social platform, chat-first community, or networking platform.

---

## 3. Core User Flow

Discovery → **Landing Page** (answers: what is it, who's it for, why care, what happens if I join) → **Become a King** (single CTA) → **King's Census** (6 chapters) → **Welcome Experience** (celebration + what's next) → **Welcome Email** (auto) → **community rhythm** (KingsHour invite email + calendar invite → WhatsApp Status countdowns → reminder email → RSVP) → **KingsHour** (Google Meet session) → **Follow-up email** → **Return** (back to building; repeats monthly).

---

## 4. Features

### 4.1 Landing Page

**Purpose:** Convert curious visitors into Kings by reducing uncertainty. One primary action: Become a King.

**Sections, in order:** Hero (headline, supporting copy, primary CTA, hero visual — answers "what is this / who's it for" with zero clicks) → Why Kingsway Exists (the problem) → How Kingsway Works (visual journey: Landing → Become a King → Census → Welcome → KingsHour) → Why Builders Join (outcomes: clarity, accountability, perspective, meaningful conversations, consistency — sell transformation, not features) → FAQ (Is Kingsway free? Who is it for? What happens after I join? What is KingsHour? Why is there no WhatsApp group?) → Final CTA.

**Requirements:** No links competing with the primary CTA. Tone honest/warm/calm/confident. Motion limited to hero reveal + scroll transitions, respects reduced-motion preferences. Keyboard-navigable, labeled elements, never color-alone for meaning. Emit analytics: visitors, CTA click rate, census-start conversion, bounce, scroll depth.

**Acceptance:** A first-timer can answer all four core questions without clicking. Exactly one primary action exists; clicking it starts the census. The five events fire.

---

### 4.2 King's Census — the core asset

**Purpose:** Replace registration with the community's first conversation. Make the builder feel seen; capture structured data that powers Insights, segmentation, and topic selection.

**Structure:** 6 chapters. **One question (one idea) per screen** — a chapter is a grouping for the *progress indicator*, not a single form page. Progress reads at chapter level ("Chapter 3 of 6"); screens advance one question at a time. This is the psychological trick: ~16 questions feel like 6 moves.

#### Experience mechanics (build these, not a plain form)
1. **Auto-advance** on every single-select (chips, radio): selecting advances automatically, no Next button. Keep a Next button only on multi-select, text, and slider screens (user decides when done).
2. **Chapter intro statements** — every chapter 1–5 opens with a short reflective screen (5–8s read, one tap to continue). **Chapter 6 has none** — it's the payoff and must land fast. Copy in the table below.
3. **Micro-acknowledgments** — after a *few* high-signal answers only (target 3–4 across the whole census), show one short line, then advance. **Do not** acknowledge every answer — that curdles into a fake chatbot. Cap it; never expand it.
4. **Name reuse** — after Chapter 1, address the King by first name in intros/nudges.
5. **Resumable** — progress persists; a returning user resumes where they left off. Partial records are visible to admins as incomplete.
6. **Ending on the peak** — the final screen is emotional, not transactional (Peak-End rule). Never "Form Submitted."

> **Note on copy:** all user-facing wording in the census is intentionally left unwritten. This PRD specifies *what each screen must ask or communicate* and *how it should behave* — the actual copy is written separately in Kingsway's voice. Do not ship the descriptive phrasings below as literal on-screen text.

#### Progress + nudge (behavior, copy TBD)
- Progress indicator is chapter-level and framed as identity/becoming, not a bare percentage. A secondary percentage is allowed.
- One encouraging nudge around the midpoint; one near the end. Short, calm, non-pushy. Copy TBD.

#### Micro-acknowledgments (behavior, copy TBD)
- After ~3–4 high-signal answers only, show one short acknowledgment line, then advance. Not every answer. Cap it; never expand it. Suggested trigger points: the `season` pick, an ambitious `income_desired`, and a named `obstacle`. Copy TBD.

#### Validation (behavior, copy TBD)
- Validate required fields and email/phone format. Tone is gentle, never scolding. Copy TBD.

#### Chapter intros (behavior, copy TBD)
- Each chapter 1–5 opens with a short reflective statement screen (~5–8s read, one tap to continue). Keep them brief. **Chapter 6 has none** — go straight to the celebration.
- Intent per chapter: (1) set an honest, conversational tone; (2) frame "where you are today"; (3) frame "where you're going"; (4) frame facing obstacles honestly; (5) frame "help us shape Kingsway," and reuse the King's first name. Copy TBD.

#### Question bank (V1 — canonical)
One row = one screen. `id` is stable and versioned; response storage keys on it. "Asks for" describes what to collect — **not** the on-screen wording, which is written separately. Options marked *(proposed)* were not fixed in the blueprint — confirm before build.

**Chapter 1 — About You**
| id | Asks for | Input | Options / config | Req |
|---|---|---|---|---|
| `first_name` | First name / what to call them | text | — | ✓ |
| `email` | Email address | email | validate format | ✓ |
| `phone` | WhatsApp number | tel | country code auto-detected (IP/locale), editable; store E.164 | ✓ |
| `age_range` | Age range | single-select chips | Under 18 / 18–20 / 21–24 / 25–29 / 30–34 / 35+ *(proposed)* | ✓ |
| `country` | Country | searchable select | ISO country list | ✓ |
| `state_city` | State / city | text | — | ✓ |
| `birthday` | Birthday (optional) | month + day picker | **DEFERRED FEATURE** — collected in V1, not used until birthday automation ships. Do not wire automation to it. Month+day only, never full DOB. | ✗ |

**Chapter 2 — Your Current Reality**
| id | Asks for | Input | Options / config | Req |
|---|---|---|---|---|
| `season` | Current life phase | single-select chips | Student / Founder / Freelancer / Creator / Employee / Something else | ✓ |
| `occupation` | Specific role/day-to-day | short text | the *specific* role (e.g. "final-year CS student", "solo SaaS founder"). Distinct from `season` (the life-phase category). | ✓ |
| `income_current` | Current monthly income | single-select | No income yet / Under \$100 / \$100–300 / \$300–700 / \$700–1,500 / \$1,500–3,000 / \$3,000+. Screen should feel reassuring/non-judgmental (copy TBD). | ✓ |
| `priorities` | Main focus this month | multi-select chips (up to 3) | *(proposed)* Learning a skill / Shipping a product / Getting clients / Money / Consistency / Health / Faith / Relationships | ✓ |

**Chapter 3 — Your Future**
| id | Asks for | Input | Options / config | Req |
|---|---|---|---|---|
| `biggest_goal` | Biggest goal this year | short text | — | ✓ |
| `income_desired` | Desired monthly income in 12 months | single-select | First \$100 / \$100–300 / \$300–700 / \$700–1,500 / \$1,500–3,000 / \$3,000–5,000 / \$5,000+ | ✓ |
| `success_definition` | What success looks like to them | long text | one of the only typing screens; keep it earned | ✓ |
| `confidence` | Confidence in reaching the goal | slider | store 1–10; never surfaced back to the King as a score | ✓ |

**Chapter 4 — Growth**
| id | Asks for | Input | Options / config | Req |
|---|---|---|---|---|
| `obstacles` | Biggest obstacles | multi-select chips (up to 3) + optional "other" text | *(proposed)* Consistency / Focus / Money / Time / Skills / Confidence / Support / Direction | ✓ |
| `need_most` | What they need most from Kingsway | single-select | *(proposed)* Clarity / Accountability / Community / Skills / Encouragement / Direction | ✓ |
| `overwhelm` | How often things feel overwhelming | frequency slider | Rarely → Constantly. **Light framing only — never scored, never shown back, never built into a wellness feature.** | ✓ |

**Chapter 5 — Kingsway**
| id | Asks for | Input | Options / config | Req |
|---|---|---|---|---|
| `topics` | Topics they want to grow in | multi-select chips (up to 5) | Faith / Business / Money / Career / Leadership / Discipline / Purpose / Health / Relationships | ✓ |
| `meeting_time` | Preferred KingsHour time | single-select | *(proposed)* Weekend morning / Weekend afternoon / Weekend evening / Weekday evening | ✓ |
| `email_prefs` | Email frequency preference | single-select | *(proposed)* Everything / Only KingsHour / Minimal | ✓ |
| `whatsapp_optin` | Opt in to WhatsApp reminders | toggle (opt-in) | boolean; default off | ✗ |
| `how_found` | How they found Kingsway | single-select | Social media / A friend / Search / An event / Other | ✓ |

**Chapter 6 — Welcome Home** *(no questions)*
Success animation → welcome/confirmation message (they're now a King; see you at KingsHour; check email) → add-to-calendar button (next KingsHour) → confirmation that the Welcome Email is sent. Copy TBD; must land on an emotional high, never a transactional "submitted".

#### Cut log (redundancies removed — annotated so any cut can be vetoed)
- **Growth Areas — CUT.** Was the same list as `topics` (Ch 5). `topics` carries it: better interaction (chips), and it directly feeds the Insights page. *This is the only hard cut.*
- **KEPT with distinct framing (not redundant once framed):** `occupation` vs `season` — season is the life-phase category, occupation is the specific role; `priorities` (this month, multi) vs `biggest_goal` (this year, single). The chapter intro statements do the work of making these read as different questions. If in testing they still feel duplicative, `priorities` is the merge candidate.

#### Census analytics
Start rate, completion rate, drop-off point per screen, time per chapter, time to completion.

**Acceptance:** All 6 chapters completable on mobile + desktop; completion creates one Member record (status = King) with every response linked and the Welcome Email queued. No screen shows more than one question or references raw question counts. Abandon-and-return restores progress; partial record shows in admin as incomplete. Every question and option set above is present.

---

### 4.3 Welcome Experience
**Purpose:** The bridge from onboarding to participation — the first moment of belonging, not a confirmation page.
**Requirements:** Communicates — you're now a King; what KingsHour is and when the next one is; how email works; why WhatsApp Status (not groups) and how to connect (save founder's number); what to expect over coming days. Add-to-calendar for next KingsHour. Confirmation animation.
**Analytics:** welcome completion, email confirmation, WhatsApp connection, first KingsHour registration.
**Acceptance:** A new King leaves knowing all five items; the Welcome Email is sent by the time this screen shows (or within minutes).

---

### 4.4 Email System
**Purpose:** Permanent record + primary channel. Every important thing exists in email. Every email has one purpose and ends with one clear next step. Tone: a thoughtful letter, not a campaign.

**Templates (V1):**
1. **Welcome** — auto, on census completion. Belonging + what's next.
2. **KingsHour Invitation** — before each session: date, time, theme, expectations, preparation. Includes `.ics` calendar invite.
3. **KingsHour Reminder** — short, closer to the event.
4. **Follow-Up** — after each session: key insights, reflection questions, practical actions, resources, next month's date.
5. **Community Update** — admin-triggered, infrequent, only when meaningful.

**Requirements:** Trigger-based automation (census completion → Welcome; session lifecycle → Invitation/Reminder/Follow-Up, schedulable per session from admin). Admin composes + sends to segments (see 5.5). Consistent identity/tone across templates. Track sends, opens, calendar-invite acceptance; log every send to the member's communication history.
**Acceptance:** Census completion → Welcome Email with no admin action. Creating/scheduling a session lets its three lifecycle emails be scheduled + sent to the right audience. Every send appears in the recipient's timeline and in email analytics.

---

### 4.5 WhatsApp Status Layer
**Purpose:** Presence without pressure via the founder's personal WhatsApp **Status**. No groups, no daily discussion, no long-form teaching.
**Software footprint (intentionally small):** census captures `phone` + `whatsapp_optin`; Welcome screen + email tell Kings to save the founder's number to see Status. Content is posted manually by the founder (documented cadence: short daily Status — building updates, lessons, opportunities, reflections, KingsHour reminders). Optional: admin can store planned Status notes (low priority).
**Acceptance:** numbers collected and visible on profiles; onboarding tells every King how to connect.

---

### 4.6 KingsHour
**Purpose:** The heart of the product. Monthly (last Sunday) online gathering for conversation, reflection, accountability. Not a webinar/lecture/networking event.
**Member flow:** invitation email (theme + `.ics`) → RSVP link → Status countdowns + reminder email → join via Google Meet → session (welcome/updates → topic intro → guided discussion → shared experiences → reflection → practical commitments → close) → follow-up email.
**Requirements:**
- **Session entity:** topic (from Topic Bank), date, description, facilitator, Google Meet link (created manually, pasted in), resources, status (upcoming/live/done).
- **Registration:** one-click RSVP link (`/rsvp/[sessionId]`) records a Registration for member+session. *(Blueprint left the mechanism open; V1 uses this minimal RSVP — confirm before build.)*
- **Attendance:** admin marks per member per session (registered vs attended).
- **Topic Bank (seed data):** topics organized in pillars — Foundation, Career & Skills, Money, Business, Faith & Character, Relationships, Mindset — with the blueprint's ~35 seed titles. Each topic: title, pillar, purpose, description, discussion questions, reflection prompts, assignment, status (draft/active/archived). V1 needs topic *selection* per session; full Topic Bank management UI is backlog.
- **Metrics:** registrations, attendance, returning attendance, retention.
**Acceptance:** admin can create a session, assign a topic, attach a Meet link, trigger its email lifecycle; a member can RSVP from the invite and is counted; post-session attendance is recorded and reflected in profiles, Insights, Analytics.

---

## 5. Admin Panel

Internal only. **Operational first** — speed and clarity over polish. One source of truth: everything about a King on one profile. Admin auth with role-based permissions (V1: single **Super Admin** suffices; design the role system so Community Lead / Moderator / Content Manager / Operations can be added later without redesign). **Voice: plain and utilitarian — no warmth, no celebration.**

> **Note on copy:** admin strings (headers, empty states, buttons, confirmations, callouts) are left unwritten and written separately in the plain/operational admin voice. The lists below are the metrics, controls, and states each page must show — not final labels.

**5.1 Overview (home).** Answers "what needs my attention today?" at a glance (<10s). Stat cards: Total Kings · Joined this week · Days to KingsHour · Attendance rate · Census completion · Last email open rate · Top goal · Biggest struggle. Charts: age distribution, countries, occupations, growth areas, monthly signups. Include a calm empty state for when nothing needs attention (copy TBD).

**5.2 Kings (members).** Searchable/filterable list of every King. Needs: search (by name, country, interest), a no-results state, and an incomplete-census indicator (copy TBD). Member profile: personal info (name, email, phone, join date, status, last activity) · builder profile from census (season, occupation, goal/what they're building, challenges, interests, confidence) · activity (KingsHour attendance count + history, census completion, email engagement, communication timeline). Actions: view/filter census responses, review incompletes, export.

**5.3 Insights** (the decision engine — aggregates census so no one reads responses by hand). Panels: Top struggles (ranked) · Top goals (ranked) · Fastest-growing country · Most active age band · Most requested topics. Should read as answers that point to the next KingsHour topic (framing copy TBD).

**5.4 KingsHour.** Full session lifecycle: create/edit (topic, date, description, facilitator, Meet link, resources, status), monitor registrations, mark attendance, trigger/schedule the three lifecycle emails. Session status states: Upcoming / Live / Done. Controls: add session, mark attendance, send follow-up. Warn when a session has no Meet link before invites go out (copy TBD).

**5.5 Email.** Compose → choose audience → send. Segments: Everyone · by season (Students, Founders…) · by country · by interest (e.g. Business) · Joined this month · Didn't attend last KingsHour · Custom. Requires a pre-send confirmation showing recipient count and a post-send confirmation (copy TBD). Shows send history + per-campaign opens.

**5.6 Analytics** (community, not website). Metrics: joins/month, attendance, email opens, calendar acceptances, census completion rate, avg completion time, drop-off screen, retention/returning Kings, avg membership duration. Surface the census drop-off screen prominently (callout copy TBD). Funnel: visitor → census start → completion → welcome → first KingsHour → returning.

---

## 6. Data Model (high level)

- **Member** — id, first_name, email, phone (E.164), age_range, country, state_city, birthday_month, birthday_day *(nullable, deferred use)*, join_date, status, last_activity. One member = one record; everything links here.
- **CensusResponse** — member_id, question_id, question_version, response (JSON to fit text/single/multi/slider), completion_status, submitted_at, updated_at. Versioned question defs so the census can evolve without breaking history. Progress/partial state stored here or in a lightweight CensusProgress row.
- **KingsHourSession** — id, topic_id, date, description, facilitator, meet_link, resources, status.
- **Registration/Attendance** — member_id, session_id, registration_status, attendance_status, follow_up_completed.
- **Communication** — member_id, type (welcome/invitation/reminder/follow_up/update), sent_at, opened, calendar_accepted. Full timeline per member.
- **Topic** (Topic Bank) — id, pillar, title, purpose, description, discussion_questions, reflection_prompts, assignment, status (draft/active/archived).

**Relationships:** Member 1→N CensusResponses, Registrations/Attendance, Communications. Session N→1 Topic; Session 1→N Registrations. Keep modules loosely coupled (auth, census, members, kingshour, communication, analytics, admin); business logic **API-first** so future surfaces (mobile, integrations) reuse the backend.

---

## 7. Build Guide

**Stack** (existing Kingsway stack; blueprint mandates only "small stack, API-first, modular"): Next.js 14 + TypeScript + Tailwind; Supabase (Postgres, admin auth, storage); Vercel; transactional email provider with open tracking + scheduling + `.ics` (e.g. Resend); Google Meet links created manually and pasted into sessions. Zero-cost tier throughout.

**Routes**
- Public: `/` · `/census` (multi-step, resumable) · `/welcome` · `/rsvp/[sessionId]` (one-click RSVP).
- Admin (auth-gated): `/admin` · `/admin/kings` · `/admin/kings/[id]` · `/admin/insights` · `/admin/kingshour` · `/admin/kingshour/[id]` · `/admin/email` · `/admin/analytics`.

**Major components**
- Landing: Hero, Problem, HowItWorks, Outcomes, FAQ, FinalCTA.
- Census engine: `ChapterShell` (holds chapter-level progress) → `QuestionScreen` (variants: chip-single [auto-advance], chip-multi, radio [auto-advance], slider, short-text, long-text, tel, calendar) · `ChapterIntro` · `EncouragementInterstitial` · `AcknowledgmentToast` (capped) · `CelebrationScreen`. Progress is chapter-level; screens are question-level.
- Admin: `StatCard`, `ChartPanel`, `MemberTable`+filters, `MemberProfile`, `SessionForm`, `AttendanceMarker`, `EmailComposer`+`AudienceSegmenter`, `InsightsPanels`.
- Shared: analytics event tracker.

**Integrations:** email provider (transactional + campaigns + open tracking), `.ics` generation, Supabase, lightweight product analytics (census funnel events).

**Recommended implementation order**
1. DB schema + Supabase (all entities, versioned census questions, seed Topic Bank).
2. King's Census engine + response storage + resumability (the core asset).
3. Welcome Experience + Welcome Email automation (first end-to-end loop).
4. Landing Page + analytics events (opens the funnel).
5. Admin: auth, Overview, Kings.
6. KingsHour: sessions, RSVP, attendance + the three lifecycle emails.
7. Email page (segmented sends) + Insights + Analytics.

**Confirm before build (open questions carried from the blueprint):** RSVP mechanism (V1 assumes one-click link); whether KingsHour is always live; whether attendance is ever mandatory; max community size before cohorts; how future paid experiences fit. Also confirm the *(proposed)* option sets in 4.2.

---

## 8. Future Backlog (not V1 — recorded, not expanded)

- **Community operations:** Topic Bank management UI, segmentation tooling, improved analytics, resource management, extra admin roles.
- **Member experience:** member dashboard, profiles, KingsHour archive with recordings, King's Journal (private reflections), monthly challenges/habit tracking, growth timeline.
- **Community:** accountability circles, regional chapters (Lagos, Accra, Nairobi…), DMs, discussions, opt-in directory.
- **Intelligence (AI layer):** community insights, AI-generated monthly Community Brief before each KingsHour, topic recommendations from census trends, attendance/engagement predictions, smart email segmentation.
- **Content & learning:** resource library, reading lists, guided reflection series, curated talks/essays, guest speaker management.
- **Events:** KingsGathering (annual), meetups, workshops, retreats, live Q&As.
- **Leadership:** mentorship, volunteer management, ambassadors, chapter leaders, hosting tools.
- **Automation:** **birthday messages** (data collected in V1 via `birthday`), milestone celebrations, personalized recommendations, topic suggestions, segmentation automations.
- **Rhythm additions:** quarterly King's Check-In, yearly reflection + King's Census refresh.
- **Landing enhancements:** testimonials, community stories, KingsHour highlights, resource previews.
- **Lead magnets:** The King's Blueprint, The King's Reset, The King's Compass, "25 Mistakes I Made in My Early Twenties", The AI Starter Guide for Young Builders.
- **Platform:** native mobile apps, international communities, payments (only if ever required for access).
