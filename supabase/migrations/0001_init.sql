-- Kingsway V1 — initial schema
-- Source of truth: kingsway-prd-v1.md §6 (Data Model) + §4 (Features).
-- Design notes:
--   * One Member = one record; everything links to it (PRD §6).
--   * Business logic is API-first; RLS below is intentionally minimal (stub) and
--     gets tightened when admin auth is wired (PRD §5 role system).
--   * Enums are Postgres enum types so the app and DB share one vocabulary.
--   * Fixed terminology: a Member's default status is 'king'.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------
create type member_status as enum ('king', 'incomplete');           -- incomplete = census not finished
create type census_completion_status as enum ('in_progress', 'complete');
create type session_status as enum ('upcoming', 'live', 'done');
create type registration_status as enum ('registered', 'cancelled');
create type attendance_status as enum ('unknown', 'attended', 'no_show');
create type communication_type as enum ('welcome', 'invitation', 'reminder', 'follow_up', 'update');
create type topic_pillar as enum (
  'foundation', 'career_skills', 'money', 'business',
  'faith_character', 'relationships', 'mindset'
);
create type topic_status as enum ('draft', 'active', 'archived');

-- ---------------------------------------------------------------------------
-- members  (PRD §6 Member)
-- ---------------------------------------------------------------------------
create table members (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,              -- single "what to call you" field; greetings use first token
  email           text not null unique,
  phone           text,                       -- E.164, from census `phone`
  age_range       text,
  country         text,
  state_city      text,
  birthday_month  smallint check (birthday_month between 1 and 12),  -- DEFERRED use (PRD §4.2)
  birthday_day    smallint check (birthday_day between 1 and 31),    -- month+day only, never full DOB
  join_date       timestamptz not null default now(),
  status          member_status not null default 'incomplete',
  last_activity   timestamptz not null default now()
);
create index members_email_idx   on members (email);
create index members_country_idx on members (country);
create index members_status_idx  on members (status);

-- ---------------------------------------------------------------------------
-- census_responses  (PRD §6 CensusResponse)
-- Versioned question defs so the census can evolve without breaking history.
-- One row per (member, question). `response` is JSONB to fit text/single/multi/slider.
-- ---------------------------------------------------------------------------
create table census_responses (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid not null references members (id) on delete cascade,
  question_id       text not null,            -- stable id, e.g. 'season' (lib/census/questions.ts)
  question_version  integer not null default 1,
  response          jsonb not null,
  completion_status census_completion_status not null default 'in_progress',
  submitted_at      timestamptz,
  updated_at        timestamptz not null default now(),
  unique (member_id, question_id, question_version)
);
create index census_responses_member_idx   on census_responses (member_id);
create index census_responses_question_idx on census_responses (question_id);

-- ---------------------------------------------------------------------------
-- census_progress  (lightweight resumability, PRD §4.2 "Resumable")
-- One row per member; tracks where they left off.
-- ---------------------------------------------------------------------------
create table census_progress (
  member_id       uuid primary key references members (id) on delete cascade,
  current_screen  text,                       -- question_id of the last shown screen
  chapter         smallint,                   -- chapter-level progress (1..6)
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- topics  (Topic Bank, PRD §4.6 + §6 Topic)
-- ---------------------------------------------------------------------------
create table topics (
  id                    uuid primary key default gen_random_uuid(),
  pillar                topic_pillar not null,
  title                 text not null,
  purpose               text,
  description           text,
  discussion_questions  text[],
  reflection_prompts    text[],
  assignment            text,
  status                topic_status not null default 'draft',
  created_at            timestamptz not null default now()
);
create index topics_pillar_idx on topics (pillar);
create index topics_status_idx on topics (status);

-- ---------------------------------------------------------------------------
-- kingshour_sessions  (PRD §4.6 + §6 KingsHourSession)
-- Google Meet link created manually and pasted in (no integration).
-- ---------------------------------------------------------------------------
create table kingshour_sessions (
  id           uuid primary key default gen_random_uuid(),
  topic_id     uuid references topics (id) on delete set null,
  date         timestamptz not null,
  description  text,
  facilitator  text,
  meet_link    text,                          -- pasted manually; warn in admin if empty before invites
  resources    text[],
  status       session_status not null default 'upcoming',
  created_at   timestamptz not null default now()
);
create index kingshour_sessions_date_idx   on kingshour_sessions (date);
create index kingshour_sessions_status_idx on kingshour_sessions (status);

-- ---------------------------------------------------------------------------
-- registrations  (PRD §6 Registration/Attendance)
-- Combines RSVP + attendance for a member/session pair.
-- ---------------------------------------------------------------------------
create table registrations (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references members (id) on delete cascade,
  session_id          uuid not null references kingshour_sessions (id) on delete cascade,
  registration_status registration_status not null default 'registered',
  attendance_status   attendance_status not null default 'unknown',
  follow_up_completed boolean not null default false,
  created_at          timestamptz not null default now(),
  unique (member_id, session_id)
);
create index registrations_member_idx  on registrations (member_id);
create index registrations_session_idx on registrations (session_id);

-- ---------------------------------------------------------------------------
-- communications  (PRD §6 Communication) — full timeline per member.
-- ---------------------------------------------------------------------------
create table communications (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid not null references members (id) on delete cascade,
  type              communication_type not null,
  session_id        uuid references kingshour_sessions (id) on delete set null,  -- for lifecycle emails
  subject           text,
  sent_at           timestamptz not null default now(),
  opened            boolean not null default false,
  calendar_accepted boolean not null default false,
  provider_id       text                        -- external id from email provider (Resend)
);
create index communications_member_idx on communications (member_id);
create index communications_type_idx   on communications (type);

-- ---------------------------------------------------------------------------
-- Row Level Security (STUB — tighten when admin auth is wired, PRD §5)
-- V1 has no member accounts; only admins authenticate. Writes to members /
-- census go through server-side route handlers using the service role key,
-- which bypasses RLS. Client-side anon access is denied by default here.
-- ---------------------------------------------------------------------------
alter table members            enable row level security;
alter table census_responses   enable row level security;
alter table census_progress    enable row level security;
alter table topics             enable row level security;
alter table kingshour_sessions enable row level security;
alter table registrations      enable row level security;
alter table communications     enable row level security;

-- No permissive policies yet: anon/client cannot read or write directly.
-- Server routes use the service role (bypasses RLS). When admin auth lands,
-- add "authenticated admin" read/write policies per table here.
-- TODO(auth): add admin policies; add narrow public-insert path for census if
-- the census ever writes directly from the browser instead of via /api/census.
