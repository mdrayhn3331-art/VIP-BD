-- Run this SQL once in Supabase SQL Editor.
insert into storage.buckets (id,name,public) values ('avatars','avatars',true) on conflict (id) do update set public=true;

drop policy if exists "Avatar public read" on storage.objects;
create policy "Avatar public read" on storage.objects for select using (bucket_id='avatars');

drop policy if exists "Avatar owner upload" on storage.objects;
create policy "Avatar owner upload" on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "Avatar owner update" on storage.objects;
create policy "Avatar owner update" on storage.objects for update to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "Avatar owner delete" on storage.objects;
create policy "Avatar owner delete" on storage.objects for delete to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

-- Make sure profiles has this column:
alter table public.profiles add column if not exists avatar_url text;