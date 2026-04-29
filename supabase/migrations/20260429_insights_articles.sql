create table if not exists public.insights_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  read_time text not null,
  excerpt text not null,
  body text not null,
  author text not null default 'Transcend Consultancy',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insights_articles_status_published_idx
  on public.insights_articles(status, published_at desc);

create index if not exists insights_articles_featured_idx
  on public.insights_articles(featured)
  where status = 'published';

alter table public.insights_articles enable row level security;

drop policy if exists "Allow public published article reads" on public.insights_articles;
drop policy if exists "Allow dashboard article management" on public.insights_articles;
drop policy if exists "Allow authenticated article management" on public.insights_articles;

create policy "Allow public published article reads"
  on public.insights_articles
  for select
  to anon, authenticated
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Allow authenticated article management"
  on public.insights_articles
  for all
  to authenticated
  using (true)
  with check (true);
