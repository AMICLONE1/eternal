-- Run ONCE in the Supabase SQL editor after `npx prisma db push`.
-- Prisma owns tables/columns/indexes; this file owns what Prisma can't:
-- row-level security. The website reaches the DB only through the server
-- (service-role key or direct Prisma connection), so anon stays locked out.

alter table bookings     enable row level security;
alter table services     enable row level security;
alter table salon_config enable row level security;

drop policy if exists "anon can read active services" on services;
create policy "anon can read active services"
  on services for select
  to anon
  using (is_active = true);

-- No anon policies on bookings/salon_config: server-side access only.
