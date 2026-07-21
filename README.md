# Kingsway

A growth community for **builders** — people intentionally making something. Members are
**Kings**; the one recurring event is **KingsHour** (monthly, last Sunday, on Google Meet).
Everything in the product exists to get Kings to KingsHour and keep them coming back.

Full spec: [kingsway-prd-v1.md](./kingsway-prd-v1.md). Read PRD §0 first.

> **Principle:** optimize for **trust, not engagement**. No feeds, streaks, badges, or
> notification loops. V1 has **no member accounts** — Kings never log in; auth is admin-only;
> membership is free.

## Status: scaffold

This repo is the **project scaffold** (PRD §7 Build Guide). The architecture, routes,
components, DB schema, and the canonical census question bank are in place. Feature behavior
(census engine, email automation, admin interactivity) and final copy are **not built yet** —
pages/components render labeled placeholders that point to the PRD section they implement.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres, admin auth) ·
Resend (email + `.ics`) · Vercel-ready · zero-cost tier. Google Meet links are pasted in manually.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in when you have Supabase/Resend keys (not required to run the skeleton)
npm run dev                  # http://localhost:3000
```

The skeleton runs without live keys; Supabase/Resend helpers only throw when their feature
actually executes.

## Project structure

```
app/
  (public)/        Landing (/), Census (/census), Welcome (/welcome), RSVP (/rsvp/[sessionId])
  admin/           Auth-gated dashboard: Overview, Kings, Insights, KingsHour, Email, Analytics
  api/             API-first route handlers (thin; logic lives in lib/modules)
components/         landing/ · census/ · admin/ · shared/
lib/
  census/          questions.ts — canonical, versioned question bank (single source of truth)
  supabase/        client (browser) · server (RSC + service role) · types
  email/           resend · ics · templates/ (welcome, invitation, reminder, followUp, update)
  analytics/       typed event names + track()
  modules/         auth · census · members · kingshour · communication · analytics (service layers)
supabase/
  migrations/      0001_init.sql — all entities (PRD §6). topics table starts empty (admin-entered)
```

## Database

Apply the schema to a Supabase/Postgres instance:

```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
```

The `topics` table starts **empty** — topics are entered by the admin (no seed). Candidate topic
ideas live in [docs/copy-bank.md](./docs/copy-bank.md) for reference, not as committed data.

After a Supabase project exists, regenerate types:
`npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts`.

## Recommended build order (PRD §7)

1. ✅ DB schema + seed · canonical census questions — **done in this scaffold**
2. King's Census engine + response storage + resumability (the core asset)
3. Welcome Experience + Welcome Email automation (first end-to-end loop)
4. Landing Page + analytics events
5. Admin: auth, Overview, Kings
6. KingsHour: sessions, RSVP, attendance + lifecycle emails
7. Email page (segmented sends) + Insights + Analytics

## Open questions to confirm before building (PRD §7)

RSVP mechanism (assumed one-click link) · is KingsHour always live? · is attendance ever
mandatory? · max community size before cohorts · the *(proposed)* census option sets in §4.2.
