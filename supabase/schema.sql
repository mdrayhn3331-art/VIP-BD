-- VIP BD safe membership schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.vip_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  duration_days integer not null check (duration_days > 0),
  benefits text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vip_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.vip_plans(id),
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.vip_plans enable row level security;
alter table public.vip_purchases enable row level security;
alter table public.products enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security invoker as $$
  select exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin');
$$;

create policy "Public can view active plans" on public.vip_plans for select to anon, authenticated using (is_active or public.is_admin());
create policy "Public can view active products" on public.products for select to anon, authenticated using (is_active or public.is_admin());
create policy "Users can view own profile" on public.profiles for select to authenticated using ((select auth.uid())=id or public.is_admin());
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Users can view own purchases" on public.vip_purchases for select to authenticated using ((select auth.uid())=user_id or public.is_admin());
create policy "Users can create own purchase" on public.vip_purchases for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Admins manage plans" on public.vip_plans for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage purchases" on public.vip_purchases for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.vip_plans(name,price,duration_days,benefits) values
('VIP Bronze',500,7,'Basic VIP membership benefits'),
('VIP Silver',1000,15,'Silver membership benefits'),
('VIP Gold',2000,30,'Gold membership benefits'),
('VIP Platinum',5000,60,'Platinum membership benefits'),
('VIP Diamond',10000,90,'Diamond membership benefits')
on conflict do nothing;