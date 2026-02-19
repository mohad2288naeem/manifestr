-- =============================================
-- SAFE MIGRATION - ONLY ADDS COLUMNS
-- Does NOT drop any tables or delete any data
-- Safe to run on production with existing customers
-- Can be run multiple times (idempotent)
-- =============================================

-- ===== ADD MISSING COLUMNS TO generation_jobs =====
-- These will be added ONLY if they don't exist
-- Existing data is NOT touched!

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS title VARCHAR(255);

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS prompt TEXT;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS output_type VARCHAR(50);

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS meta JSONB;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS current_step_data JSONB;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS final_url TEXT;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;

ALTER TABLE generation_jobs 
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- ===== VERIFY COLUMNS EXIST =====
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'generation_jobs'
ORDER BY ordinal_position;

-- ===== SUCCESS MESSAGE =====
SELECT '✅ SAFE MIGRATION COMPLETE! All columns added without touching existing data!' as result;

