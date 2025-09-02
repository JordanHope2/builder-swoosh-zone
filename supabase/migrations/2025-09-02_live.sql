-- Jobs table (if not already present)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  skills_req text[] not null default '{}',
  skills_nice text[] not null default '{}',
  seniority text check (seniority in ('junior','mid','senior','lead')),
  location text,
  remote boolean default false,
  visa_sponsor boolean default false,
  salary_min int,
  salary_max int,
  contract_type text,
  company_id uuid references public.companies(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- RLS
alter table public.jobs enable row level security;

-- Public can read published jobs; only owner (creator) can mutate.
create policy "read_published_jobs"
on public.jobs for select
to anon, authenticated
using (true);

create policy "owner_can_write_jobs"
on public.jobs for all
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

-- Storage buckets
insert into storage.buckets (id, name, public) values ('public-assets','public-assets', true)
on conflict (id) do nothing;

-- Storage policy: public read, write by authenticated
create policy "public_read_assets"
on storage.objects for select
to anon
using (bucket_id = 'public-assets');

create policy "auth_write_assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'public-assets');
