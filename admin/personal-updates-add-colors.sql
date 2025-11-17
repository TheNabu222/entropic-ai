-- Add color scheme field to personal_updates table
-- Run this AFTER the main migration if the table already exists

ALTER TABLE personal_updates
ADD COLUMN IF NOT EXISTS color_scheme VARCHAR(50) DEFAULT 'default';

-- Update the color_scheme column for existing records
UPDATE personal_updates SET color_scheme = 'default' WHERE color_scheme IS NULL;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Color scheme field added successfully!';
    RAISE NOTICE 'You can now assign custom colors to your updates.';
END $$;
