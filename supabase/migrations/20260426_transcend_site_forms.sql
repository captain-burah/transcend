create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  sector text,
  team_size text,
  challenge text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions
  add column if not exists phone text,
  add column if not exists sector text,
  add column if not exists team_size text,
  add column if not exists challenge text;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.insights_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  category text not null,
  read_time text not null,
  published_at text,
  excerpt text not null,
  body text not null,
  author text not null default 'Transcend Consultancy',
  status text not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.insights_articles enable row level security;

create policy "Allow public contact submissions"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

create policy "Allow public newsletter subscriptions"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

create policy "Allow public insight article reads"
  on public.insights_articles
  for select
  to anon
  using (true);

create policy "Allow public insight article publishing"
  on public.insights_articles
  for insert
  to anon
  with check (true);

create policy "Allow public insight featured updates"
  on public.insights_articles
  for update
  to anon
  using (true)
  with check (true);

create policy "Allow public insight article deletes"
  on public.insights_articles
  for delete
  to anon
  using (true);
