// FIX: Create proper users table separate from Supabase auth.users
require('dotenv').config();
const { Client } = require('pg');

const DIRECT_URL = 'postgresql://postgres:L0pjxBE7tZZCWT5H@db.buhxshqfkypquptmmdyy.supabase.co:5432/postgres';

const client = new Client({
    connectionString: DIRECT_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixUsersTable() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        console.log('\n🔧 Creating proper app_users table...');

        // Create a NEW clean users table for your app
        await client.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id VARCHAR(255) PRIMARY KEY,
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
                password_hash VARCHAR(255),
                email_verified BOOLEAN DEFAULT false,
                tier VARCHAR(50) DEFAULT 'free',
                wins_balance INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ app_users table created');

        // Copy data from old users table (only your custom users, not Supabase auth users)
        console.log('\n📦 Migrating data from users to app_users...');
        await client.query(`
            INSERT INTO app_users (id, email, first_name, last_name, email_verified, wins_balance, created_at, updated_at)
            SELECT 
                id::VARCHAR(255), 
                email, 
                COALESCE(first_name, 'User'), 
                COALESCE(last_name, ''), 
                COALESCE(email_verified, false),
                COALESCE(wins_balance, 0),
                created_at,
                updated_at
            FROM users
            WHERE id IS NOT NULL
            ON CONFLICT (id) DO NOTHING;
        `);
        console.log('✅ Data migrated');

        // Rename tables
        console.log('\n🔄 Renaming tables...');
        await client.query(`ALTER TABLE IF EXISTS users RENAME TO users_backup;`);
        await client.query(`ALTER TABLE app_users RENAME TO users;`);
        console.log('✅ Tables renamed');

        // Create early_access table
        console.log('\n📋 Creating early_access table...');
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

        console.log('\n✅✅✅ ALL DONE! Your users table is now clean! ✅✅✅\n');
        console.log('⚠️  Old table backed up as "users_backup"');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await client.end();
    }
}

fixUsersTable();

