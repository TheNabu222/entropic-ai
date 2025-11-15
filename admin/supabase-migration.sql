-- Supabase Migration for Enhanced Guestbook
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/aqxrogaltuwtlparwdkq/sql

-- =====================================================
-- STEP 1: Update existing guestbook_entries table
-- =====================================================

-- Add parent_id column for reply threading (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name='guestbook_entries' AND column_name='parent_id') THEN
        ALTER TABLE guestbook_entries ADD COLUMN parent_id BIGINT REFERENCES guestbook_entries(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add id column as primary key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name='guestbook_entries' AND column_name='id') THEN
        ALTER TABLE guestbook_entries ADD COLUMN id BIGSERIAL PRIMARY KEY;
    END IF;
END $$;

-- Add index for faster reply lookups
CREATE INDEX IF NOT EXISTS idx_guestbook_parent_id ON guestbook_entries(parent_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at DESC);


-- =====================================================
-- STEP 2: Create reactions table
-- =====================================================

CREATE TABLE IF NOT EXISTS guestbook_reactions (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL REFERENCES guestbook_entries(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) NOT NULL CHECK (reaction_type IN ('heart', 'star', 'fire', 'laugh', 'mind_blown', 'sparkles')),
    user_identifier VARCHAR(255) NOT NULL, -- Could be IP hash or session ID
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate reactions from same user
    UNIQUE(entry_id, reaction_type, user_identifier)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reactions_entry_id ON guestbook_reactions(entry_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON guestbook_reactions(reaction_type);


-- =====================================================
-- STEP 3: Create view for entry statistics
-- =====================================================

CREATE OR REPLACE VIEW guestbook_entry_stats AS
SELECT
    ge.id,
    ge.name,
    ge.message,
    ge.website,
    ge.created_at,
    ge.approved,
    ge.parent_id,
    COUNT(DISTINCT gr.id) as total_reactions,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'heart' THEN gr.id END) as heart_count,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'star' THEN gr.id END) as star_count,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'fire' THEN gr.id END) as fire_count,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'laugh' THEN gr.id END) as laugh_count,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'mind_blown' THEN gr.id END) as mind_blown_count,
    COUNT(DISTINCT CASE WHEN gr.reaction_type = 'sparkles' THEN gr.id END) as sparkles_count,
    (SELECT COUNT(*) FROM guestbook_entries WHERE parent_id = ge.id AND approved = true) as reply_count
FROM guestbook_entries ge
LEFT JOIN guestbook_reactions gr ON ge.id = gr.entry_id
GROUP BY ge.id, ge.name, ge.message, ge.website, ge.created_at, ge.approved, ge.parent_id;


-- =====================================================
-- STEP 4: Enable Row Level Security (RLS)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_reactions ENABLE ROW LEVEL SECURITY;

-- Allow reading approved entries and all their replies
CREATE POLICY "Public read approved entries" ON guestbook_entries
    FOR SELECT USING (approved = true OR parent_id IS NOT NULL);

-- Allow anyone to insert entries (will need approval)
CREATE POLICY "Public can insert entries" ON guestbook_entries
    FOR INSERT WITH CHECK (true);

-- Allow reading all reactions
CREATE POLICY "Public read reactions" ON guestbook_reactions
    FOR SELECT USING (true);

-- Allow anyone to add reactions
CREATE POLICY "Public can add reactions" ON guestbook_reactions
    FOR INSERT WITH CHECK (true);

-- Prevent duplicate reactions by deleting old one first
CREATE POLICY "Users can delete their reactions" ON guestbook_reactions
    FOR DELETE USING (true);


-- =====================================================
-- STEP 5: Create helper function for getting user identifier
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_identifier()
RETURNS TEXT AS $$
BEGIN
    -- Use session ID or IP hash from request
    RETURN COALESCE(
        current_setting('request.headers', true)::json->>'x-session-id',
        md5(current_setting('request.headers', true)::json->>'x-forwarded-for')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- STEP 6: Grant permissions
-- =====================================================

GRANT SELECT ON guestbook_entry_stats TO anon, authenticated;
GRANT ALL ON guestbook_entries TO anon, authenticated;
GRANT ALL ON guestbook_reactions TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;


-- =====================================================
-- DONE!
-- =====================================================

-- You can now use these tables with the updated guestbook widget
-- Test the setup with:
-- SELECT * FROM guestbook_entry_stats ORDER BY created_at DESC;
