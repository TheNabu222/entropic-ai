-- Make sure policies allow everything for testing
DROP POLICY IF EXISTS "Allow public read" ON page_views;
DROP POLICY IF EXISTS "Allow public upsert" ON page_views;

CREATE POLICY "Allow all" ON page_views
    FOR ALL USING (true) WITH CHECK (true);
