drop policy if exists "Allow dashboard article management" on public.insights_articles;
drop policy if exists "Allow public published article reads" on public.insights_articles;
drop policy if exists "Allow authenticated article management" on public.insights_articles;
drop policy if exists "Allow public insight article reads" on public.insights_articles;
drop policy if exists "Allow public insight article publishing" on public.insights_articles;
drop policy if exists "Allow public insight featured updates" on public.insights_articles;
drop policy if exists "Allow public insight article deletes" on public.insights_articles;

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
