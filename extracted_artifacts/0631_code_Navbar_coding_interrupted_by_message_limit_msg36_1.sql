-- Drop and recreate function with correct column name
DROP FUNCTION IF EXISTS increment_page_view(TEXT, BOOLEAN);

CREATE OR REPLACE FUNCTION increment_page_view(
    p_page_path TEXT,
    p_should_increment BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
    current_count INTEGER;
BEGIN
    IF p_should_increment THEN
        INSERT INTO page_views (page_path, view_count, last_updated)
        VALUES (p_page_path, 1, NOW())
        ON CONFLICT (page_path) 
        DO UPDATE SET 
            view_count = page_views.view_count + 1,
            last_updated = NOW();  -- Changed from last_viewed!
    END IF;
    
    SELECT view_count INTO current_count
    FROM page_views
    WHERE page_path = p_page_path;
    
    RETURN COALESCE(current_count, 0);
END;
$$ LANGUAGE plpgsql;
