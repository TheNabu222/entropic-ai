# Supabase -> Neocities Simple Publisher Setup

This setup gives you:
- a timeline-style blog posting form (`/admin/simple-publisher.html`)
- secure page publishing to Neocities through a Supabase Edge Function
- no Neocities secret in browser source code

## 0) Important security cleanup

You shared secrets in chat and your repo already contains hardcoded tokens/passwords.
Rotate these now:
1. Neocities API token
2. Supabase anon key (optional but recommended if exposed broadly)
3. Any hardcoded admin password in old files

## 1) Run SQL in Supabase

Open Supabase SQL Editor and run:
- `supabase/sql/2026-02-07_content_admin.sql`

## 2) Create your admin auth user

In Supabase Auth:
1. Create a user with email + password you will use in the publisher page.
2. Copy that user's UUID.
3. Run this SQL (replace UUID):

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do update set is_active = true;
```

## 3) Deploy the edge function

If you use Supabase CLI in this repo:

```bash
supabase functions deploy publish-to-neocities
```

Then set function secrets:

```bash
supabase secrets set NEOCITIES_API_TOKEN="YOUR_NEW_NEOCITIES_TOKEN"
supabase secrets set ALLOWED_PATHS="index.html,nabu222/nabl0g/index.html,nabu222/index.html,nexus/index.html,hdtv.html"
```

`ALLOWED_PATHS` is optional but strongly recommended.

## 4) Use the publisher page

Open:
- `/admin/simple-publisher.html`

Workflow:
1. Sign in with your Supabase auth email/password.
2. Use "Quick Blog Post" to post directly to blog feed.
3. Use "Publish Page To Neocities" to update `index.html` or another allowed page.

## 5) Blog page behavior

`/nabu222/nabl0g/index.html` now loads published posts from `public.blog_posts`.
Your legacy static post is still there as fallback/archive.

## 6) Old admin pages

Your old admin pages still exist, but they are insecure because they expose secrets in frontend code.
Do not use them for production publishing.
