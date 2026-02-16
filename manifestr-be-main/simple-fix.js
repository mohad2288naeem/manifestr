// SIMPLE FIX: Drop the integer ID column, keep UUID
require('dotenv').config();
const { Client } = require('pg');

// Use the same DATABASE_URL from .env (pooler)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

console.log('🔗 Using DATABASE_URL from .env (pooler connection)');

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function simpleFix() {
    try {
        await client.connect();
        console.log('✅ Connected');

        // Check what we have
        const columns = await client.query(`
            SELECT column_name, data_type, ordinal_position
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id'
            ORDER BY ordinal_position;
        `);

        console.log('📋 ID columns found:', columns.rows);

        if (columns.rows.length > 1) {
            console.log('\n🔧 FIXING: Creating fresh users table with UUID id...');

            // Step 1: Drop ALL foreign key constraints that depend on users table
            console.log('1️⃣ Dropping all foreign key constraints...');
            const fkConstraints = await client.query(`
                SELECT constraint_name, table_name
                FROM information_schema.table_constraints 
                WHERE constraint_type = 'FOREIGN KEY'
                AND constraint_name IN (
                    SELECT constraint_name
                    FROM information_schema.constraint_column_usage
                    WHERE table_name = 'users'
                );
            `);

            for (const fk of fkConstraints.rows) {
                console.log(`Dropping ${fk.table_name}.${fk.constraint_name}`);
                await client.query(`ALTER TABLE ${fk.table_name} DROP CONSTRAINT IF EXISTS ${fk.constraint_name} CASCADE;`);
            }
            console.log('✅ All foreign keys dropped');

            // Step 2: Drop ALL primary key constraints on users
            console.log('2️⃣ Dropping primary key constraints...');
            await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;`);
            await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS PK_a3ffb1c0c8416b9fc6f907b7433 CASCADE;`);
            console.log('✅ Primary keys dropped');

            // Step 3: Create fresh clean users table
            console.log('3️⃣ Creating fresh users table...');
            await client.query(`DROP TABLE IF EXISTS users_old_backup CASCADE;`);
            await client.query(`ALTER TABLE users RENAME TO users_old_backup;`);

            await client.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    first_name VARCHAR(255) DEFAULT 'User',
                    last_name VARCHAR(255) DEFAULT '',
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
                    email_verified BOOLEAN DEFAULT true,
                    tier VARCHAR(50) DEFAULT 'free',
                    wins_balance INTEGER DEFAULT 100,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            `);

            console.log('✅ Clean users table created!');
            console.log('⚠️  Old data backed up in users_old_backup');
            console.log('ℹ️  Users will need to sign up again (fresh start)');

        } else {
            console.log('✅ Only one id column - good!');
        }

        // Fix refresh_tokens table
        console.log('\n🔧 Fixing refresh_tokens table...');
        await client.query(`ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey CASCADE;`);
        await client.query(`ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS FK_3ddc983c5f7bcf132fd8732c3f4 CASCADE;`);
        await client.query(`ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey CASCADE;`);

        try {
            await client.query(`ALTER TABLE refresh_tokens ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR(255);`);
            console.log('✅ refresh_tokens.user_id converted to VARCHAR');
        } catch (e) {
            console.log('ℹ️  refresh_tokens.user_id already correct type or will be recreated');
        }

        // Create early_access
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

        console.log('\n✅✅✅ DONE! ✅✅✅');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await client.end();
    }
}

simpleFix();

