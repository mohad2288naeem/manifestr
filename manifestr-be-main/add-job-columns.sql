-- Add missing columns to generation_jobs table
-- Run this in Supabase SQL Editor

ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS output_type VARCHAR(50);
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS meta JSONB;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS current_step_data JSONB;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS final_url TEXT;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS error_message TEXT;

SELECT '✅ generation_jobs columns added!' as result;

