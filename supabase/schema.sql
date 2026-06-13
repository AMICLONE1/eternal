-- Eternal — Supabase schema (manual alternative to Prisma).
-- PREFERRED PATH: `npx prisma db push` with prisma/schema.prisma, then run
-- prisma/rls.sql. Use this file only if you'd rather paste SQL in the
-- Supabase SQL editor — it produces the same shape Prisma expects.

create table if not exists bookings (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,     -- ETR-XXXXXX, computed by the app
  customer_name text not null,
  phone         text not null,            -- validated +91 format
  services      jsonb not null,           -- [{slug, name, price, duration_min, category}]
  category      text,                     -- him | her | mixed
  date          date not null,
  slot_start    time not null,
  slot_end      time not null,
  note          text,
  status        text not null default 'pending',  -- pending | confirmed | completed | cancelled | no_show
  source        text not null default 'website',
  wa_notified   boolean default false,
  created_at    timestamptz default now()
);

create index if not exists bookings_date_slot_idx on bookings (date, slot_start);

create table if not exists services (
  slug         text primary key,
  name         text not null,
  category     text not null,             -- him | her | everyone
  group_name   text,                      -- Hair, Skin, Spa, Bridal...
  price        numeric(10,2),             -- null if price-on-request
  duration_min int not null,
  is_active    boolean default true,
  sort         int
);

create table if not exists salon_config (
  key   text primary key,                 -- working_hours, slot_capacity, slot_granularity...
  value jsonb not null
);

-- Row-level security: server-only access; anon may read active services.
alter table bookings     enable row level security;
alter table services     enable row level security;
alter table salon_config enable row level security;

drop policy if exists "anon can read active services" on services;
create policy "anon can read active services"
  on services for select
  to anon
  using (is_active = true);
