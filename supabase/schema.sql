-- ============================================================
-- CSC 413 Report Library — Supabase schema
-- Run this once in your Supabase project's SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)
-- ============================================================

-- 1. Table that stores one row per uploaded report
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  group_number integer not null,
  title text not null,
  course_type text not null check (course_type in ('CSC', 'CSE', 'BOTH')),
  description text,
  file_path text not null,       -- path inside the "reports" storage bucket
  file_name text not null,       -- original file name, shown to students
  file_size bigint,              -- bytes
  uploaded_at timestamptz not null default now()
);

-- 2. Turn on Row Level Security
alter table public.reports enable row level security;

-- 3. Anyone (including students who are not logged in) can read the list of reports
create policy "Public can view reports"
  on public.reports for select
  using (true);

-- 4. Only a logged-in (admin) user can add a new report row
create policy "Authenticated users can insert reports"
  on public.reports for insert
  to authenticated
  with check (true);

-- 5. Only a logged-in (admin) user can delete a report row
create policy "Authenticated users can delete reports"
  on public.reports for delete
  to authenticated
  using (true);

-- ============================================================
-- Storage bucket setup
-- ============================================================
-- Do this part from the dashboard, it is easier than SQL:
--
-- 1. Go to Storage in the left sidebar.
-- 2. Click "New bucket".
-- 3. Name it exactly:  reports
-- 4. Toggle "Public bucket" ON (so students can download files
--    without logging in).
-- 5. Click "Create bucket".
--
-- Then add these two storage policies (Storage -> reports -> Policies):
--
--   a) "Public can read files"       -> operation: SELECT -> target roles: public
--   b) "Authenticated can upload"    -> operation: INSERT -> target roles: authenticated
--   c) "Authenticated can delete"    -> operation: DELETE -> target roles: authenticated
--
-- (Supabase's bucket policy UI creates these for you if you tick
--  "Public bucket" and then use the policy wizard, so this is
--  mostly a checklist to confirm rather than raw SQL to run.)

-- ============================================================
-- Creating your admin account
-- ============================================================
-- 1. Go to Authentication -> Users in the Supabase dashboard.
-- 2. Click "Add user" -> "Create new user".
-- 3. Enter the email and password you (the admin) want to log in with.
-- 4. Leave "Auto Confirm User" checked.
-- That email + password is what you will type into the Admin Login
-- page on the deployed site.
