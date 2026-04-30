drop policy if exists "Allow admin and editor article inserts" on public.insights_articles;
drop policy if exists "Allow admin and editor article updates" on public.insights_articles;
drop policy if exists "Allow admin and editor article deletes" on public.insights_articles;
drop policy if exists "Allow authenticated article management" on public.insights_articles;

create policy "Allow authenticated article management"
  on public.insights_articles
  for all
  to authenticated
  using (true)
  with check (true);
