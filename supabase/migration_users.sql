-- ============================================================
-- Nexofi — Users table for simple username/password auth
-- Run this in the Supabase SQL Editor AFTER migration.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('manager', 'employee')),
  employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (permissive for development)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all users" ON public.users FOR ALL USING (true) WITH CHECK (true);
