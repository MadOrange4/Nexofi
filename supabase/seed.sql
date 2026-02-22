-- ============================================================
-- Nexofi — Seed Data
-- Run this in the Supabase SQL Editor AFTER migration.sql
-- ============================================================

-- Desks
insert into public.desks (id, label) values
  ('d1', 'Desk 1'), ('d2', 'Desk 2'), ('d3', 'Desk 3'),
  ('d4', 'Desk 4'), ('d5', 'Desk 5'), ('d6', 'Desk 6'),
  ('d7', 'Open'),   ('d8', 'Open'),   ('d9', 'Open')
on conflict (id) do nothing;

-- Employees
insert into public.employees (id, name, initials, color, role, skills, status, current_task, efficiency_score, work_hours_today, break_minutes_today, desk_id) values
  ('sk', 'Sarah K.',  'SK', '#6366f1', 'Senior Frontend Engineer', '{"React","TypeScript","CSS","Auth"}',         'working',  'Auth Module',       97.2, 6.5, 18, 'd1'),
  ('rp', 'Raj P.',    'RP', '#8b5cf6', 'Backend Engineer',         '{"Node.js","Python","PostgreSQL","API"}',      'working',  'API Endpoints',     94.8, 6.0, 22, 'd2'),
  ('ad', 'Ana D.',    'AD', '#ec4899', 'Frontend Engineer',        '{"React","Vue","CSS","Figma"}',                'working',  'Frontend Refactor', 91.5, 5.5, 30, 'd3'),
  ('mk', 'Mike K.',   'MK', '#f59e0b', 'DevOps Engineer',          '{"Docker","AWS","CI/CD","Kubernetes"}',        'meeting',  'Sprint Planning',   89.1, 5.0, 15, 'd4'),
  ('js', 'James S.',  'JS', '#10b981', 'Full Stack Engineer',      '{"React","Node.js","GraphQL","API"}',          'break',    'Rate Limiting',     88.3, 4.5, 45, 'd5'),
  ('lm', 'Lisa M.',   'LM', '#f43f5e', 'QA Engineer',              '{"Testing","Cypress","Playwright","QA"}',      'working',  'E2E Test Suite',    92.0, 6.2, 20, 'd6'),
  ('ps', 'Priya S.',  'PS', '#94a3b8', 'Data Engineer',            '{"Python","SQL","dbt","Analytics"}',           'time-off', null,                87.5, 0,   0,  null),
  ('tm', 'Tom M.',    'TM', '#06b6d4', 'Mobile Engineer',          '{"React Native","iOS","Android","TypeScript"}','offline',  null,                85.0, 0,   0,  null)
on conflict (id) do nothing;

-- Projects
insert into public.projects (id, name, description, progress, status, team_ids, created_at) values
  ('p1', 'Customer Portal v2',        'Full redesign of the customer-facing portal with new auth, dashboard, and analytics.', 62, 'active',   '{"sk","rp","ad","js"}', '2026-01-15'),
  ('p2', 'Internal Analytics Platform','Build an internal data platform for tracking KPIs, team performance, and project health.', 28, 'active',   '{"ps","rp","lm"}',     '2026-02-01'),
  ('p3', 'Mobile App — iOS & Android', 'Native-feeling React Native app wrapping the core product for mobile users.',            10, 'planning', '{"tm","sk","lm"}',     '2026-02-18')
on conflict (id) do nothing;

-- Tasks
insert into public.tasks (id, project_id, title, tag, status, assignee_id, estimated_hours) values
  ('t1',  'p1', 'Setup authentication service',           'Backend',    'done',         'sk', null),
  ('t2',  'p1', 'Design database schema',                 'Database',   'done',         'rp', null),
  ('t3',  'p1', 'Build login / signup UI',                'Frontend',   'done',         'ad', null),
  ('t4',  'p1', 'Implement rate limiting',                'Backend',    'in-progress',  'js', 4),
  ('t5',  'p1', 'Add WebSocket handlers',                 'Backend',    'in-progress',  'rp', 6),
  ('t6',  'p1', 'Dashboard analytics charts',             'Frontend',   'todo',         'ad', 8),
  ('t7',  'p1', 'Implement rate limiting cache layer',    'Backend',    'ai-suggested', null, 3),
  ('t8',  'p1', 'Add real-time notifications',            'Full Stack', 'ai-suggested', null, 5),
  ('t9',  'p2', 'Data pipeline architecture',             'Data',       'done',         'ps', null),
  ('t10', 'p2', 'ETL jobs for metrics',                   'Data',       'in-progress',  'ps', 10),
  ('t11', 'p2', 'Metrics dashboard UI',                   'Frontend',   'todo',         'ad', 12),
  ('t12', 'p2', 'Automated reporting emails',             'Backend',    'ai-suggested', null, 4),
  ('t13', 'p3', 'Setup React Native project',             'Mobile',     'done',         'tm', null),
  ('t14', 'p3', 'Auth screens',                           'Mobile',     'todo',         'tm', 6),
  ('t15', 'p3', 'Push notification service',              'Backend',    'ai-suggested', null, 5),
  ('t16', 'p3', 'Offline sync strategy',                  'Mobile',     'ai-suggested', null, 8)
on conflict (id) do nothing;
