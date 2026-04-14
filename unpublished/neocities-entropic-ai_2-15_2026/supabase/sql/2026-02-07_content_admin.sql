-- Core tables + RLS for secure content publishing.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_publish_logs (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  title text,
  meta_description text,
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = uid
      and a.is_active = true
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.blog_posts enable row level security;
alter table public.page_publish_logs enable row level security;

-- admin_users policies
create policy if not exists "admin users can read themselves"
on public.admin_users
for select
using (auth.uid() = user_id);

-- blog_posts policies
create policy if not exists "public can read published blog posts"
on public.blog_posts
for select
using (is_published = true);

create policy if not exists "admins can create blog posts"
on public.blog_posts
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy if not exists "admins can edit blog posts"
on public.blog_posts
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists "admins can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- page_publish_logs policies
create policy if not exists "admins can insert publish logs"
on public.page_publish_logs
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy if not exists "admins can read publish logs"
on public.page_publish_logs
for select
to authenticated
using (public.is_admin(auth.uid()));

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();

-- Run this once after creating your auth user account.
-- replace with your real auth.users id:
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000')
-- on conflict (user_id) do update set is_active = true;
