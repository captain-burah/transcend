create table if not exists public.dashboard_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  status text not null default 'invited' check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dashboard_users_user_id_idx
  on public.dashboard_users(user_id);

create index if not exists dashboard_users_role_idx
  on public.dashboard_users(role);

alter table public.dashboard_users enable row level security;

create or replace function public.has_dashboard_role(required_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.dashboard_users dashboard_user
    where dashboard_user.status <> 'disabled'
      and dashboard_user.role = any(required_roles)
      and (
        dashboard_user.user_id = auth.uid()
        or lower(dashboard_user.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

drop policy if exists "Dashboard users can read own profile" on public.dashboard_users;
drop policy if exists "Admins can read dashboard users" on public.dashboard_users;
drop policy if exists "Admins can insert dashboard users" on public.dashboard_users;
drop policy if exists "Admins can update dashboard users" on public.dashboard_users;
drop policy if exists "Admins can delete dashboard users" on public.dashboard_users;

create policy "Dashboard users can read own profile"
  on public.dashboard_users
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or public.has_dashboard_role(array['admin'])
  );

create policy "Admins can insert dashboard users"
  on public.dashboard_users
  for insert
  to authenticated
  with check (
    public.has_dashboard_role(array['admin'])
    or not exists (
      select 1
      from public.dashboard_users dashboard_user
      where dashboard_user.role = 'admin'
        and dashboard_user.status <> 'disabled'
    )
  );

create policy "Admins can update dashboard users"
  on public.dashboard_users
  for update
  to authenticated
  using (public.has_dashboard_role(array['admin']))
  with check (public.has_dashboard_role(array['admin']));

create policy "Admins can delete dashboard users"
  on public.dashboard_users
  for delete
  to authenticated
  using (public.has_dashboard_role(array['admin']));

drop policy if exists "Allow dashboard article management" on public.insights_articles;
drop policy if exists "Allow authenticated article management" on public.insights_articles;
drop policy if exists "Allow public published article reads" on public.insights_articles;

create policy "Allow public published article reads"
  on public.insights_articles
  for select
  to anon, authenticated
  using (status = 'published' or public.has_dashboard_role(array['admin', 'editor', 'viewer']));

create policy "Allow admin and editor article inserts"
  on public.insights_articles
  for insert
  to authenticated
  with check (public.has_dashboard_role(array['admin', 'editor']));

create policy "Allow admin and editor article updates"
  on public.insights_articles
  for update
  to authenticated
  using (public.has_dashboard_role(array['admin', 'editor']))
  with check (public.has_dashboard_role(array['admin', 'editor']));

create policy "Allow admin and editor article deletes"
  on public.insights_articles
  for delete
  to authenticated
  using (public.has_dashboard_role(array['admin', 'editor']));
