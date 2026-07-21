-- Welcome email is a one-time lifecycle event, not a page-view side effect.
-- Keep the earliest historical welcome log per King, remove accidental duplicates, then let
-- Postgres reject every future duplicate claim (including concurrent completion requests).

with ranked_welcomes as (
  select
    id,
    row_number() over (partition by member_id order by sent_at asc, id asc) as occurrence
  from communications
  where type = 'welcome'
)
delete from communications
where id in (
  select id from ranked_welcomes where occurrence > 1
);

create unique index communications_one_welcome_per_member_idx
  on communications (member_id)
  where type = 'welcome';
