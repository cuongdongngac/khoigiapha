-- Use existing activity_logs table - just add indexes if missing
-- No need to create table since it already exists

-- Add simple logging function for existing table
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action VARCHAR(50),
  p_entity_type VARCHAR(50),
  p_entity_id UUID DEFAULT NULL,
  p_details TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO activity_logs (
    user_id, action, entity_type, entity_id, details
  ) VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id, p_details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions if not already granted
GRANT SELECT, INSERT ON activity_logs TO authenticated;
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;
