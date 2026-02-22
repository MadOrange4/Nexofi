-- ============================================================
-- Nexofi — Default user accounts
-- Run this AFTER migration_users.sql
--
-- Passwords are SHA-256 hashed.
-- Default accounts:
--   manager  / manager123   (Manager role)
--   sarah    / sarah123     (Employee — Sarah K.)
--   raj      / raj123       (Employee — Raj P.)
--   ana      / ana123       (Employee — Ana D.)
--   mike     / mike123      (Employee — Mike K.)
--   james    / james123     (Employee — James S.)
--   lisa     / lisa123       (Employee — Lisa M.)
--   priya    / priya123     (Employee — Priya S.)
--   tom      / tom123       (Employee — Tom M.)
-- ============================================================

INSERT INTO public.users (username, password_hash, role, employee_id, display_name) VALUES
  ('manager', encode(digest('manager123', 'sha256'), 'hex'), 'manager', NULL,  'Manager'),
  ('sarah',   encode(digest('sarah123',   'sha256'), 'hex'), 'employee', 'sk', 'Sarah K.'),
  ('raj',     encode(digest('raj123',     'sha256'), 'hex'), 'employee', 'rp', 'Raj P.'),
  ('ana',     encode(digest('ana123',     'sha256'), 'hex'), 'employee', 'ad', 'Ana D.'),
  ('mike',    encode(digest('mike123',    'sha256'), 'hex'), 'employee', 'mk', 'Mike K.'),
  ('james',   encode(digest('james123',   'sha256'), 'hex'), 'employee', 'js', 'James S.'),
  ('lisa',    encode(digest('lisa123',    'sha256'), 'hex'), 'employee', 'lm', 'Lisa M.'),
  ('priya',   encode(digest('priya123',   'sha256'), 'hex'), 'employee', 'ps', 'Priya S.'),
  ('tom',     encode(digest('tom123',     'sha256'), 'hex'), 'employee', 'tm', 'Tom M.')
ON CONFLICT (username) DO NOTHING;
