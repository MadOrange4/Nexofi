-- ============================================================
-- Nexofi — Supabase Schema Migration
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Employees
create table if not exists public.employees (
  id text primary key,
  name text not null,
  initials text not null,
  color text not null default '#6366f1',
  role text not null default '',
  skills text[] not null default '{}',
  status text not null default 'offline'
    check (status in ('working', 'break', 'offline', 'time-off', 'meeting')),
  current_task text,
  efficiency_score numeric not null default 0,
  work_hours_today numeric not null default 0,
  break_minutes_today numeric not null default 0,
  desk_id text,
  created_at timestamptz not null default now()
);

-- Projects
create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text not null default '',
  progress integer not null default 0,
  status text not null default 'planning'
    check (status in ('active', 'planning', 'completed')),
  team_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Tasks (belong to a project)
create table if not exists public.tasks (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references public.projects(id) on delete cascade,
  title text not null,
  tag text not null default '',
  status text not null default 'todo'
    check (status in ('done', 'in-progress', 'todo', 'ai-suggested')),
  assignee_id text references public.employees(id) on delete set null,
  estimated_hours numeric,
  created_at timestamptz not null default now()
);

-- Desks
create table if not exists public.desks (
  id text primary key,
  label text not null default 'Open'
);

-- ============================================================
-- Row Level Security (allow all for now — tighten later)
-- ============================================================
alter table public.employees  enable row level security;
alter table public.projects   enable row level security;
alter table public.tasks      enable row level security;
alter table public.desks      enable row level security;

-- Public read/write policies (anon key)
create policy "Allow all on employees" on public.employees for all using (true) with check (true);
create policy "Allow all on projects"  on public.projects  for all using (true) with check (true);
create policy "Allow all on tasks"     on public.tasks     for all using (true) with check (true);
create policy "Allow all on desks"     on public.desks     for all using (true) with check (true);

-- ============================================================
-- Enable Realtime on all tables
-- ============================================================
alter publication supabase_realtime add table public.employees;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.desks;
