-- Personal Updates System Migration
-- Run this in your Supabase SQL editor at:
-- https://supabase.com/dashboard/project/aqxrogaltuwtlparwdkq/sql

-- Create personal_updates table
CREATE TABLE IF NOT EXISTS personal_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200),
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('artwork', 'poetry', 'blog', 'video', 'update', 'announcement')),
    media_type VARCHAR(20) CHECK (media_type IN ('none', 'youtube', 'gif', 'image', 'soundcloud')),
    media_url TEXT,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    color_scheme VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add color_scheme column if it doesn't exist (for existing tables)
ALTER TABLE personal_updates
ADD COLUMN IF NOT EXISTS color_scheme VARCHAR(50) DEFAULT 'default';

-- Create index for efficient queries
CREATE INDEX idx_personal_updates_created_at ON personal_updates(created_at DESC);
CREATE INDEX idx_personal_updates_published ON personal_updates(published);
CREATE INDEX idx_personal_updates_category ON personal_updates(category);

-- Enable Row Level Security
ALTER TABLE personal_updates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published updates
CREATE POLICY "Anyone can read published updates"
    ON personal_updates
    FOR SELECT
    USING (published = true);

-- Policy: Allow all operations for authenticated users (admin)
-- Note: For now, we'll allow inserts/updates from anon for simplicity
-- You can add authentication later
CREATE POLICY "Allow all operations for managing updates"
    ON personal_updates
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_personal_updates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_personal_updates_timestamp
    BEFORE UPDATE ON personal_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_personal_updates_timestamp();

-- Grant permissions
GRANT SELECT ON personal_updates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON personal_updates TO anon, authenticated;

-- Insert some example data
INSERT INTO personal_updates (title, content, category, media_type, media_url, published, featured)
VALUES
    (
        'Welcome to My Portal',
        'This is the beginning of something cosmic. Watch this space for artwork, poetry, music, and musings from the void.',
        'announcement',
        'gif',
        '/assets/misc_gif/rainbow.gif',
        true,
        true
    ),
    (
        'PIP is Here',
        'Meet PIP, my 3D pollywog companion. Click them to see their animations and hear their boops!',
        'update',
        'none',
        null,
        true,
        false
    );

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Personal updates table created successfully!';
    RAISE NOTICE 'Run this SQL in your Supabase dashboard to set up the backend.';
END $$;
