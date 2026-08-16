-- Create admin_config table for storing admin password and session tokens
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Disable RLS so the anon key can read/write (dashboard is password-protected at app level)
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Allow anon role full access (auth is handled by the app, not Supabase RLS)
CREATE POLICY "Allow anon full access to admin_config"
  ON admin_config
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default password: "admin123"
-- The hash is SHA-256 of "admin123" + SHA-256 of the Supabase URL as salt
-- You MUST change this password after first login!
-- The app will compute the hash at runtime, so we need to insert the pre-computed hash.
-- NOTE: Run this AFTER the table is created, then immediately log in and change the password.
