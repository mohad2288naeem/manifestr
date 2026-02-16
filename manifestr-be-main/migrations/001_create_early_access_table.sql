-- Migration: Create early_access table
-- Run this on your production database

CREATE TABLE IF NOT EXISTS early_access (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_early_access_status ON early_access(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);

SELECT 'Early access table created successfully!' as message;

