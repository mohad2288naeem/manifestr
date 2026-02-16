// FORCE FIX SCHEMA - Uses DIRECT connection (not pooler)
require('dotenv').config();
const { Client } = require('pg');

// Use DIRECT connection URL (not pooler) - check your .env file
const DIRECT_URL = process.env.DIRECT_DATABASE_URL ||
    'postgresql://postgres:L0pjxBE7tZZCWT5H@db.buhxshqfkypquptmmdyy.supabase.co:5432/postgres';

console.log('Using database:', DIRECT_URL.split('@')[1]?.split(':')[0]);

const client = new Client({
    connectionString: DIRECT_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixSchema() {
    try {
        await client.connect();
        console.log('✅ Connected to database (DIRECT connection)');

        // Check current schema
        console.log('\n🔍 Checking users.id type...');
        const check = await client.query(`
            SELECT data_type FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id';
        `);
        console.log('Current type:', check.rows[0]?.data_type);

        if (check.rows[0]?.data_type === 'integer') {
            console.log('\n🔧 FIXING SCHEMA...\n');

            // Drop foreign keys
            console.log('1️⃣ Dropping foreign key constraints...');
            await client.query(`ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey CASCADE;`);
            console.log('✅ Dropped refresh_tokens FK');

            // Convert users.id
            console.log('2️⃣ Converting users.id to VARCHAR...');
            await client.query(`ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR(255);`);
            console.log('✅ users.id converted to VARCHAR');

            // Convert refresh_tokens.user_id
            console.log('3️⃣ Converting refresh_tokens.user_id to VARCHAR...');
            await client.query(`ALTER TABLE refresh_tokens ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR(255);`);
            console.log('✅ refresh_tokens.user_id converted');

        } else {
            console.log('✅ users.id is already VARCHAR - no conversion needed');
        }

        // Add missing columns (safe to run multiple times)
        console.log('\n4️⃣ Adding missing columns...');
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'free';`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS wins_balance INTEGER DEFAULT 0;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS promotional_emails BOOLEAN DEFAULT false;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise VARCHAR(255);`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(255);`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS goal TEXT;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS work_style VARCHAR(50);`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS problems TEXT;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE;`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);`);
        console.log('✅ Columns added');

        // Create early_access table
        console.log('\n5️⃣ Creating early_access table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS early_access (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);`);
        console.log('✅ early_access table created');

        console.log('\n✅✅✅ ALL SCHEMA FIXES APPLIED SUCCESSFULLY! ✅✅✅\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
    } finally {
        await client.end();
    }
}

fixSchema();

