-- =====================================================================
-- Marketing House — database schema
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent-ish:
-- safe to re-run on an empty project.
-- =====================================================================

-- gen_random_uuid() is built into Postgres 13+ (no extension needed).

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Admins: a user is an admin only if they have a row here.
-- Being "authenticated" alone grants nothing. Public sign-ups must be disabled.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text not null default 'palette',
  hue int not null default 270,
  title_ar text not null,
  title_en text not null,
  short_ar text not null default '',
  short_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  tags jsonb not null default '[]',           -- [{ar,en}]
  deliverables jsonb not null default '[]',   -- [{title_ar,title_en,text_ar,text_en}]
  process_steps jsonb not null default '[]',  -- [{title_ar,title_en,text_ar,text_en}]
  faqs jsonb not null default '[]',           -- [{q_ar,q_en,a_ar,a_en}]
  cover_image text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  client_ar text not null default '',
  client_en text not null default '',
  category_id uuid references public.project_categories (id) on delete set null,
  year int not null default extract(year from now())::int,
  service_slugs text[] not null default '{}',
  summary_ar text not null default '',
  summary_en text not null default '',
  challenge_ar text not null default '',
  challenge_en text not null default '',
  solution_ar text not null default '',
  solution_en text not null default '',
  results jsonb not null default '[]',        -- [{value,suffix,label_ar,label_en}]
  cover_image text,
  hue int not null default 270,
  is_featured boolean not null default false,
  is_placeholder boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  url text not null,
  alt_ar text not null default '',
  alt_en text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  role_ar text not null default '',
  role_en text not null default '',
  company_ar text not null default '',
  company_en text not null default '',
  quote_ar text not null,
  quote_en text not null,
  photo text,
  rating int not null default 5 check (rating between 1 and 5),
  is_placeholder boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  role_ar text not null default '',
  role_en text not null default '',
  photo text,
  socials jsonb not null default '{}',        -- {linkedin,instagram,facebook}
  is_placeholder boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  url text,
  is_placeholder boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name_ar text not null,
  name_en text not null,
  city_ar text not null,
  city_en text not null,
  address_ar text not null,
  address_en text not null,
  phone text not null default '',
  whatsapp text not null default '',
  map_embed_url text not null default '',
  map_link text not null default '',
  working_hours_ar text not null default '',
  working_hours_en text not null default '',
  map_x numeric not null default 50,          -- position on the stylized Egypt map (0–100)
  map_y numeric not null default 50,
  is_main boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Singleton row (id = 1).
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  facebook text not null default '',
  instagram text not null default '',
  linkedin text not null default '',
  commercial_reg_no text not null default '',
  tax_card_no text not null default '',
  stat_projects int not null default 0,
  stat_clients int not null default 0,
  stat_years int not null default 0,
  stat_campaigns int not null default 0,
  seo_title_ar text not null default '',
  seo_title_en text not null default '',
  seo_description_ar text not null default '',
  seo_description_en text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Leads (CRM)
-- ---------------------------------------------------------------------

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'qualified', 'won', 'lost');
exception when duplicate_object then null; end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service_id uuid references public.services (id) on delete set null,
  branch_id uuid references public.branches (id) on delete set null,
  budget text,
  message text not null,
  source_page text,
  locale text not null default 'ar',
  status public.lead_status not null default 'new',
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at);

-- ---------------------------------------------------------------------
-- Rate limiting (service role only)
-- ---------------------------------------------------------------------

create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);

-- Returns true when the call is allowed, false when the limit is exceeded.
create or replace function public.check_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_count int;
begin
  insert into public.rate_limits as rl (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case when rl.window_start < now() - make_interval(secs => p_window_seconds) then 1 else rl.count + 1 end,
        window_start = case when rl.window_start < now() - make_interval(secs => p_window_seconds) then now() else rl.window_start end
  returning count into v_count;

  -- Opportunistic cleanup of stale keys.
  delete from public.rate_limits where window_start < now() - interval '1 day';
  return v_count <= p_limit;
end $$;

revoke all on function public.check_rate_limit(text, int, int) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array['services','project_categories','projects','testimonials','team_members','clients','branches','site_settings','leads']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.clients enable row level security;
alter table public.branches enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.rate_limits enable row level security;  -- no policies: service role only

-- Admins can see their own membership row (used by the app to verify access).
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated using (user_id = auth.uid());

-- Published content: readable by everyone; full access for admins.
do $$
declare t text;
begin
  foreach t in array array['services','project_categories','projects','testimonials','team_members','clients','branches']
  loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (is_published or public.is_admin())', t);
    execute format('drop policy if exists "admin all" on public.%I', t);
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

drop policy if exists "public read images" on public.project_images;
create policy "public read images" on public.project_images for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and (p.is_published or public.is_admin())));
drop policy if exists "admin all" on public.project_images;
create policy "admin all" on public.project_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin all" on public.site_settings;
create policy "admin all" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Leads: NO public access at all. Inserts happen only in the contact Server
-- Action with the service-role key (after honeypot + rate limit + zod).
drop policy if exists "admin all" on public.leads;
create policy "admin all" on public.leads for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin all" on public.lead_notes;
create policy "admin all" on public.lead_notes for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket, admin-only writes
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
