-- JCSC 2K30 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Members table
create table members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  roll_number text,
  section text,
  photo_url text,
  future_plan text,
  quote text,
  facebook_url text,
  instagram_url text,
  position text default 'student', -- student, cr, vice_cr, monitor
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Gallery table
create table gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  caption text,
  event_name text,
  taken_at date,
  created_at timestamptz default now()
);

-- Notices table
create table notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  is_important boolean default false,
  created_at timestamptz default now()
);

-- Achievements table
create table achievements (
  id uuid default uuid_generate_v4() primary key,
  member_id uuid references members(id) on delete cascade,
  title text not null,
  description text,
  year integer,
  created_at timestamptz default now()
);

-- Admin table (single admin)
create table admins (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Storage bucket for photos
insert into storage.buckets (id, name, public) values ('jcsc-photos', 'jcsc-photos', true);

-- RLS Policies
alter table members enable row level security;
alter table gallery enable row level security;
alter table notices enable row level security;
alter table achievements enable row level security;

-- Public read
create policy "public read members" on members for select using (true);
create policy "public read gallery" on gallery for select using (true);
create policy "public read notices" on notices for select using (true);
create policy "public read achievements" on achievements for select using (true);

-- Authenticated write (admin only via service role in API)
create policy "auth insert members" on members for insert with check (auth.role() = 'authenticated');
create policy "auth update members" on members for update using (auth.role() = 'authenticated');
create policy "auth delete members" on members for delete using (auth.role() = 'authenticated');

create policy "auth insert gallery" on gallery for insert with check (auth.role() = 'authenticated');
create policy "auth update gallery" on gallery for update using (auth.role() = 'authenticated');
create policy "auth delete gallery" on gallery for delete using (auth.role() = 'authenticated');

create policy "auth insert notices" on notices for insert with check (auth.role() = 'authenticated');
create policy "auth update notices" on notices for update using (auth.role() = 'authenticated');
create policy "auth delete notices" on notices for delete using (auth.role() = 'authenticated');

create policy "auth insert achievements" on achievements for insert with check (auth.role() = 'authenticated');
create policy "auth update achievements" on achievements for update using (auth.role() = 'authenticated');
create policy "auth delete achievements" on achievements for delete using (auth.role() = 'authenticated');

-- Storage policy
create policy "public read photos" on storage.objects for select using (bucket_id = 'jcsc-photos');
create policy "auth upload photos" on storage.objects for insert with check (bucket_id = 'jcsc-photos' and auth.role() = 'authenticated');
create policy "auth delete photos" on storage.objects for delete using (bucket_id = 'jcsc-photos' and auth.role() = 'authenticated');
