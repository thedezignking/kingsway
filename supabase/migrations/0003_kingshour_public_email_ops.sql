-- Kingsway V1 — KingsHour public lead magnets + lean email operations.
-- Apply after 0002_welcome_email_idempotency.sql.

alter type communication_type add value if not exists 'confirmation';

alter table kingshour_sessions
  add column if not exists slug text unique,
  add column if not exists public_status text not null default 'draft'
    check (public_status in ('draft', 'published')),
  add column if not exists public_title text,
  add column if not exists public_summary text,
  add column if not exists public_body text,
  add column if not exists public_image_url text,
  add column if not exists public_image_alt text,
  add column if not exists public_image_aspect text not null default '1:1'
    check (public_image_aspect in ('1:1', '4:5'));

create unique index if not exists kingshour_sessions_slug_idx
  on kingshour_sessions (slug)
  where slug is not null;
create index if not exists kingshour_sessions_public_status_idx
  on kingshour_sessions (public_status);

alter table registrations
  add column if not exists source text,
  add column if not exists source_detail text;

create table if not exists email_queue (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members (id) on delete cascade,
  session_id uuid references kingshour_sessions (id) on delete set null,
  type communication_type not null,
  recipient_email text not null,
  subject text not null,
  html text,
  text_body text,
  idempotency_key text,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed', 'skipped_quota', 'cancelled')),
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  provider_id text,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_queue_status_idx on email_queue (status);
create index if not exists email_queue_scheduled_for_idx on email_queue (scheduled_for);
create index if not exists email_queue_session_idx on email_queue (session_id);

alter table email_queue enable row level security;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  props jsonb not null default '{}'::jsonb,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_idx on analytics_events (event);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at);

alter table analytics_events enable row level security;
