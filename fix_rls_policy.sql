-- Fix RLS Policy for user_addresses table
-- This policy allows all operations for now (temporary solution)

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can select own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON user_addresses;
DROP POLICY IF EXISTS "Allow authenticated selects" ON user_addresses;
DROP POLICY IF EXISTS "Allow authenticated updates" ON user_addresses;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON user_addresses;

-- Temporarily disable RLS for testing
ALTER TABLE user_addresses DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled but make it permissive:
-- ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations" ON user_addresses
--   FOR ALL TO public
--   USING (true)
--   WITH CHECK (true); 