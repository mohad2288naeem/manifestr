-- =============================================
-- MANIFESTR - FINAL CLEAN SCHEMA
-- Run this ONCE in Supabase SQL Editor
-- =============================================

-- Drop old tables (fresh start)
DROP TABLE IF EXISTS vault_items CASCADE;
DROP TABLE IF EXISTS style_guides CASCADE;
DROP TABLE IF EXISTS generation_jobs CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;

-- Backup existing users (with unique timestamp)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        EXECUTE 'ALTER TABLE users RENAME TO users_backup_' || EXTRACT(EPOCH FROM NOW())::bigint;
    END IF;
END $$;

-- ===== USERS TABLE =====
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dob DATE,
    country VARCHAR(100),
    gender VARCHAR(50),
    promotional_emails BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    expertise VARCHAR(255),
    job_title VARCHAR(255),
    industry VARCHAR(255),
    goal TEXT,
    work_style VARCHAR(50),
    problems TEXT,
    email_verified BOOLEAN DEFAULT true,
    tier VARCHAR(50) DEFAULT 'free',
    wins_balance INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== EARLY ACCESS =====
CREATE TABLE IF NOT EXISTS early_access (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);

-- ===== VAULT ITEMS =====
CREATE TABLE vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'file',
    status VARCHAR(50) DEFAULT 'Draft',
    project VARCHAR(255),
    file_key VARCHAR(500),
    thumbnail_url TEXT,
    size INTEGER,
    parent_id UUID REFERENCES vault_items(id) ON DELETE CASCADE,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_items_user_id ON vault_items(user_id);

-- ===== STYLE GUIDES =====
CREATE TABLE style_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo JSONB,
    typography JSONB,
    colors JSONB,
    style JSONB,
    is_completed BOOLEAN DEFAULT false,
    current_step INTEGER DEFAULT 1,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_style_guides_user_id ON style_guides(user_id);

-- ===== GENERATION JOBS =====
CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    type VARCHAR(100),
    input_data JSONB,
    result JSONB,
    error TEXT,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);

-- ===== MOTIVATION QUOTES (Optional) =====
CREATE TABLE IF NOT EXISTS motivation_quotes (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== REFRESH TOKENS (Optional) =====
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT false,
    device_name VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== AUTO-UPDATE TRIGGERS =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_items_updated_at BEFORE UPDATE ON vault_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_guides_updated_at BEFORE UPDATE ON style_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generation_jobs_updated_at BEFORE UPDATE ON generation_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DONE!
SELECT '✅ SCHEMA CREATED! TypeORM removed, Supabase ready!' as result;

